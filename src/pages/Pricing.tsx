import { useState, useMemo } from 'react';
import {
  Box, Heading, Text, VStack, HStack, SimpleGrid, Button, Icon,
  Badge, Divider, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
  Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Switch,
} from '@chakra-ui/react';
import { FiCheck, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { FeatureComparisonTable } from '../components/shared/FeatureComparisonTable';
import { MotionBox } from '../components/motion';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20os%20planos%20da%20Catalisa.';

export function Pricing() {
  const { t } = useTranslation('pricing');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const [isAnnual, setIsAnnual] = useState(false);
  const [calcConversations, setCalcConversations] = useState(1000);

  const plans = t('plans', { returnObjects: true }) as Array<{
    name: string;
    description: string;
    price: string;
    priceAnnual: string;
    priceSuffix?: string;
    badge?: string;
    features: string[];
    cta: string;
    ctaVariant?: string;
    highlighted?: boolean;
  }>;

  const comparison = t('comparison', { returnObjects: true }) as {
    heading: string;
    headingGradient: string;
    columns: { label: string; highlighted?: boolean }[];
    rows: { feature: string; values: string[] }[];
  };

  const addons = t('addons', { returnObjects: true }) as {
    heading: string;
    headingGradient: string;
    subtitle: string;
    items: { name: string; price: string; description: string }[];
  };

  const savings = t('savings', { returnObjects: true }) as {
    heading: string;
    subtitle: string;
    traditional: { title: string; items: { label: string; value: string }[]; total: string };
    catalisa: { title: string; items: { label: string; value: string }[]; total: string };
    savingsLabel: string;
    savingsValue: string;
    savingsPercent: string;
  };

  const faq = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  const recommendedPlan = useMemo(() => {
    if (calcConversations <= 100) return 'Free';
    if (calcConversations <= 1000) return 'Starter';
    if (calcConversations <= 5000) return 'Professional';
    if (calcConversations <= 25000) return 'Business';
    return 'Enterprise';
  }, [calcConversations]);

  return (
    <>
      {/* Hero */}
      <PageHero
        heroId="hero_pricing"
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        gradient="linear(to-r, catalisa.secondary, catalisa.accent)"
      />

      {/* Billing Toggle */}
      <SectionWrapper>
        <HStack justify="center" spacing={4} mb={8}>
          <Text fontWeight={!isAnnual ? '700' : '400'} color={!isAnnual ? 'gray.800' : 'gray.400'}>
            {t('billing.monthly')}
          </Text>
          <Switch
            size="lg"
            colorScheme="brand"
            isChecked={isAnnual}
            onChange={() => setIsAnnual(!isAnnual)}
          />
          <HStack spacing={2}>
            <Text fontWeight={isAnnual ? '700' : '400'} color={isAnnual ? 'gray.800' : 'gray.400'}>
              {t('billing.annual')}
            </Text>
            {isAnnual && (
              <Badge colorScheme="green" fontSize="xs" borderRadius="full" px={2}>
                {t('billing.saveTag')}
              </Badge>
            )}
          </HStack>
        </HStack>

        {/* Plans Grid */}
        <Box overflowX="auto" pb={4}>
          <Flex gap={4} minW="fit-content" justify="center" px={{ base: 0, lg: 0 }}>
            {plans.map((plan, i) => {
              const displayPrice = isAnnual ? plan.priceAnnual : plan.price;
              const isCustom = displayPrice === 'Customizado' || displayPrice === 'Custom';
              const isOutline = plan.ctaVariant === 'outline';

              return (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  flex="1"
                  minW="210px"
                  maxW="260px"
                >
                  <VStack
                    align="stretch"
                    spacing={4}
                    p={6}
                    bg="white"
                    borderRadius="2xl"
                    border="2px solid"
                    borderColor={plan.highlighted ? 'brand.500' : 'gray.200'}
                    position="relative"
                    h="full"
                    _hover={{
                      boxShadow: plan.highlighted ? '0 20px 60px rgba(115, 75, 156, 0.2)' : 'lg',
                      transform: 'translateY(-4px)',
                    }}
                    transition="all 0.2s"
                  >
                    {plan.badge && (
                      <Badge
                        position="absolute"
                        top={-3}
                        left="50%"
                        transform="translateX(-50%)"
                        bg="brand.500"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="700"
                      >
                        {plan.badge}
                      </Badge>
                    )}

                    <VStack spacing={1} align="flex-start">
                      <Heading as="h3" size="sm" fontWeight="700">{plan.name}</Heading>
                      <Text color="gray.500" fontSize="xs" lineHeight="short">{plan.description}</Text>
                    </VStack>

                    <HStack align="baseline" spacing={1}>
                      <Heading
                        size={isCustom ? 'md' : 'xl'}
                        fontWeight="800"
                        color={plan.highlighted ? 'brand.500' : 'gray.800'}
                      >
                        {displayPrice}
                      </Heading>
                      {!isCustom && (
                        <Text color="gray.500" fontSize="xs">{t('billing.perMonth')}</Text>
                      )}
                    </HStack>
                    {isAnnual && !isCustom && displayPrice !== 'R$ 0' && (
                      <Text fontSize="2xs" color="gray.400" mt={-3}>{t('billing.billedAnnually')}</Text>
                    )}

                    <Divider />

                    <VStack align="flex-start" spacing={1.5} flex={1}>
                      {plan.features.map((feature, j) => (
                        <HStack key={j} spacing={2} align="flex-start">
                          <Icon as={FiCheck} color="green.500" boxSize={3.5} flexShrink={0} mt="3px" />
                          <Text fontSize="xs" color="gray.700">{feature}</Text>
                        </HStack>
                      ))}
                    </VStack>

                    <Button
                      as="a"
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="md"
                      bg={isOutline ? 'transparent' : plan.highlighted ? 'brand.500' : 'gray.100'}
                      color={isOutline ? 'brand.500' : plan.highlighted ? 'white' : 'gray.800'}
                      border={isOutline ? '2px solid' : 'none'}
                      borderColor={isOutline ? 'brand.500' : 'transparent'}
                      _hover={{
                        bg: isOutline ? 'brand.50' : plan.highlighted ? 'brand.600' : 'gray.200',
                        transform: 'translateY(-2px)',
                        boxShadow: plan.highlighted ? '0 8px 30px rgba(115, 75, 156, 0.4)' : 'md',
                      }}
                      leftIcon={plan.highlighted ? <FiMessageCircle /> : undefined}
                      fontWeight="700"
                      transition="all 0.2s"
                      w="full"
                    >
                      {plan.cta}
                    </Button>
                  </VStack>
                </MotionBox>
              );
            })}
          </Flex>
        </Box>
      </SectionWrapper>

      {/* Usage Calculator */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          heading={t('calculator.heading')}
          subtitle={t('calculator.subtitle')}
        />

        <Box maxW="500px" mx="auto" bg="white" p={8} borderRadius="2xl" border="1px solid" borderColor="gray.200" boxShadow="lg">
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={4}>{t('calculator.conversationsLabel')}</Text>
              <Slider
                value={calcConversations}
                min={100}
                max={50000}
                step={100}
                onChange={setCalcConversations}
                colorScheme="brand"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={5} />
              </Slider>
              <HStack justify="space-between" mt={2}>
                {(t('calculator.conversationsMarks', { returnObjects: true }) as string[]).map((mark) => (
                  <Text key={mark} fontSize="2xs" color="gray.400">{mark}</Text>
                ))}
              </HStack>
              <Text textAlign="center" fontSize="2xl" fontWeight="800" color="brand.500" mt={2}>
                {calcConversations.toLocaleString('pt-BR')}
              </Text>
            </Box>

            <Divider />

            <Box textAlign="center">
              <Text fontSize="sm" color="gray.500" mb={1}>{t('calculator.recommendLabel')}</Text>
              <Badge
                colorScheme="brand"
                fontSize="lg"
                px={4}
                py={2}
                borderRadius="lg"
                fontWeight="700"
              >
                {recommendedPlan}
              </Badge>
            </Box>
          </VStack>
        </Box>
      </SectionWrapper>

      {/* Feature Comparison Table */}
      <SectionWrapper>
        <SectionHeader
          heading={comparison.heading}
          headingGradient={comparison.headingGradient}
        />

        <Box maxW="1100px" mx="auto">
          <FeatureComparisonTable
            columns={comparison.columns}
            rows={comparison.rows.map((r) => ({
              feature: r.feature,
              values: r.values,
            }))}
          />
        </Box>
      </SectionWrapper>

      {/* Add-ons */}
      <SectionWrapper bg="gray.50">
        <SectionHeader
          heading={addons.heading}
          headingGradient={addons.headingGradient}
          subtitle={addons.subtitle}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4} maxW="900px" mx="auto">
          {addons.items.map((addon, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <VStack
                align="flex-start"
                p={5}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                spacing={2}
                h="full"
              >
                <Text fontWeight="700" fontSize="sm">{addon.name}</Text>
                <Text color="brand.500" fontWeight="800" fontSize="lg">{addon.price}</Text>
                <Text color="gray.500" fontSize="xs">{addon.description}</Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Savings vs. Hiring */}
      <SectionWrapper>
        <SectionHeader
          heading={savings.heading}
          subtitle={savings.subtitle}
        />

        <Flex direction={{ base: 'column', md: 'row' }} gap={6} maxW="800px" mx="auto" align="stretch">
          {/* Traditional */}
          <VStack flex={1} bg="red.50" p={6} borderRadius="xl" align="stretch" spacing={3}>
            <Text fontWeight="700" color="red.600">{savings.traditional.title}</Text>
            {savings.traditional.items.map((item) => (
              <HStack key={item.label} justify="space-between">
                <Text fontSize="sm" color="gray.600">{item.label}</Text>
                <Text fontSize="sm" fontWeight="600" color="red.600">{item.value}</Text>
              </HStack>
            ))}
            <Divider borderColor="red.200" />
            <HStack justify="space-between">
              <Text fontWeight="700" color="red.700">Total</Text>
              <Text fontWeight="800" fontSize="lg" color="red.700">{savings.traditional.total}</Text>
            </HStack>
          </VStack>

          {/* Catalisa */}
          <VStack flex={1} bg="green.50" p={6} borderRadius="xl" align="stretch" spacing={3}>
            <Text fontWeight="700" color="green.600">{savings.catalisa.title}</Text>
            {savings.catalisa.items.map((item) => (
              <HStack key={item.label} justify="space-between">
                <Text fontSize="sm" color="gray.600">{item.label}</Text>
                <Text fontSize="sm" fontWeight="600" color="green.600">{item.value}</Text>
              </HStack>
            ))}
            <Divider borderColor="green.200" />
            <HStack justify="space-between">
              <Text fontWeight="700" color="green.700">Total</Text>
              <Text fontWeight="800" fontSize="lg" color="green.700">{savings.catalisa.total}</Text>
            </HStack>
          </VStack>
        </Flex>

        {/* Savings badge */}
        <Flex justify="center" mt={6}>
          <Badge
            bg="brand.500"
            color="white"
            px={6}
            py={3}
            borderRadius="xl"
            fontSize="md"
          >
            {savings.savingsLabel}: {savings.savingsValue} ({savings.savingsPercent})
          </Badge>
        </Flex>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper bg="gray.50">
        <SectionHeader heading={t('faq.heading')} />

        <Box maxW="700px" mx="auto">
          <Accordion allowMultiple>
            {faq.map((item, i) => (
              <AccordionItem key={i} border="none" mb={3}>
                <AccordionButton
                  bg="white"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  px={6}
                  py={4}
                  _hover={{ borderColor: 'brand.500' }}
                  _expanded={{ borderColor: 'brand.500' }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="600" fontSize="sm">{item.question}</Text>
                  </Box>
                  <AccordionIcon color="brand.500" />
                </AccordionButton>
                <AccordionPanel px={6} py={4}>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">{item.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </SectionWrapper>

      {/* PageCTA */}
      <PageCTA
        heading={t('pageCTA.heading')}
        subtitle={t('pageCTA.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
