import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Flex, Badge, Image,
} from '@chakra-ui/react';
import {
  FiShield, FiMessageCircle, FiLayers, FiGitBranch, FiZap,
  FiCpu, FiMail, FiUserPlus, FiRefreshCw, FiBarChart2,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { PageHero } from '../components/shared/PageHero';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { FeatureComparisonTable } from '../components/shared/FeatureComparisonTable';
import { MotionBox } from '../components/motion';
import { CatalisaStudioShowcase } from '../components/sections/CatalisaStudioShowcase';
import { WorkflowShowcase } from '../components/sections/WorkflowShowcase';
import { FinalCTA } from '../components/sections/FinalCTA';
import { BrowserFrame } from '../components/shared/BrowserFrame';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function Studio() {
  const { t } = useTranslation('studio');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const comparisonRows = t('beforeAfter.rows', { returnObjects: true }) as Array<{
    feature: string; before: string; after: string;
  }>;

  const templates = [
    { icon: FiMessageCircle, title: t('templates.items.0.title'), description: t('templates.items.0.description'), color: 'whatsapp.500' },
    { icon: FiCpu, title: t('templates.items.1.title'), description: t('templates.items.1.description'), color: 'purple.500' },
    { icon: FiMail, title: t('templates.items.2.title'), description: t('templates.items.2.description'), color: 'blue.500' },
    { icon: FiUserPlus, title: t('templates.items.3.title'), description: t('templates.items.3.description'), color: 'orange.500' },
    { icon: FiRefreshCw, title: t('templates.items.4.title'), description: t('templates.items.4.description'), color: 'red.400' },
    { icon: FiBarChart2, title: t('templates.items.5.title'), description: t('templates.items.5.description'), color: 'teal.500' },
  ];

  const differentiators = [
    { icon: FiShield, title: t('whyStudio.items.0.title'), description: t('whyStudio.items.0.description') },
    { icon: FiMessageCircle, title: t('whyStudio.items.1.title'), description: t('whyStudio.items.1.description') },
    { icon: FiLayers, title: t('whyStudio.items.2.title'), description: t('whyStudio.items.2.description') },
  ];

  return (
    <>
      {/* Hero */}
      <PageHero
        heroId="hero_studio"
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeInAction'), href: '#builder' }}
        stats={[
          { value: t('hero.stats.blocks.value'), label: t('hero.stats.blocks.label') },
          { value: t('hero.stats.setup.value'), label: t('hero.stats.setup.label') },
          { value: t('hero.stats.code.value'), label: t('hero.stats.code.label') },
        ]}
      >
        <BrowserFrame url="studio.catalisa.app">
          <Box overflow="hidden" maxH={{ base: '220px', md: '340px' }}>
            <Image
              src="/screenshots/workflow-editor.png"
              alt="Catalisa Studio workflow editor"
              w="100%"
              h="auto"
              loading="lazy"
            />
          </Box>
        </BrowserFrame>
      </PageHero>

      {/* Before vs After Comparison Table */}
      <SectionWrapper>
        <SectionHeader
          heading={t('beforeAfter.heading')}
          headingGradient={t('beforeAfter.headingGradient')}
          subtitle={t('beforeAfter.subtitle')}
        />
        <Box maxW="900px" mx="auto">
          <FeatureComparisonTable
            columns={[
              { label: t('beforeAfter.columns.before') },
              { label: t('beforeAfter.columns.after'), highlighted: true },
            ]}
            rows={comparisonRows.map((r) => ({
              feature: r.feature,
              values: [r.before, r.after],
            }))}
          />
        </Box>
      </SectionWrapper>

      {/* Builder Showcase (dark bg) */}
      <Box id="builder">
        <CatalisaStudioShowcase />
      </Box>

      {/* Canvas Visual */}
      <SectionWrapper>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 8, lg: 12 }}
          align="center"
        >
          <VStack align="flex-start" spacing={5} flex={1} maxW={{ lg: '400px' }}>
            <Badge colorScheme="green" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('canvas.badge')}
            </Badge>
            <Heading as="h2" size="xl" fontWeight="800" lineHeight="1.2">
              {t('canvas.heading')}{' '}
              <Text as="span" color="brand.500">{t('canvas.headingGradient')}</Text>
            </Heading>
            <Text color="gray.500" fontSize="md" lineHeight="1.7">
              {t('canvas.subtitle')}
            </Text>

            <VStack align="flex-start" spacing={3} w="full" pt={2}>
              <HStack spacing={3} p={3} bg="green.50" borderRadius="lg" w="full">
                <Icon as={FiLayers} color="green.500" />
                <Text fontSize="sm" fontWeight="500">{t('canvas.features.0')}</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="blue.50" borderRadius="lg" w="full">
                <Icon as={FiGitBranch} color="blue.500" />
                <Text fontSize="sm" fontWeight="500">{t('canvas.features.1')}</Text>
              </HStack>
              <HStack spacing={3} p={3} bg="purple.50" borderRadius="lg" w="full">
                <Icon as={FiZap} color="purple.500" />
                <Text fontSize="sm" fontWeight="500">{t('canvas.features.2')}</Text>
              </HStack>
            </VStack>
          </VStack>

          <MotionBox
            flex={2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box borderRadius="xl" overflow="hidden" boxShadow="2xl" border="1px solid" borderColor="gray.200">
              <Image
                src="/screenshots/workflow-editor.png"
                alt="Canvas visual do Catalisa com workflows drag & drop e execucao paralela"
                w="100%"
                h="auto"
                loading="lazy"
              />
            </Box>
          </MotionBox>
        </Flex>
      </SectionWrapper>

      {/* Dashboard Real (dark premium bg) */}
      <Box as="section" position="relative" bg="gray.900" overflow="hidden">
        <Box
          position="absolute"
          top="-30%"
          left="20%"
          w="60%"
          h="80%"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 60%)"
          pointerEvents="none"
        />

        <Container maxW="1280px" py={{ base: 16, md: 24 }}>
          <SectionHeader
            badge={t('dashboard.badge')}
            heading={t('dashboard.heading')}
            headingGradient={t('dashboard.headingGradient')}
            subtitle={t('dashboard.subtitle')}
            dark
          />

          <MotionBox
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Box
              position="relative"
              boxShadow="0 25px 60px -12px rgba(115, 75, 156, 0.3), 0 0 40px rgba(115, 75, 156, 0.1)"
              borderRadius="2xl"
              _before={{
                content: '""',
                position: 'absolute',
                inset: '-1px',
                borderRadius: '2xl',
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(115,75,156,0.4), transparent 50%, rgba(37,211,102,0.2))',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <BrowserFrame url="panel.catalisa.app/dashboard">
                <Box overflow="hidden" maxH={{ base: '280px', sm: '360px', md: '480px', lg: '560px' }}>
                  <Image
                    src="/screenshots/dashboard.jpeg"
                    alt="Dashboard do Catalisa Studio"
                    w="100%"
                    h="auto"
                    mt={{ base: '-50px', md: '-70px', lg: '-90px' }}
                  />
                </Box>
              </BrowserFrame>
            </Box>
          </MotionBox>

          <Flex justify="center" mt={{ base: 8, md: 12 }} gap={{ base: 6, md: 12 }} flexWrap="wrap">
            {(t('dashboard.stats', { returnObjects: true }) as Array<{ value: string; label: string }>).map((stat) => (
              <VStack key={stat.label} spacing={0}>
                <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>{stat.value}</Text>
                <Text color="whiteAlpha.500" fontSize="xs">{stat.label}</Text>
              </VStack>
            ))}
          </Flex>
        </Container>
      </Box>

      {/* Workflows Interativos */}
      <WorkflowShowcase />

      {/* Templates */}
      <SectionWrapper>
        <SectionHeader
          badge={t('templates.badge')}
          heading={t('templates.heading')}
          subtitle={t('templates.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {templates.map((template, i) => (
            <MotionBox
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <Icon as={template.icon} boxSize={6} color={template.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{template.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{template.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Por que Studio? (dark bg) */}
      <Box bg="gray.900" py={{ base: 16, md: 24 }}>
        <Container maxW="1280px">
          <SectionHeader
            heading={t('whyStudio.heading')}
            subtitle={t('whyStudio.subtitle')}
            dark
          />

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {differentiators.map((diff, i) => (
              <MotionBox
                key={diff.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Box
                  bg="whiteAlpha.50"
                  p={7}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  h="full"
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.400', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                >
                  <VStack align="flex-start" spacing={4}>
                    <Box p={3} borderRadius="xl" bg="whiteAlpha.100">
                      <Icon as={diff.icon} boxSize={6} color="brand.300" />
                    </Box>
                    <Heading as="h3" size="md" fontWeight="700" color="white">{diff.title}</Heading>
                    <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.8">{diff.description}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* PageCTA */}
      <PageCTA
        heading={t('pageCTA.heading')}
        subtitle={t('pageCTA.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />

      {/* FinalCTA */}
      <FinalCTA />
    </>
  );
}
