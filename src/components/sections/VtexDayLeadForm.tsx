import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  RadioGroup,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { PERSONAS, type PersonaKey } from '../../data/vtexDay2026';
import { insertVtexDayLead } from '../../lib/vtexDayLeads';

export function VtexDayLeadForm() {
  const { t } = useTranslation('vtex-day-2026');
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [persona, setPersona] = useState<PersonaKey>('lojista');
  const [storeName, setStoreName] = useState('');
  const [ordersRange, setOrdersRange] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState(false);

  const ordersOptions = t('lead.ordersOptions', { returnObjects: true }) as string[];
  const interestsOptions = t('lead.interestsOptions', { returnObjects: true }) as string[];

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacy) {
      toast({ title: 'Aceite o termo de privacidade pra continuar.', status: 'warning' });
      return;
    }
    setSubmitting(true);
    try {
      await insertVtexDayLead({
        name,
        email,
        phone,
        company,
        role,
        persona,
        vtex_store_name: storeName,
        monthly_orders_range: ordersRange,
        interests,
        privacy_accepted: privacy,
      });
      if (typeof window !== 'undefined' && 'dataLayer' in window) {
        (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
          event: 'form_submit',
          form: 'vtex_day_2026_lead',
          persona,
        });
      }
      toast({ title: t('lead.success'), status: 'success' });
      const text = encodeURIComponent(
        `Oi! Sou ${name || 'visitante do VTEX Day 2026'}${company ? ` da ${company}` : ''}. Quero marcar a demo.`,
      );
      window.open(`https://wa.me/5511977303414?text=${text}`, '_blank', 'noopener,noreferrer');
    } catch {
      toast({ title: t('lead.error'), status: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box as="section" id="vtex-day-lead" py={{ base: 16, md: 24 }} bg="bg-page">
      <Container maxW="860px">
        <VStack spacing={3} textAlign="center" mb={10}>
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }} color="text-primary">
            {t('lead.heading')}
          </Heading>
          <Text color="text-secondary" fontSize="md">
            {t('lead.subtitle')}
          </Text>
        </VStack>

        <Box
          as="form"
          onSubmit={onSubmit}
          bg="bg-card"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          border="1px solid"
          borderColor="border-default"
          boxShadow="0 25px 70px -30px rgba(115,75,156,0.3)"
        >
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">{t('lead.name')}</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm">{t('lead.email')}</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t('lead.phone')}</FormLabel>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t('lead.company')}</FormLabel>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t('lead.role')}</FormLabel>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">{t('lead.storeName')}</FormLabel>
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel fontSize="sm">{t('lead.personaLabel')}</FormLabel>
              <RadioGroup value={persona} onChange={(v) => setPersona(v as PersonaKey)}>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  {PERSONAS.map((p) => (
                    <Radio key={p.key} value={p.key} colorScheme="purple">
                      <Text fontSize="sm">
                        {p.icon} {p.label}
                      </Text>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">{t('lead.orders')}</FormLabel>
              <Select
                value={ordersRange}
                onChange={(e) => setOrdersRange(e.target.value)}
                placeholder="—"
              >
                {ordersOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm">{t('lead.interests')}</FormLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                {interestsOptions.map((opt) => (
                  <Checkbox
                    key={opt}
                    colorScheme="purple"
                    isChecked={interests.includes(opt)}
                    onChange={() => toggleInterest(opt)}
                  >
                    <Text fontSize="sm">{opt}</Text>
                  </Checkbox>
                ))}
              </SimpleGrid>
            </FormControl>

            <FormControl isRequired>
              <Checkbox
                colorScheme="purple"
                isChecked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
              >
                <Text fontSize="sm">{t('lead.privacy')}</Text>
              </Checkbox>
            </FormControl>

            <HStack justify="flex-end" pt={2}>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={submitting}
                loadingText={t('lead.submitting')}
                rightIcon={<FiArrowRight />}
                isDisabled={!privacy}
              >
                {t('lead.submit')}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
