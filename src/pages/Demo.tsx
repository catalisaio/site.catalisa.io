import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  Button,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiClock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { VideoPlayer } from '../components/shared/VideoPlayer';
import { PhoneMockup } from '../components/shared/PhoneMockup';

export function Demo() {
  const { t } = useTranslation('demo');
  const lp = useLocalizedPath();

  const chapters = t('chapters.items', { returnObjects: true }) as { time: string; label: string }[];
  return (
    <Box bg="gray.900" minH="100vh">
      {/* Hero */}
      <Box
        position="relative"
        overflow="hidden"
        pt={{ base: 24, md: 32 }}
        pb={{ base: 8, md: 12 }}
      >
        <Box
          position="absolute"
          top="-20%"
          left="30%"
          w="60%"
          h="60%"
          bgGradient="radial(circle, rgba(37, 211, 102, 0.1) 0%, transparent 60%)"
          pointerEvents="none"
        />

        <Container maxW="1000px">
          <MotionBox {...fadeInUp}>
            <VStack spacing={4} textAlign="center" mb={{ base: 8, md: 12 }}>
              <HStack
                bg="whiteAlpha.100"
                px={4}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                spacing={2}
              >
                <Text color="green.300" fontSize="sm" fontWeight="600">
                  &#9654; {t('hero.badge')}
                </Text>
              </HStack>

              <Heading
                as="h1"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.2"
                maxW="800px"
              >
                {t('hero.heading')}{' '}
                <GradientText
                  gradient="linear(to-r, green.300, green.400, brand.300)"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  {t('hero.headingGradient')}
                </GradientText>
              </Heading>

              <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
                {t('hero.subtitle')}
              </Text>
            </VStack>
          </MotionBox>

          {/* Video Player */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VideoPlayer
              src="/videos/ai-demo-full.mp4"
              poster="/videos/ai-demo-poster.jpg"
              showBrowserFrame
            />
          </MotionBox>
        </Container>
      </Box>

      {/* Chapters + CTA */}
      <Container maxW="1000px" py={{ base: 8, md: 16 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 8, md: 12 }}
        >
          {/* Chapter list */}
          <Box flex={1}>
            <MotionBox {...fadeInUp}>
              <Heading
                as="h3"
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="700"
                color="white"
                mb={6}
              >
                {t('chapters.heading')}
              </Heading>

              <List spacing={3}>
                {chapters.map((ch) => (
                  <ListItem
                    key={ch.time}
                    display="flex"
                    alignItems="center"
                    color="whiteAlpha.800"
                    fontSize="md"
                    py={2}
                    px={3}
                    borderRadius="lg"
                    _hover={{ bg: 'whiteAlpha.50' }}
                    transition="background 0.2s"
                  >
                    <ListIcon
                      as={FiClock}
                      color="green.300"
                      fontSize="md"
                      mr={3}
                    />
                    <Text
                      color="green.300"
                      fontWeight="700"
                      fontFamily="mono"
                      fontSize="sm"
                      minW="50px"
                    >
                      {ch.time}
                    </Text>
                    <Text>{ch.label}</Text>
                  </ListItem>
                ))}
              </List>
            </MotionBox>
          </Box>

          {/* CTA */}
          <Box flex={1}>
            <MotionBox {...fadeInUp}>
              <Box
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                <VStack spacing={5} align="flex-start">
                  <Heading
                    as="h3"
                    fontSize={{ base: 'lg', md: 'xl' }}
                    fontWeight="700"
                    color="white"
                  >
                    {t('cta.heading')}
                  </Heading>

                  <Text color="whiteAlpha.600" fontSize="md" lineHeight="1.8">
                    {t('cta.description')}
                  </Text>

                  <VStack spacing={3} w="full" pt={2}>
                    <Button
                      as={RouterLink}
                      to={lp('/contato')}
                      size="lg"
                      w="full"
                      rightIcon={<Icon as={FiArrowRight} />}
                      bgGradient="linear(to-r, green.500, green.400)"
                      color="white"
                      _hover={{
                        bgGradient: 'linear(to-r, green.600, green.500)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px -5px rgba(37, 211, 102, 0.4)',
                      }}
                      transition="all 0.3s"
                      borderRadius="xl"
                    >
                      {t('cta.scheduleDemo')}
                    </Button>

                    <Button
                      as={RouterLink}
                      to={lp('/')}
                      size="lg"
                      w="full"
                      variant="outline"
                      borderColor="whiteAlpha.300"
                      color="whiteAlpha.700"
                      _hover={{
                        bg: 'whiteAlpha.100',
                        borderColor: 'whiteAlpha.500',
                        color: 'white',
                      }}
                      transition="all 0.3s"
                      borderRadius="xl"
                    >
                      {t('cta.backToHome')}
                    </Button>
                  </VStack>
                </VStack>
              </Box>
            </MotionBox>
          </Box>
        </Flex>
      </Container>

      {/* Resultado em Producao */}
      <Box
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Container maxW="1000px" py={{ base: 12, md: 20 }}>
          <MotionBox {...fadeInUp}>
            <VStack spacing={4} textAlign="center" mb={{ base: 8, md: 12 }}>
              <HStack
                bg="whiteAlpha.100"
                px={4}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                spacing={2}
              >
                <Text color="green.300" fontSize="sm" fontWeight="600">
                  &#9679; {t('result.badge')}
                </Text>
              </HStack>

              <Heading
                as="h3"
                fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.2"
              >
                {t('result.heading')}{' '}
                <GradientText
                  gradient="linear(to-r, green.300, green.400, brand.300)"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  {t('result.headingGradient')}
                </GradientText>
              </Heading>

              <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
                {t('result.subtitle')}
              </Text>
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              gap={{ base: 8, md: 12 }}
            >
              {/* Phone with WhatsApp video */}
              <Box flexShrink={0}>
                <PhoneMockup maxH="480px">
                  <Box
                    as="video"
                    src="/videos/whatsapp-demo.mp4"
                    poster="/videos/whatsapp-demo-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                </PhoneMockup>
              </Box>

              {/* Context */}
              <VStack align="flex-start" spacing={5} flex={1}>
                <VStack align="flex-start" spacing={3}>
                  {(t('result.items', { returnObjects: true }) as string[]).map((item) => (
                    <HStack key={item} spacing={3} align="flex-start">
                      <Icon as={FiCheckCircle} color="green.400" mt={0.5} flexShrink={0} />
                      <Text color="whiteAlpha.800" fontSize="md">
                        {item}
                      </Text>
                    </HStack>
                  ))}
                </VStack>

                <Box
                  px={4}
                  py={3}
                  borderRadius="xl"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="green.400"
                  borderLeft="3px solid"
                  borderLeftColor="green.400"
                >
                  <Text
                    color="green.300"
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="600"
                    fontStyle="italic"
                  >
                    {t('result.callout')}
                  </Text>
                </Box>

                <Button
                  as={RouterLink}
                  to={lp('/contato')}
                  size="lg"
                  rightIcon={<Icon as={FiArrowRight} />}
                  bgGradient="linear(to-r, green.500, green.400)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, green.600, green.500)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px -5px rgba(37, 211, 102, 0.4)',
                  }}
                  transition="all 0.3s"
                  borderRadius="xl"
                  mt={2}
                >
                  {t('result.cta')}
                </Button>
              </VStack>
            </Flex>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
