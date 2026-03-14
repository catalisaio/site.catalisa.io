import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Box, Flex, Heading, Text, Button, Input, VStack, HStack,
  SimpleGrid, Badge, IconButton, useToast, Table, Thead,
  Tbody, Tr, Th, Td, Checkbox, CheckboxGroup, Stack,
  Textarea, FormControl, FormLabel, Spinner, Card, CardBody,
  InputGroup, InputLeftElement, Select, Tag, TagLabel,
  Tooltip, Container,
} from '@chakra-ui/react';
import {
  FiCopy, FiLogOut, FiPlus, FiX, FiExternalLink, FiBarChart2,
  FiSearch, FiChevronLeft, FiChevronRight, FiEye, FiEyeOff,
  FiRefreshCw,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import {
  createInvite, listInvites, toggleInviteActive, listEvents,
  type PresentationInvite, type CreateInviteInput, type PresentationEvent,
} from '../../lib/invites';
import { initTrackingSession } from '../../lib/presentationTracking';

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
  { key: 'economics', label: 'Economics', color: 'teal', path: '/apresentacao/economics' },
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

function StatusBadge({ status, t }: { status: ReturnType<typeof getInviteStatus>; t: (key: string) => string }) {
  const map = {
    active:   { color: 'green',  label: t('inviteTable.statusActive') },
    expired:  { color: 'yellow', label: t('inviteTable.statusExpired') },
    maxed:    { color: 'orange', label: t('inviteTable.statusMaxed') },
    inactive: { color: 'red',    label: t('inviteTable.statusInactive') },
  };
  const { color, label } = map[status];
  return <Badge colorScheme={color} fontSize="xs" variant="subtle">{label}</Badge>;
}

function relativeTime(dateStr: string, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('time.now');
  if (mins < 60) return t('time.minutes', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('time.hours', { count: hours });
  const days = Math.floor(hours / 24);
  if (days < 30) return t('time.days', { count: days });
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

// ---- Invite Form ----
function InviteForm({ onCreated, t }: { onCreated: () => void; t: (key: string, opts?: Record<string, unknown>) => string }) {
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
        title: t('inviteForm.successTitle'),
        description: t('inviteForm.successDescription', { link }),
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
        title: t('inviteForm.errorTitle'),
        description: err instanceof Error ? err.message : t('inviteForm.errorUnknown'),
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button leftIcon={<FiPlus />} colorScheme="purple" size="sm" onClick={() => setOpen(true)}>
        {t('inviteForm.newInvite')}
      </Button>
    );
  }

  return (
    <Box bg="gray.50" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200" mb={6}>
      <HStack justify="space-between" mb={4}>
        <Heading size="sm" color="gray.800">{t('inviteForm.heading')}</Heading>
        <IconButton aria-label="Close" icon={<FiX />} size="sm" variant="ghost" color="gray.500" onClick={() => setOpen(false)} />
      </HStack>
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.name')}</FormLabel>
            <Input
              value={form.recipient_name}
              onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))}
              size="sm"
              placeholder={t('inviteForm.namePlaceholder')}
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.email')}</FormLabel>
            <Input
              type="email"
              value={form.recipient_email || ''}
              onChange={e => setForm(f => ({ ...f, recipient_email: e.target.value }))}
              size="sm"
              placeholder={t('inviteForm.emailPlaceholder')}
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.company')}</FormLabel>
            <Input
              value={form.recipient_company || ''}
              onChange={e => setForm(f => ({ ...f, recipient_company: e.target.value }))}
              size="sm"
              placeholder={t('inviteForm.companyPlaceholder')}
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.role')}</FormLabel>
            <Input
              value={form.recipient_role || ''}
              onChange={e => setForm(f => ({ ...f, recipient_role: e.target.value }))}
              size="sm"
              placeholder={t('inviteForm.rolePlaceholder')}
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.allowedDecks')}</FormLabel>
          <CheckboxGroup
            value={form.allowed_decks.includes('*') ? DECKS.map(d => d.key) : form.allowed_decks}
            onChange={handleDeckChange}
          >
            <Stack direction="row" flexWrap="wrap" spacing={3}>
              {DECKS.map(d => (
                <Checkbox key={d.key} value={d.key} colorScheme={d.color} size="sm">
                  {d.label}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl>
            <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.maxUses')}</FormLabel>
            <Input
              type="number"
              value={form.max_uses ?? ''}
              onChange={e => setForm(f => ({ ...f, max_uses: e.target.value ? Number(e.target.value) : null }))}
              size="sm"
              placeholder={t('inviteForm.maxUsesPlaceholder')}
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.expiresAt')}</FormLabel>
            <Input
              type="datetime-local"
              value={form.expires_at ?? ''}
              onChange={e => setForm(f => ({ ...f, expires_at: e.target.value || null }))}
              size="sm"
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel color="gray.600" fontSize="sm">{t('inviteForm.notes')}</FormLabel>
          <Textarea
            value={form.notes || ''}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            size="sm" rows={2}
            placeholder={t('inviteForm.notesPlaceholder')}
          />
        </FormControl>

        <Button type="submit" colorScheme="purple" size="sm" w="full" isLoading={loading}>
          {t('inviteForm.submit')}
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
  t,
}: {
  invites: PresentationInvite[];
  onToggle: (id: string, active: boolean) => void;
  onViewEvents: (code: string) => void;
  search: string;
  statusFilter: string;
  deckFilter: string;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const toast = useToast();
  const [page, setPage] = useState(0);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [search, statusFilter, deckFilter]);

  const filtered = useMemo(() => {
    let result = invites;

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

    if (statusFilter !== 'all') {
      result = result.filter(inv => getInviteStatus(inv) === statusFilter);
    }

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
    toast({ title: t('inviteTable.linkCopied'), status: 'info', duration: 2000 });
  };

  const openLink = (code: string) => {
    const link = `${window.location.origin}/apresentacao/i/${code}`;
    window.open(link, '_blank');
  };

  if (invites.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500" fontSize="sm">{t('dashboard.noInvites')}</Text>
      </Box>
    );
  }

  if (filtered.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500" fontSize="sm">{t('dashboard.noResults')}</Text>
      </Box>
    );
  }

  return (
    <>
      <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Table size="sm" variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th borderColor="gray.200">{t('inviteTable.name')}</Th>
              <Th borderColor="gray.200" display={{ base: 'none', md: 'table-cell' }}>{t('inviteTable.company')}</Th>
              <Th borderColor="gray.200">{t('inviteTable.code')}</Th>
              <Th borderColor="gray.200" display={{ base: 'none', lg: 'table-cell' }}>{t('inviteTable.decks')}</Th>
              <Th borderColor="gray.200" isNumeric>{t('inviteTable.views')}</Th>
              <Th borderColor="gray.200">{t('inviteTable.status')}</Th>
              <Th borderColor="gray.200" display={{ base: 'none', md: 'table-cell' }}>{t('inviteTable.created')}</Th>
              <Th borderColor="gray.200" w="1px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {pageItems.map(inv => {
              const status = getInviteStatus(inv);
              return (
                <Tr key={inv.id} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                  <Td borderColor="gray.200" py={3}>
                    <VStack align="start" spacing={0}>
                      <Text color="gray.800" fontSize="sm" fontWeight="500">{inv.recipient_name}</Text>
                      {inv.recipient_email && (
                        <Text color="gray.500" fontSize="xs">{inv.recipient_email}</Text>
                      )}
                      {inv.recipient_company && (
                        <Text color="gray.500" fontSize="xs" display={{ base: 'block', md: 'none' }}>
                          {inv.recipient_company}
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td borderColor="gray.200" display={{ base: 'none', md: 'table-cell' }}>
                    <Text color="gray.700" fontSize="sm">{inv.recipient_company || '—'}</Text>
                    {inv.recipient_role && (
                      <Text color="gray.500" fontSize="xs">{inv.recipient_role}</Text>
                    )}
                  </Td>
                  <Td borderColor="gray.200">
                    <Text fontFamily="mono" color="purple.600" fontSize="sm" fontWeight="600">{inv.code}</Text>
                  </Td>
                  <Td borderColor="gray.200" display={{ base: 'none', lg: 'table-cell' }}>
                    <HStack spacing={1} flexWrap="wrap">
                      {inv.allowed_decks.includes('*')
                        ? <Tag size="sm" colorScheme="purple" variant="subtle"><TagLabel>{t('inviteTable.allDecksLabel')}</TagLabel></Tag>
                        : inv.allowed_decks.map(d => (
                            <Tag key={d} size="sm" colorScheme={DECK_COLOR_MAP[d] || 'gray'} variant="subtle">
                              <TagLabel>{d}</TagLabel>
                            </Tag>
                          ))
                      }
                    </HStack>
                  </Td>
                  <Td borderColor="gray.200" isNumeric>
                    <Text color="gray.700" fontSize="sm" fontWeight="500">
                      {inv.uses_count}
                      {inv.max_uses ? (
                        <Text as="span" color="gray.400" fontWeight="400">/{inv.max_uses}</Text>
                      ) : null}
                    </Text>
                  </Td>
                  <Td borderColor="gray.200">
                    <StatusBadge status={status} t={t} />
                  </Td>
                  <Td borderColor="gray.200" display={{ base: 'none', md: 'table-cell' }}>
                    <Tooltip label={new Date(inv.created_at).toLocaleString('pt-BR')} placement="top" hasArrow>
                      <Text color="gray.500" fontSize="xs" cursor="default">{relativeTime(inv.created_at, t)}</Text>
                    </Tooltip>
                  </Td>
                  <Td borderColor="gray.200">
                    <HStack spacing={0}>
                      <Tooltip label={t('inviteTable.copyLink')} hasArrow>
                        <IconButton
                          aria-label={t('inviteTable.copyLink')}
                          icon={<FiCopy />}
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'gray.800' }}
                          onClick={() => copyLink(inv.code)}
                        />
                      </Tooltip>
                      <Tooltip label={t('inviteTable.openLink')} hasArrow>
                        <IconButton
                          aria-label={t('inviteTable.openLink')}
                          icon={<FiExternalLink />}
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'gray.800' }}
                          onClick={() => openLink(inv.code)}
                        />
                      </Tooltip>
                      <Tooltip label={t('inviteTable.viewEvents')} hasArrow>
                        <IconButton
                          aria-label={t('inviteTable.viewEvents')}
                          icon={<FiBarChart2 />}
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          _hover={{ color: 'purple.600' }}
                          onClick={() => onViewEvents(inv.code)}
                        />
                      </Tooltip>
                      <Tooltip label={inv.is_active ? t('inviteTable.deactivate') : t('inviteTable.activate')} hasArrow>
                        <IconButton
                          aria-label={inv.is_active ? t('inviteTable.deactivate') : t('inviteTable.activate')}
                          icon={inv.is_active ? <FiEyeOff /> : <FiEye />}
                          size="xs"
                          variant="ghost"
                          color={inv.is_active ? 'gray.500' : 'green.500'}
                          _hover={{ color: inv.is_active ? 'red.500' : 'green.400' }}
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
            ? ` (${t('dashboard.total')}: ${invites.length})`
            : ''}
        </Text>
        {totalPages > 1 && (
          <HStack spacing={2}>
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              size="xs"
              variant="ghost"
              color="gray.500"
              isDisabled={safePage === 0}
              onClick={() => setPage(p => p - 1)}
            />
            <Text color="gray.500" fontSize="xs" minW="80px" textAlign="center">
              {safePage + 1} {t('inviteTable.pageOf')} {totalPages}
            </Text>
            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              size="xs"
              variant="ghost"
              color="gray.500"
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
function EventsPanel({ code, onClose, t }: { code: string; onClose: () => void; t: (key: string, opts?: Record<string, unknown>) => string }) {
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
    <Box bg="gray.50" p={5} borderRadius="xl" border="1px solid" borderColor="gray.200">
      <HStack justify="space-between" mb={4}>
        <HStack spacing={3}>
          <Heading size="sm" color="gray.800">{t('events.heading')}</Heading>
          <Text fontFamily="mono" color="purple.600" fontSize="sm">{code}</Text>
        </HStack>
        <IconButton aria-label="Close" icon={<FiX />} size="sm" variant="ghost" color="gray.500" onClick={onClose} />
      </HStack>

      {loading ? (
        <Flex justify="center" py={6}><Spinner color="purple.500" size="sm" /></Flex>
      ) : events.length === 0 ? (
        <Text color="gray.500" fontSize="sm" textAlign="center" py={6}>{t('events.noEvents')}</Text>
      ) : (
        <>
          {/* Stats bar */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
            <Box bg="white" px={3} py={2} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Text color="gray.500" fontSize="xs">{t('events.sessions')}</Text>
              <Text color="gray.800" fontWeight="600">{stats.sessionStarts}</Text>
            </Box>
            <Box bg="white" px={3} py={2} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Text color="gray.500" fontSize="xs">{t('events.decksViewed')}</Text>
              <Text color="gray.800" fontWeight="600">{stats.uniqueDecks}</Text>
            </Box>
            <Box bg="white" px={3} py={2} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Text color="gray.500" fontSize="xs">{t('events.totalTime')}</Text>
              <Text color="gray.800" fontWeight="600">
                {stats.totalSeconds >= 60
                  ? `${Math.floor(stats.totalSeconds / 60)}min ${stats.totalSeconds % 60}s`
                  : `${stats.totalSeconds}s`}
              </Text>
            </Box>
            <Box bg="white" px={3} py={2} borderRadius="lg" border="1px solid" borderColor="gray.200">
              <Text color="gray.500" fontSize="xs">{t('events.maxSlide')}</Text>
              <Text color="gray.800" fontWeight="600">{stats.maxSlide + 1}</Text>
            </Box>
          </SimpleGrid>

          <Box overflowX="auto" maxH="350px" overflowY="auto" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <Table size="sm">
              <Thead bg="gray.100" position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th borderColor="gray.200">{t('events.eventType')}</Th>
                  <Th borderColor="gray.200">{t('events.deck')}</Th>
                  <Th borderColor="gray.200" isNumeric>{t('events.slide')}</Th>
                  <Th borderColor="gray.200" isNumeric>{t('events.time')}</Th>
                  <Th borderColor="gray.200">{t('events.when')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pageEvents.map(ev => (
                  <Tr key={ev.id} _hover={{ bg: 'gray.50' }}>
                    <Td borderColor="gray.200">
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
                    <Td borderColor="gray.200">
                      {ev.deck ? (
                        <Tag size="sm" colorScheme={DECK_COLOR_MAP[ev.deck] || 'gray'} variant="subtle">
                          <TagLabel>{ev.deck}</TagLabel>
                        </Tag>
                      ) : (
                        <Text color="gray.400" fontSize="xs">—</Text>
                      )}
                    </Td>
                    <Td borderColor="gray.200" color="gray.600" fontSize="xs" isNumeric>
                      {ev.slide_index != null ? ev.slide_index + 1 : '—'}
                    </Td>
                    <Td borderColor="gray.200" color="gray.600" fontSize="xs" isNumeric>
                      {ev.seconds != null ? `${Math.round(ev.seconds)}s` : '—'}
                    </Td>
                    <Td borderColor="gray.200">
                      <Tooltip label={new Date(ev.created_at).toLocaleString('pt-BR')} hasArrow>
                        <Text color="gray.500" fontSize="xs" cursor="default">{relativeTime(ev.created_at, t)}</Text>
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
              <Text color="gray.500" fontSize="xs">{events.length} {t('events.eventsCount')}</Text>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Previous"
                  icon={<FiChevronLeft />}
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  isDisabled={eventPage === 0}
                  onClick={() => setEventPage(p => p - 1)}
                />
                <Text color="gray.500" fontSize="xs" minW="60px" textAlign="center">
                  {eventPage + 1}/{totalEventPages}
                </Text>
                <IconButton
                  aria-label="Next"
                  icon={<FiChevronRight />}
                  size="xs"
                  variant="ghost"
                  color="gray.500"
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

// ---- Dashboard Content ----
function DashboardContent() {
  const { t } = useTranslation('presentation-admin');
  const { user, signOut } = useSupabaseAuth();
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
    <Container maxW="1200px" py={12}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <Heading size="lg" color="gray.800">{t('dashboard.heading')}</Heading>
          <HStack spacing={4}>
            <Text color="gray.500" fontSize="sm">{stats.total} {t('dashboard.invites')}</Text>
            <Text color="green.500" fontSize="sm">{stats.active} {t('dashboard.active')}</Text>
            <Text color="purple.600" fontSize="sm">{stats.totalViews} {t('dashboard.views')}</Text>
          </HStack>
        </VStack>
        <HStack spacing={3}>
          {user && (
            <Text color="gray.500" fontSize="sm" display={{ base: 'none', md: 'block' }}>{user.email}</Text>
          )}
          <Button leftIcon={<FiLogOut />} variant="ghost" color="gray.500" size="sm" onClick={signOut}>
            {t('dashboard.logout')}
          </Button>
        </HStack>
      </Flex>

      {/* Deck cards */}
      <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={3} mb={10}>
        {DECKS.map(d => (
          <Card
            key={d.key}
            bg="white"
            cursor="pointer"
            _hover={{ transform: 'translateY(-2px)', borderColor: `${d.color}.500`, shadow: 'md' }}
            transition="all 0.2s"
            onClick={() => openDeck(d.key, d.path)}
            border="1px solid"
            borderColor="gray.200"
          >
            <CardBody py={4} px={4}>
              <Badge colorScheme={d.color} mb={2} fontSize="xs">{d.label}</Badge>
              <Text color="gray.500" fontSize="xs">{t('dashboard.openDeck')}</Text>
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
          <Heading size="md" color="gray.800">{t('dashboard.invitesSection')}</Heading>
          <HStack spacing={2}>
            <IconButton
              aria-label={t('dashboard.refreshInvites')}
              icon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              color="gray.500"
              onClick={loadInvites}
              isLoading={loadingInvites}
            />
            <InviteForm onCreated={loadInvites} t={t} />
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
              placeholder={t('dashboard.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'purple.500' }}
              borderRadius="lg"
            />
          </InputGroup>
          <HStack spacing={2}>
            <Select
              size="sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'purple.500' }}
              borderRadius="lg"
              maxW="160px"
            >
              <option value="all">{t('dashboard.allStatuses')}</option>
              <option value="active">{t('inviteTable.statusActive')}</option>
              <option value="expired">{t('inviteTable.statusExpired')}</option>
              <option value="maxed">{t('inviteTable.statusMaxed')}</option>
              <option value="inactive">{t('inviteTable.statusInactive')}</option>
            </Select>
            <Select
              size="sm"
              value={deckFilter}
              onChange={e => setDeckFilter(e.target.value)}
              border="1px solid"
              borderColor="gray.200"
              _focus={{ borderColor: 'purple.500' }}
              borderRadius="lg"
              maxW="160px"
            >
              <option value="all">{t('dashboard.allDecks')}</option>
              {DECKS.map(d => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </Select>
            {(search || statusFilter !== 'all' || deckFilter !== 'all') && (
              <Button
                size="xs"
                variant="ghost"
                color="gray.500"
                onClick={() => { setSearch(''); setStatusFilter('all'); setDeckFilter('all'); }}
              >
                {t('dashboard.clearFilters')}
              </Button>
            )}
          </HStack>
        </Flex>

        {loadingInvites ? (
          <Flex justify="center" py={10}><Spinner color="purple.500" /></Flex>
        ) : (
          <InviteTable
            invites={invites}
            onToggle={handleToggle}
            onViewEvents={code => setEventsCode(code)}
            search={search}
            statusFilter={statusFilter}
            deckFilter={deckFilter}
            t={t}
          />
        )}
      </Box>

      {/* Events panel */}
      {eventsCode && (
        <Box ref={eventsPanelRef} mt={6}>
          <EventsPanel code={eventsCode} onClose={() => setEventsCode(null)} t={t} />
        </Box>
      )}
    </Container>
  );
}

// ---- Exported page component ----
export function PresentationDashboard() {
  return (
    <ProtectedRoute loginPath="/apresentacao/login">
      <DashboardContent />
    </ProtectedRoute>
  );
}
