import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Flex, Heading, Text, Button, Input, VStack, HStack,
  SimpleGrid, Badge, IconButton, useToast, Table, Thead,
  Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack,
  Textarea, FormControl, FormLabel, Spinner, Card, CardBody,
} from '@chakra-ui/react';
import { FiCopy, FiLogOut, FiPlus, FiX, FiExternalLink, FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import {
  createInvite, listInvites, toggleInviteActive, listEvents,
  type PresentationInvite, type CreateInviteInput, type PresentationEvent,
} from '../lib/invites';
import { initTrackingSession } from '../lib/presentationTracking';

// ---- Clipboard helper ----
async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch { /* fallback below */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

// ---- Deck definitions ----
const DECKS = [
  { key: 'comercial', label: 'Comercial', color: 'purple', path: '/apresentacao/comercial' },
  { key: 'investidor', label: 'Investidor', color: 'blue', path: '/apresentacao/investidor' },
  { key: 'varejo', label: 'Varejo', color: 'green', path: '/apresentacao/varejo' },
  { key: 'fintech', label: 'Fintech', color: 'orange', path: '/apresentacao/fintech' },
  { key: 'seguros', label: 'Seguros', color: 'red', path: '/apresentacao/seguros' },
] as const;

// ---- Login Form ----
function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.900">
      <Box bg="gray.800" p={8} borderRadius="xl" w="full" maxW="400px">
        <VStack spacing={6} as="form" onSubmit={handleSubmit}>
          <Heading size="lg" color="white">Apresentações</Heading>
          <Text color="gray.400" fontSize="sm">Acesso administrativo</Text>
          {error && (
            <Text color="red.400" fontSize="sm" w="full">{error}</Text>
          )}
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              bg="gray.700"
              color="white"
              border="none"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Senha</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              bg="gray.700"
              color="white"
              border="none"
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="purple" w="full" isLoading={loading}>
            Entrar
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

// ---- Invite Form ----
function InviteForm({ onCreated }: { onCreated: () => void }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateInviteInput>({
    recipient_name: '',
    recipient_email: '',
    recipient_company: '',
    recipient_role: '',
    notes: '',
    allowed_decks: ['*'],
    max_uses: null,
    expires_at: null,
  });

  const handleDeckChange = (values: string[]) => {
    setForm(f => ({ ...f, allowed_decks: values.length === 0 ? ['*'] : values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invite = await createInvite(form);
      const link = `${window.location.origin}/apresentacao/i/${invite.code}`;
      await copyToClipboard(link);
      toast({
        title: 'Invite criado!',
        description: `Link copiado: ${link}`,
        status: 'success',
        duration: 5000,
      });
      setOpen(false);
      setForm({ recipient_name: '', allowed_decks: ['*'] });
      onCreated();
    } catch (err) {
      toast({
        title: 'Erro ao criar invite',
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button leftIcon={<FiPlus />} colorScheme="purple" size="sm" onClick={() => setOpen(true)}>
        Novo Invite
      </Button>
    );
  }

  return (
    <Box bg="gray.750" p={6} borderRadius="lg" border="1px solid" borderColor="gray.600">
      <HStack justify="space-between" mb={4}>
        <Heading size="sm" color="white">Novo Invite</Heading>
        <IconButton aria-label="Fechar" icon={<FiX />} size="sm" variant="ghost" color="gray.400" onClick={() => setOpen(false)} />
      </HStack>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel color="gray.300" fontSize="sm">Nome</FormLabel>
            <Input
              value={form.recipient_name}
              onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Email</FormLabel>
            <Input
              type="email"
              value={form.recipient_email || ''}
              onChange={e => setForm(f => ({ ...f, recipient_email: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Empresa</FormLabel>
            <Input
              value={form.recipient_company || ''}
              onChange={e => setForm(f => ({ ...f, recipient_company: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Cargo</FormLabel>
            <Input
              value={form.recipient_role || ''}
              onChange={e => setForm(f => ({ ...f, recipient_role: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel color="gray.300" fontSize="sm">Decks permitidos</FormLabel>
          <CheckboxGroup
            value={form.allowed_decks.includes('*') ? DECKS.map(d => d.key) : form.allowed_decks}
            onChange={handleDeckChange}
          >
            <Stack direction="row" flexWrap="wrap" spacing={3}>
              {DECKS.map(d => (
                <Checkbox key={d.key} value={d.key} colorScheme={d.color} color="gray.300" size="sm">
                  {d.label}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Max usos (vazio = ilimitado)</FormLabel>
            <Input
              type="number"
              value={form.max_uses ?? ''}
              onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
              bg="gray.700" color="white" border="none" size="sm"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Expira em</FormLabel>
            <Input
              type="datetime-local"
              value={form.expires_at ?? ''}
              onChange={e => setForm(f => ({ ...f, expires_at: e.target.value || null }))}
              bg="gray.700" color="white" border="none" size="sm"
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel color="gray.300" fontSize="sm">Notas internas</FormLabel>
          <Textarea
            value={form.notes || ''}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            bg="gray.700" color="white" border="none" size="sm" rows={2}
          />
        </FormControl>

        <Button type="submit" colorScheme="purple" size="sm" w="full" isLoading={loading}>
          Criar e copiar link
        </Button>
      </VStack>
    </Box>
  );
}

// ---- Invite Table ----
function InviteTable({
  invites,
  onToggle,
  onViewEvents,
}: {
  invites: PresentationInvite[];
  onToggle: (id: string, active: boolean) => void;
  onViewEvents: (code: string) => void;
}) {
  const toast = useToast();

  const copyLink = async (code: string) => {
    const link = `${window.location.origin}/apresentacao/i/${code}`;
    await copyToClipboard(link);
    toast({ title: 'Link copiado!', status: 'info', duration: 2000 });
  };

  const openLink = (code: string) => {
    const link = `${window.location.origin}/apresentacao/i/${code}`;
    window.open(link, '_blank');
  };

  if (invites.length === 0) {
    return <Text color="gray.500" fontSize="sm">Nenhum invite criado ainda.</Text>;
  }

  return (
    <Box overflowX="auto">
      <Table size="sm" variant="simple">
        <Thead>
          <Tr>
            <Th color="gray.400">Nome</Th>
            <Th color="gray.400">Empresa</Th>
            <Th color="gray.400">Código</Th>
            <Th color="gray.400">Decks</Th>
            <Th color="gray.400" isNumeric>Usos</Th>
            <Th color="gray.400">Status</Th>
            <Th color="gray.400">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invites.map(inv => (
            <Tr key={inv.id}>
              <Td color="white" fontSize="sm">{inv.recipient_name}</Td>
              <Td color="gray.300" fontSize="sm">{inv.recipient_company || '—'}</Td>
              <Td fontFamily="mono" color="purple.300" fontSize="sm">{inv.code}</Td>
              <Td>
                <HStack spacing={1} flexWrap="wrap">
                  {inv.allowed_decks.includes('*')
                    ? <Badge colorScheme="purple" fontSize="xs">Todos</Badge>
                    : inv.allowed_decks.map(d => (
                        <Badge key={d} colorScheme="gray" fontSize="xs">{d}</Badge>
                      ))
                  }
                </HStack>
              </Td>
              <Td color="gray.300" fontSize="sm" isNumeric>
                {inv.uses_count}{inv.max_uses ? `/${inv.max_uses}` : ''}
              </Td>
              <Td>
                <Badge colorScheme={inv.is_active ? 'green' : 'red'} fontSize="xs">
                  {inv.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={1}>
                  <IconButton
                    aria-label="Copiar link"
                    icon={<FiCopy />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => copyLink(inv.code)}
                  />
                  <IconButton
                    aria-label="Abrir link"
                    icon={<FiExternalLink />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => openLink(inv.code)}
                  />
                  <IconButton
                    aria-label="Ver eventos"
                    icon={<FiBarChart2 />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => onViewEvents(inv.code)}
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme={inv.is_active ? 'red' : 'green'}
                    onClick={() => onToggle(inv.id, !inv.is_active)}
                  >
                    {inv.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

// ---- Events Panel ----
function EventsPanel({ code, onClose }: { code: string; onClose: () => void }) {
  const [events, setEvents] = useState<PresentationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEvents(code).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [code]);

  return (
    <Box bg="gray.750" p={4} borderRadius="lg" border="1px solid" borderColor="gray.600">
      <HStack justify="space-between" mb={3}>
        <Heading size="sm" color="white">Eventos — {code}</Heading>
        <IconButton aria-label="Fechar" icon={<FiX />} size="sm" variant="ghost" color="gray.400" onClick={onClose} />
      </HStack>
      {loading ? (
        <Spinner color="purple.400" size="sm" />
      ) : events.length === 0 ? (
        <Text color="gray.500" fontSize="sm">Nenhum evento registrado.</Text>
      ) : (
        <Box overflowX="auto" maxH="300px" overflowY="auto">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th color="gray.400">Tipo</Th>
                <Th color="gray.400">Deck</Th>
                <Th color="gray.400" isNumeric>Slide</Th>
                <Th color="gray.400" isNumeric>Segundos</Th>
                <Th color="gray.400">Quando</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map(ev => (
                <Tr key={ev.id}>
                  <Td color="gray.300" fontSize="xs">{ev.event_type}</Td>
                  <Td color="gray.300" fontSize="xs">{ev.deck || '—'}</Td>
                  <Td color="gray.300" fontSize="xs" isNumeric>{ev.slide_index ?? '—'}</Td>
                  <Td color="gray.300" fontSize="xs" isNumeric>{ev.seconds ?? '—'}</Td>
                  <Td color="gray.400" fontSize="xs">{new Date(ev.created_at).toLocaleString('pt-BR')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}

// ---- Admin Dashboard ----
function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const navigate = useNavigate();
  const [invites, setInvites] = useState<PresentationInvite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [eventsCode, setEventsCode] = useState<string | null>(null);
  const eventsPanelRef = useRef<HTMLDivElement>(null);

  const loadInvites = useCallback(async () => {
    setLoadingInvites(true);
    const data = await listInvites();
    setInvites(data);
    setLoadingInvites(false);
  }, []);

  useEffect(() => { loadInvites(); }, [loadInvites]);

  useEffect(() => {
    if (eventsCode && eventsPanelRef.current) {
      eventsPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [eventsCode]);

  const handleToggle = async (id: string, active: boolean) => {
    await toggleInviteActive(id, active);
    loadInvites();
  };

  const openDeck = (deckKey: string, path: string) => {
    try {
      initTrackingSession({ inviteCode: null, deck: deckKey });
    } catch { /* tracking failure should not block navigation */ }
    navigate(path);
  };

  return (
    <Box minH="100vh" bg="gray.900" p={{ base: 4, md: 8 }}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color="white">Apresentações</Heading>
        <Button leftIcon={<FiLogOut />} variant="ghost" color="gray.400" size="sm" onClick={onSignOut}>
          Sair
        </Button>
      </Flex>

      {/* Deck cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={4} mb={10}>
        {DECKS.map(d => (
          <Card
            key={d.key}
            bg="gray.800"
            cursor="pointer"
            _hover={{ bg: 'gray.700', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            onClick={() => openDeck(d.key, d.path)}
          >
            <CardBody>
              <Badge colorScheme={d.color} mb={2}>{d.label}</Badge>
              <Text color="gray.400" fontSize="sm">Abrir apresentação</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Invites section */}
      <Box mb={6}>
        <HStack justify="space-between" mb={4}>
          <Heading size="md" color="white">Invites</Heading>
          <InviteForm onCreated={loadInvites} />
        </HStack>

        {loadingInvites ? (
          <Spinner color="purple.400" />
        ) : (
          <InviteTable
            invites={invites}
            onToggle={handleToggle}
            onViewEvents={code => setEventsCode(code)}
          />
        )}
      </Box>

      {/* Events panel */}
      {eventsCode && (
        <Box ref={eventsPanelRef}>
          <EventsPanel code={eventsCode} onClose={() => setEventsCode(null)} />
        </Box>
      )}
    </Box>
  );
}

// ---- Main page ----
export function PresentationMenu() {
  const { user, loading, signIn, signOut } = useSupabaseAuth();

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.900">
        <Spinner color="purple.400" size="lg" />
      </Flex>
    );
  }

  if (!user) {
    return <LoginForm onLogin={signIn} />;
  }

  return <Dashboard onSignOut={signOut} />;
}
