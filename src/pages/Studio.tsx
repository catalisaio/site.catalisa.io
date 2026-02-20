import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Flex, Badge, Button, Image,
  List, ListItem, ListIcon,
} from '@chakra-ui/react';
import {
  FiCheck, FiX, FiCode, FiClock, FiShield, FiMessageCircle,
  FiCpu, FiMail, FiUserPlus, FiRefreshCw, FiBarChart2,
  FiLayers, FiGitBranch, FiZap,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { CatalisaStudioShowcase } from '../components/sections/CatalisaStudioShowcase';
import { WorkflowShowcase } from '../components/sections/WorkflowShowcase';
import { FinalCTA } from '../components/sections/FinalCTA';
import { BrowserFrame } from '../components/shared/BrowserFrame';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function Studio() {
  const { t } = useTranslation('studio');
  const beforeItems = t('beforeAfter.before', { returnObjects: true }) as string[];
  const afterItems = t('beforeAfter.after', { returnObjects: true }) as string[];

  const templates = [
    {
      icon: FiMessageCircle,
      title: t('templates.items.0.title'),
      description: t('templates.items.0.description'),
      color: 'whatsapp.500',
    },
    {
      icon: FiCpu,
      title: t('templates.items.1.title'),
      description: t('templates.items.1.description'),
      color: 'purple.500',
    },
    {
      icon: FiMail,
      title: t('templates.items.2.title'),
      description: t('templates.items.2.description'),
      color: 'blue.500',
    },
    {
      icon: FiUserPlus,
      title: t('templates.items.3.title'),
      description: t('templates.items.3.description'),
      color: 'orange.500',
    },
    {
      icon: FiRefreshCw,
      title: t('templates.items.4.title'),
      description: t('templates.items.4.description'),
      color: 'red.400',
    },
    {
      icon: FiBarChart2,
      title: t('templates.items.5.title'),
      description: t('templates.items.5.description'),
      color: 'teal.500',
    },
  ];

  const differentiators = [
    {
      icon: FiShield,
      title: t('whyStudio.items.0.title'),
      description: t('whyStudio.items.0.description'),
    },
    {
      icon: FiMessageCircle,
      title: t('whyStudio.items.1.title'),
      description: t('whyStudio.items.1.description'),
    },
    {
      icon: FiLayers,
      title: t('whyStudio.items.2.title'),
      description: t('whyStudio.items.2.description'),
    },
  ];

  return (
    <>
      {/* ─── Section 1: Hero (dark bg) ─── */}
      <Box id="hero" bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <HStack
              bg="whiteAlpha.100"
              px={4}
              py={1.5}
              borderRadius="full"
              border="1px solid"
              borderColor="whiteAlpha.200"
              spacing={2}
            >
              <Text color="brand.300" fontSize="sm" fontWeight="600">
                &#10022; {t('hero.badge')}
              </Text>
            </HStack>

            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              {t('hero.heading')}{' '}
              <GradientText gradient="linear(to-r, brand.300, brand.400, catalisa.accent)">
                {t('hero.headingGradient')}
              </GradientText>
            </Heading>

            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              {t('hero.subtitle')}
            </Text>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                size="lg"
                bg="whatsapp.500"
                color="white"
                _hover={{ bg: 'whatsapp.600', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                leftIcon={<FiMessageCircle />}
                transition="all 0.2s"
                fontWeight="700"
              >
                {t('cta.letsChat', { ns: 'common' })}
              </Button>
              <Button
                as="a"
                href="#builder"
                size="lg"
                variant="ghost"
                color="whiteAlpha.800"
                borderColor="whiteAlpha.300"
                border="1px solid"
                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
              >
                {t('cta.seeInAction', { ns: 'common' })}
              </Button>
            </HStack>

            <HStack spacing={{ base: 4, md: 8 }} flexWrap="wrap" justify="center" pt={4}>
              {[
                { icon: FiCode, label: t('hero.stats.0.label') },
                { icon: FiClock, label: t('hero.stats.1.label') },
                { icon: FiShield, label: t('hero.stats.2.label') },
              ].map((stat) => (
                <HStack key={stat.label} spacing={2}>
                  <Icon as={stat.icon} color="brand.300" boxSize={4} />
                  <Text color="whiteAlpha.600" fontSize="sm" fontWeight="500">
                    {stat.label}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* ─── Section 2: Antes vs Depois (light bg) ─── */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('beforeAfter.heading')}{' '}
            <Text as="span" color="brand.500">{t('beforeAfter.headingHighlight')}</Text>
          </Heading>
          <Text color="gray.500" maxW="500px">
            {t('beforeAfter.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} maxW="900px" mx="auto">
          {/* Before */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box
              bg="red.50"
              p={7}
              borderRadius="2xl"
              border="1px solid"
              borderColor="red.100"
              h="full"
            >
              <Text fontWeight="700" color="red.600" fontSize="sm" textTransform="uppercase" mb={5}>
                {t('beforeAfter.beforeLabel')}
              </Text>
              <List spacing={4}>
                {beforeItems.map((item) => (
                  <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="gray.700">
                    <ListIcon as={FiX} color="red.400" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          </MotionBox>

          {/* After */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box
              bg="green.50"
              p={7}
              borderRadius="2xl"
              border="1px solid"
              borderColor="green.100"
              h="full"
            >
              <Text fontWeight="700" color="green.600" fontSize="sm" textTransform="uppercase" mb={5}>
                {t('beforeAfter.afterLabel')}
              </Text>
              <List spacing={4}>
                {afterItems.map((item) => (
                  <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="gray.700">
                    <ListIcon as={FiCheck} color="green.500" mt={1} />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          </MotionBox>
        </SimpleGrid>
      </SectionWrapper>

      {/* ─── Section 3: Builder em 4 Passos (dark bg) ─── */}
      <Box id="builder">
        <CatalisaStudioShowcase />
      </Box>

      {/* ─── Section 4: Canvas Visual (light bg) ─── */}
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
              <Text as="span" color="brand.500">{t('canvas.headingHighlight')}</Text>
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
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="2xl"
              border="1px solid"
              borderColor="gray.200"
            >
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

      {/* ─── Section 5: Dashboard Real (dark premium bg) ─── */}
      <Box as="section" position="relative" bg="gray.900" overflow="hidden">
        {/* Background gradients */}
        <Box
          position="absolute"
          top="-30%"
          left="20%"
          w="60%"
          h="80%"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.15) 0%, transparent 60%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-20%"
          right="10%"
          w="50%"
          h="50%"
          bgGradient="radial(circle, rgba(37, 211, 102, 0.06) 0%, transparent 60%)"
          pointerEvents="none"
        />

        <Container maxW="1280px" py={{ base: 16, md: 24 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
              <HStack
                bg="whiteAlpha.100"
                px={4}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                spacing={2}
              >
                <Text color="brand.300" fontSize="sm" fontWeight="600">
                  &#10022; {t('dashboard.badge')}
                </Text>
              </HStack>

              <Heading as="h2" fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="800" color="white" lineHeight="1.2">
                {t('dashboard.heading')}{' '}
                <GradientText gradient="linear(to-r, brand.300, brand.400, catalisa.accent)" fontSize="inherit" fontWeight="inherit">
                  {t('dashboard.headingGradient')}
                </GradientText>
              </Heading>
              <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="550px">
                {t('dashboard.subtitle')}
              </Text>
            </VStack>
          </MotionBox>

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
                    alt="Dashboard do Catalisa Studio com metricas de leads, volume de mensagens e pipeline"
                    w="100%"
                    h="auto"
                    mt={{ base: '-50px', md: '-70px', lg: '-90px' }}
                    loading="lazy"
                  />
                </Box>
              </BrowserFrame>
            </Box>
          </MotionBox>

          {/* Stats bar below screenshot */}
          <MotionBox
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Flex
              justify="center"
              mt={{ base: 8, md: 12 }}
              gap={{ base: 6, md: 12 }}
              flexWrap="wrap"
            >
              {[
                { value: t('dashboard.stats.0.value'), label: t('dashboard.stats.0.label') },
                { value: t('dashboard.stats.1.value'), label: t('dashboard.stats.1.label') },
                { value: t('dashboard.stats.2.value'), label: t('dashboard.stats.2.label') },
              ].map((stat) => (
                <VStack key={stat.label} spacing={0}>
                  <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
                    {stat.value}
                  </Text>
                  <Text color="whiteAlpha.500" fontSize="xs">
                    {stat.label}
                  </Text>
                </VStack>
              ))}
            </Flex>
          </MotionBox>
        </Container>
      </Box>

      {/* ─── Section 6: Workflows Interativos ─── */}
      <WorkflowShowcase />

      {/* ─── Section 6: Templates do Builder ─── */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="brand" fontSize="xs" px={3} py={1} borderRadius="full">
            {t('templates.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('templates.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px">
            {t('templates.subtitle')}
          </Text>
        </VStack>

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
                _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-2px)' }}
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

      {/* ─── Section 7: Por que Studio? (dark bg) ─── */}
      <Box bg="gray.900" py={{ base: 16, md: 24 }}>
        <Container maxW="1280px">
          <VStack spacing={4} textAlign="center" mb={12}>
            <Heading as="h2" size="xl" fontWeight="800" color="white">
              {t('whyStudio.heading')}
            </Heading>
            <Text color="whiteAlpha.600" maxW="500px">
              {t('whyStudio.subtitle')}
            </Text>
          </VStack>

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
                  _hover={{ bg: 'whiteAlpha.100', borderColor: 'brand.400' }}
                  transition="all 0.2s"
                >
                  <VStack align="flex-start" spacing={4}>
                    <Box p={3} borderRadius="xl" bg="whiteAlpha.100">
                      <Icon as={diff.icon} boxSize={6} color="brand.300" />
                    </Box>
                    <Heading as="h3" size="md" fontWeight="700" color="white">
                      {diff.title}
                    </Heading>
                    <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.8">
                      {diff.description}
                    </Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* ─── Section 8: FinalCTA ─── */}
      <FinalCTA />
    </>
  );
}
