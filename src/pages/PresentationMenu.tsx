import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Box, Flex, Heading, Text, Button, Input, VStack, HStack,
  SimpleGrid, Badge, IconButton, useToast, Table, Thead,
  Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack,
  Textarea, FormControl, FormLabel, Spinner, Card, CardBody,
  InputGroup, InputLeftElement, Select, Tag, TagLabel,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiCopy, FiLogOut, FiPlus, FiX, FiExternalLink, FiBarChart2,
  FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiEyeOff,
  FiRefreshCw,
} from 'react-icons/fi';
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

const DECK_COLOR_MAP: Record<string, string> = Object.fromEntries(DECKS.map(d => [d.key, d.color]));

const PAGE_SIZE = 10;

// ---- Helpers ----
function getInviteStatus(inv: PresentationInvite): 'active' | 'expired' | 'maxed' | 'inactive' {
  if (!inv.is_active) return 'inactive';
  if (inv.expires_at && new Date(inv.expires_at) < new Date()) return 'expired';
  if (inv.max_uses !== null && inv.uses_count >= inv.max_uses) return 'maxed';
  return 'active';
}

function statusBadge(status: ReturnType<typeof getInviteStatus>) {
  const map = {
    active:   { color: 'green',  label: 'Ativo' },
    expired:  { color: 'yellow', label: 'Expirado' },
    maxed:    { color: 'orange', label: 'Esgotado' },
    inactive: { color: 'red',    label: 'Inativo' },
  };
  const { color, label } = map[status];
  return <Badge colorScheme={color} fontSize="xs" variant="subtle">{label}</Badge>;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

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
      setForm({
        recipient_name: '', recipient_email: '', recipient_company: '',
        recipient_role: '', notes: '', allowed_decks: ['*'],
        max_uses: null, expires_at: null,
      });
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
    <Box bg="gray.800" p={6} borderRadius="xl" border="1px solid" borderColor="gray.700" mb={6}>
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
              placeholder="João Silva"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Email</FormLabel>
            <Input
              type="email"
              value={form.recipient_email || ''}
              onChange={e => setForm(f => ({ ...f, recipient_email: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
              placeholder="joao@empresa.com"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Empresa</FormLabel>
            <Input
              value={form.recipient_company || ''}
              onChange={e => setForm(f => ({ ...f, recipient_company: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
              placeholder="Empresa LTDA"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.300" fontSize="sm">Cargo</FormLabel>
            <Input
              value={form.recipient_role || ''}
              onChange={e => setForm(f => ({ ...f, recipient_role: e.target.value }))}
              bg="gray.700" color="white" border="none" size="sm"
              placeholder="CTO"
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
            <FormLabel color="gray.300" fontSize="sm">Max views (vazio = ilimitado)</FormLabel>
            <Input
              type="number"
              value={form.max_uses ?? ''}
              onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
              bg="gray.700" color="white" border="none" size="sm"
              placeholder="10"
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
            placeholder="Ex: contato feito na FEBRABAN Tech"
          />
        </FormControl>

        <Button type="submit" colorScheme="purple" size="sm" w="full" isLoading={loading}>
          Criar e copiar link
        </Button>
      </VStack>
    </Box>
  );
}

// ---- Invite Table with Pagination ----
function InviteTable({
  invites,
  onToggle,
  onViewEvents,
  search,
  statusFilter,
  deckFilter,
}: {
  invites: PresentationInvite[];
  onToggle: (id: string, active: boolean) => void;
  onViewEvents: (code: string) => void;
  search: string;
  statusFilter: string;
  deckFilter: string;
}) {
  const toast = useToast();
  const [page, setPage] = useState(0);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [search, statusFilter, deckFilter]);

  const filtered = useMemo(() => {
    let result = invites;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(inv =>
        inv.recipient_name.toLowerCase().includes(q) ||
        (inv.recipient_company || '').toLowerCase().includes(q) ||
        (inv.recipient_email || '').toLowerCase().includes(q) ||
        inv.code.toLowerCase().includes(q) ||
        (inv.notes || '').toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(inv => getInviteStatus(inv) === statusFilter);
    }

    // Deck filter
    if (deckFilter !== 'all') {
      result = result.filter(inv =>
        inv.allowed_decks.includes('*') || inv.allowed_decks.includes(deckFilter)
      );
    }

    return result;
  }, [invites, search, statusFilter, deckFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

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
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500" fontSize="sm">Nenhum invite criado ainda.</Text>
      </Box>
    );
  }

  if (filtered.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500" fontSize="sm">Nenhum invite encontrado com esses filtros.</Text>
      </Box>
    );
  }

  return (
    <>
      <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor="gray.700">
        <Table size="sm" variant="simple">
          <Thead bg="gray.800">
            <Tr>
              <Th color="gray.400" borderColor="gray.700">Nome</Th>
              <Th color="gray.400" borderColor="gray.700" display={{ base: 'none', md: 'table-cell' }}>Empresa</Th>
              <Th color="gray.400" borderColor="gray.700">Código</Th>
              <Th color="gray.400" borderColor="gray.700" display={{ base: 'none', lg: 'table-cell' }}>Decks</Th>
              <Th color="gray.400" borderColor="gray.700" isNumeric>Views</Th>
              <Th color="gray.400" borderColor="gray.700">Status</Th>
              <Th color="gray.400" borderColor="gray.700" display={{ base: 'none', md: 'table-cell' }}>Criado</Th>
              <Th color="gray.400" borderColor="gray.700" w="1px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageItems.map(inv => {
              const status = getInviteStatus(inv);
              return (
                <Tr key={inv.id} _hover={{ bg: 'gray.800' }} transition="background 0.15s">
                  <Td borderColor="gray.700" py={3}>
                    <VStack align="start" spacing={0}>
                      <Text color="white" fontSize="sm" fontWeight="500">{inv.recipient_name}</Text>
                      {inv.recipient_email && (
                        <Text color="gray.500" fontSize="xs">{inv.recipient_email}</Text>
                      )}
                      {/* Mobile: show company inline */}
                      {inv.recipient_company && (
                        <Text color="gray.500" fontSize="xs" display={{ base: 'block', md: 'none' }}>
                          {inv.recipient_company}
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td borderColor="gray.700" display={{ base: 'none', md: 'table-cell' }}>
                    <Text color="gray.300" fontSize="sm">{inv.recipient_company || '—'}</Text>
                    {inv.recipient_role && (
                      <Text color="gray.500" fontSize="xs">{inv.recipient_role}</Text>
                    )}
                  </Td>
                  <Td borderColor="gray.700">
                    <Text fontFamily="mono" color="purple.300" fontSize="sm" fontWeight="600">{inv.code}</Text>
                  </Td>
                  <Td borderColor="gray.700" display={{ base: 'none', lg: 'table-cell' }}>
                    <HStack spacing={1} flexWrap="wrap">
                      {inv.allowed_decks.includes('*')
                        ? <Tag size="sm" colorScheme="purple" variant="subtle"><TagLabel>Todos</TagLabel></Tag>
                        : inv.allowed_decks.map(d => (
                            <Tag key={d} size="sm" colorScheme={DECK_COLOR_MAP[d] || 'gray'} variant="subtle">
                              <TagLabel>{d}</TagLabel>
                            </Tag>
                          ))
                      }
                    </HStack>
                  </Td>
                  <Td borderColor="gray.700" isNumeric>
                    <Text color="gray.300" fontSize="sm" fontWeight="500">
                      {inv.uses_count}
                      {inv.max_uses ? (
                        <Text as="span" color="gray.500" fontWeight="400">/{inv.max_uses}</Text>
                      ) : null}
                    </Text>
                  </Td>
                  <Td borderColor="gray.700">
                    {statusBadge(status)}
                  </Td>
                  <Td borderColor="gray.700" display={{ base: 'none', md: 'table-cell' }}>
                    <Tooltip label={new Date(inv.created_at).toLocaleString('pt-BR')} placement="top" hasArrow>
                      <Text color="gray.500" fontSize="xs" cursor="default">{relativeTime(inv.created_at)}</Text>
                    </Tooltip>
                  </Td>
                  <Td borderColor="gray.700">
                    <HStack spacing={0}>
                      <Tooltip label="Copiar link" hasArrow>
                        <IconButton
                          aria-label="Copiar link"
                          icon={<FiCopy />}
                          size="xs"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'white' }}
                          onClick={() => copyLink(inv.code)}
                        />
                      </Tooltip>
                      <Tooltip label="Abrir link" hasArrow>
                        <IconButton
                          aria-label="Abrir link"
                          icon={<FiExternalLink />}
                          size="xs"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'white' }}
                          onClick={() => openLink(inv.code)}
                        />
                      </Tooltip>
                      <Tooltip label="Ver eventos" hasArrow>
                        <IconButton
                          aria-label="Ver eventos"
                          icon={<FiBarChart2 />}
                          size="xs"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'purple.300' }}
                          onClick={() => onViewEvents(inv.code)}
                        />
                      </Tooltip>
                      <Tooltip label={inv.is_active ? 'Desativar' : 'Ativar'} hasArrow>
                        <IconButton
                          aria-label={inv.is_active ? 'Desativar' : 'Ativar'}
                          icon={inv.is_active ? <FiEyeOff /> : <FiEye />}
                          size="xs"
                          variant="ghost"
                          color={inv.is_active ? 'gray.400' : 'green.400'}
                          _hover={{ color: inv.is_active ? 'red.300' : 'green.300' }}
                          onClick={() => onToggle(inv.id, !inv.is_active)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Flex justify="space-between" align="center" mt={4} px={1}>
        <Text color="gray.500" fontSize="xs">
          {filtered.length} invite{filtered.length !== 1 ? 's' : ''}
          {search || statusFilter !== 'all' || deckFilter !== 'all'
            ? ` (de ${invites.length} total)`
            : ''}
        </Text>
        {totalPages > 1 && (
          <HStack spacing={2}>
            <IconButton
              aria-label="Página anterior"
              icon={<FiChevronLeft />}
              size="xs"
              variant="ghost"
              color="gray.400"
              isDisabled={safePage === 0}
              onClick={() => setPage(p => p - 1)}
            />
            <Text color="gray.400" fontSize="xs" minW="80px" textAlign="center">
              {safePage + 1} de {totalPages}
            </Text>
            <IconButton
              aria-label="Próxima página"
              icon={<FiChevronRight />}
              size="xs"
              variant="ghost"
              color="gray.400"
              isDisabled={safePage >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            />
          </HStack>
        )}
      </Flex>
    </>
  );
}

// ---- Events Panel ----
function EventsPanel({ code, onClose }: { code: string; onClose: () => void }) {
  const [events, setEvents] = useState<PresentationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventPage, setEventPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setEventPage(0);
    listEvents(code).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [code]);

  const totalEventPages = Math.max(1, Math.ceil(events.length / 20));
  const pageEvents = events.slice(eventPage * 20, (eventPage + 1) * 20);

  // Group stats
  const stats = useMemo(() => {
    const sessionStarts = events.filter(e => e.event_type === 'session_start').length;
    const uniqueDecks = new Set(events.filter(e => e.deck).map(e => e.deck!)).size;
    const totalSeconds = events
      .filter(e => e.event_type === 'slide_engagement' && e.seconds)
      .reduce((sum, e) => sum + (e.seconds || 0), 0);
    const maxSlide = Math.max(0, ...events.filter(e => e.slide_index != null).map(e => e.slide_index!));
    return { sessionStarts, uniqueDecks, totalSeconds: Math.round(totalSeconds), maxSlide };
  }, [events]);

  return (
    <Box bg="gray.800" p={5} borderRadius="xl" border="1px solid" borderColor="gray.700">
      <HStack justify="space-between" mb={4}>
        <HStack spacing={3}>
          <Heading size="sm" color="white">Eventos</Heading>
          <Text fontFamily="mono" color="purple.300" fontSize="sm">{code}</Text>
        </HStack>
        <IconButton aria-label="Fechar" icon={<FiX />} size="sm" variant="ghost" color="gray.400" onClick={onClose} />
      </HStack>

      {loading ? (
        <Flex justify="center" py={6}><Spinner color="purple.400" size="sm" /></Flex>
      ) : events.length === 0 ? (
        <Text color="gray.500" fontSize="sm" textAlign="center" py={6}>Nenhum evento registrado.</Text>
      ) : (
        <>
          {/* Stats bar */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
            <Box bg="gray.750" px={3} py={2} borderRadius="lg">
              <Text color="gray.500" fontSize="xs">Sessões</Text>
              <Text color="white" fontWeight="600">{stats.sessionStarts}</Text>
            </Box>
            <Box bg="gray.750" px={3} py={2} borderRadius="lg">
              <Text color="gray.500" fontSize="xs">Decks vistos</Text>
              <Text color="white" fontWeight="600">{stats.uniqueDecks}</Text>
            </Box>
            <Box bg="gray.750" px={3} py={2} borderRadius="lg">
              <Text color="gray.500" fontSize="xs">Tempo total</Text>
              <Text color="white" fontWeight="600">
                {stats.totalSeconds >= 60
                  ? `${Math.floor(stats.totalSeconds / 60)}min ${stats.totalSeconds % 60}s`
                  : `${stats.totalSeconds}s`}
              </Text>
            </Box>
            <Box bg="gray.750" px={3} py={2} borderRadius="lg">
              <Text color="gray.500" fontSize="xs">Slide máx</Text>
              <Text color="white" fontWeight="600">{stats.maxSlide + 1}</Text>
            </Box>
          </SimpleGrid>

          <Box overflowX="auto" maxH="350px" overflowY="auto" borderRadius="lg" border="1px solid" borderColor="gray.700">
            <Table size="sm">
              <Thead bg="gray.750" position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th color="gray.400" borderColor="gray.700">Tipo</Th>
                  <Th color="gray.400" borderColor="gray.700">Deck</Th>
                  <Th color="gray.400" borderColor="gray.700" isNumeric>Slide</Th>
                  <Th color="gray.400" borderColor="gray.700" isNumeric>Tempo</Th>
                  <Th color="gray.400" borderColor="gray.700">Quando</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageEvents.map(ev => (
                  <Tr key={ev.id} _hover={{ bg: 'gray.750' }}>
                    <Td borderColor="gray.700">
                      <Badge
                        fontSize="xs"
                        variant="subtle"
                        colorScheme={
                          ev.event_type === 'session_start' ? 'green'
                          : ev.event_type === 'session_end' ? 'red'
                          : ev.event_type === 'slide_engagement' ? 'blue'
                          : 'gray'
                        }
                      >
                        {ev.event_type}
                      </Badge>
                    </Td>
                    <Td borderColor="gray.700">
                      {ev.deck ? (
                        <Tag size="sm" colorScheme={DECK_COLOR_MAP[ev.deck] || 'gray'} variant="subtle">
                          <TagLabel>{ev.deck}</TagLabel>
                        </Tag>
                      ) : (
                        <Text color="gray.600" fontSize="xs">—</Text>
                      )}
                    </Td>
                    <Td borderColor="gray.700" color="gray.300" fontSize="xs" isNumeric>
                      {ev.slide_index != null ? ev.slide_index + 1 : '—'}
                    </Td>
                    <Td borderColor="gray.700" color="gray.300" fontSize="xs" isNumeric>
                      {ev.seconds != null ? `${Math.round(ev.seconds)}s` : '—'}
                    </Td>
                    <Td borderColor="gray.700">
                      <Tooltip label={new Date(ev.created_at).toLocaleString('pt-BR')} hasArrow>
                        <Text color="gray.500" fontSize="xs" cursor="default">{relativeTime(ev.created_at)}</Text>
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Events pagination */}
          {totalEventPages > 1 && (
            <Flex justify="space-between" align="center" mt={3}>
              <Text color="gray.500" fontSize="xs">{events.length} eventos</Text>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Anterior"
                  icon={<FiChevronLeft />}
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  isDisabled={eventPage === 0}
                  onClick={() => setEventPage(p => p - 1)}
                />
                <Text color="gray.400" fontSize="xs" minW="60px" textAlign="center">
                  {eventPage + 1}/{totalEventPages}
                </Text>
                <IconButton
                  aria-label="Próxima"
                  icon={<FiChevronRight />}
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  isDisabled={eventPage >= totalEventPages - 1}
                  onClick={() => setEventPage(p => p + 1)}
                />
              </HStack>
            </Flex>
          )}
        </>
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

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deckFilter, setDeckFilter] = useState('all');

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

  // Summary stats
  const stats = useMemo(() => {
    const active = invites.filter(i => getInviteStatus(i) === 'active').length;
    const totalViews = invites.reduce((sum, i) => sum + i.uses_count, 0);
    return { total: invites.length, active, totalViews };
  }, [invites]);

  return (
    <Box minH="100vh" bg="gray.900" p={{ base: 4, md: 8 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <Heading size="lg" color="white">Apresentações</Heading>
          <HStack spacing={4}>
            <Text color="gray.500" fontSize="sm">{stats.total} invites</Text>
            <Text color="green.400" fontSize="sm">{stats.active} ativos</Text>
            <Text color="purple.300" fontSize="sm">{stats.totalViews} views</Text>
          </HStack>
        </VStack>
        <Button leftIcon={<FiLogOut />} variant="ghost" color="gray.400" size="sm" onClick={onSignOut}>
          Sair
        </Button>
      </Flex>

      {/* Deck cards */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={3} mb={10}>
        {DECKS.map(d => (
          <Card
            key={d.key}
            bg="gray.800"
            cursor="pointer"
            _hover={{ bg: 'gray.700', transform: 'translateY(-2px)', borderColor: `${d.color}.500` }}
            transition="all 0.2s"
            onClick={() => openDeck(d.key, d.path)}
            border="1px solid"
            borderColor="gray.700"
          >
            <CardBody py={4} px={4}>
              <Badge colorScheme={d.color} mb={2} fontSize="xs">{d.label}</Badge>
              <Text color="gray.500" fontSize="xs">Abrir deck</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Invites section */}
      <Box mb={6}>
        <Flex
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          mb={5}
          direction={{ base: 'column', md: 'row' }}
          gap={3}
        >
          <Heading size="md" color="white">Invites</Heading>
          <HStack spacing={2}>
            <IconButton
              aria-label="Atualizar"
              icon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              color="gray.400"
              onClick={loadInvites}
              isLoading={loadingInvites}
            />
            <InviteForm onCreated={loadInvites} />
          </HStack>
        </Flex>

        {/* Filters bar */}
        <Flex
          gap={3}
          mb={5}
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
        >
          <InputGroup size="sm" maxW={{ md: '320px' }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nome, empresa, código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              bg="gray.800"
              color="white"
              border="1px solid"
              borderColor="gray.700"
              _focus={{ borderColor: 'purple.500' }}
              _placeholder={{ color: 'gray.500' }}
              borderRadius="lg"
            />
          </InputGroup>
          <HStack spacing={2}>
            <Select
              size="sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              bg="gray.800"
              color="white"
              border="1px solid"
              borderColor="gray.700"
              _focus={{ borderColor: 'purple.500' }}
              borderRadius="lg"
              maxW="160px"
            >
              <option value="all" style={{ background: '#1A202C' }}>Todos status</option>
              <option value="active" style={{ background: '#1A202C' }}>Ativos</option>
              <option value="expired" style={{ background: '#1A202C' }}>Expirados</option>
              <option value="maxed" style={{ background: '#1A202C' }}>Esgotados</option>
              <option value="inactive" style={{ background: '#1A202C' }}>Inativos</option>
            </Select>
            <Select
              size="sm"
              value={deckFilter}
              onChange={e => setDeckFilter(e.target.value)}
              bg="gray.800"
              color="white"
              border="1px solid"
              borderColor="gray.700"
              _focus={{ borderColor: 'purple.500' }}
              borderRadius="lg"
              maxW="160px"
            >
              <option value="all" style={{ background: '#1A202C' }}>Todos decks</option>
              {DECKS.map(d => (
                <option key={d.key} value={d.key} style={{ background: '#1A202C' }}>{d.label}</option>
              ))}
            </Select>
            {(search || statusFilter !== 'all' || deckFilter !== 'all') && (
              <Button
                size="xs"
                variant="ghost"
                color="gray.400"
                onClick={() => { setSearch(''); setStatusFilter('all'); setDeckFilter('all'); }}
              >
                Limpar
              </Button>
            )}
          </HStack>
        </Flex>

        {loadingInvites ? (
          <Flex justify="center" py={10}><Spinner color="purple.400" /></Flex>
        ) : (
          <InviteTable
            invites={invites}
            onToggle={handleToggle}
            onViewEvents={code => setEventsCode(code)}
            search={search}
            statusFilter={statusFilter}
            deckFilter={deckFilter}
          />
        )}
      </Box>

      {/* Events panel */}
      {eventsCode && (
        <Box ref={eventsPanelRef} mt={6}>
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
