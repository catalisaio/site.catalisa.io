import {
  Box, Container, Heading, Text, VStack, HStack, Button, SimpleGrid,
  FormControl, FormLabel, Input, Textarea, Icon, Flex,
} from '@chakra-ui/react';
import { FiMessageCircle, FiMail, FiClock, FiHeart, FiMonitor } from 'react-icons/fi';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { WhatsAppChatPreview } from '../components/shared/WhatsAppChatPreview';
import type { ChatMessage } from '../components/shared/WhatsAppChatPreview';
import { SectionWrapper } from '../components/shared/SectionWrapper';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

const contactMessages: ChatMessage[] = [
  { text: 'Ola! Vi o site de voces e quero saber mais sobre automacao WhatsApp.', sent: false, delay: 0.3 },
  { text: 'Ola! Que bom ter voce aqui! Posso te ajudar! Voce ja usa WhatsApp Business?', sent: true, delay: 1.0 },
  { text: 'Sim, mas tudo manual ainda...', sent: false, delay: 1.8 },
  { text: 'Perfeito, vou te mostrar como automatizar isso em minutos. Pode me contar um pouco sobre seu negocio?', sent: true, delay: 2.6 },
];

const differentials = [
  {
    icon: FiClock,
    title: 'Resposta rapida',
    description: 'Nossa equipe responde em menos de 1 hora durante o horario comercial.',
  },
  {
    icon: FiHeart,
    title: 'Sem compromisso',
    description: 'Conversa aberta, sem pressao. Queremos entender seu cenario primeiro.',
  },
  {
    icon: FiMonitor,
    title: 'Demo personalizada',
    description: 'Mostramos a plataforma funcionando com exemplos do seu negocio.',
  },
];

export function Contact() {
  return (
    <>
      {/* Hero section (dark bg) */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            justify="space-between"
            gap={{ base: 12, lg: 16 }}
          >
            {/* Left: Text + CTA */}
            <VStack align="flex-start" spacing={6} flex={1} maxW="560px">
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <HStack
                  bg="whiteAlpha.100"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  spacing={2}
                >
                  <Box w={2} h={2} borderRadius="full" bg="whatsapp.400" />
                  <Text color="whiteAlpha.800" fontSize="sm" fontWeight="600">FALE CONOSCO</Text>
                </HStack>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Heading
                  as="h1"
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  fontWeight="800"
                  color="white"
                  lineHeight="1.1"
                >
                  Vamos construir algo incrivel{' '}
                  <GradientText
                    gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
                    fontSize="inherit"
                    fontWeight="inherit"
                  >
                    juntos.
                  </GradientText>
                </Heading>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="480px">
                  Conte o que voce precisa. Nossa equipe responde rapido
                  — geralmente em menos de 1 hora.
                </Text>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
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
                  Conversar no WhatsApp
                </Button>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <HStack spacing={2} pt={2}>
                  <Icon as={FiMail} color="whiteAlpha.500" boxSize={4} />
                  <Text color="whiteAlpha.600" fontSize="sm">contato@catalisa.io</Text>
                </HStack>
              </MotionBox>
            </VStack>

            {/* Right: WhatsApp Chat Preview */}
            <MotionBox
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              display={{ base: 'none', lg: 'block' }}
            >
              <WhatsAppChatPreview
                messages={contactMessages}
                title="Equipe Catalisa"
                triggerMode="auto"
              />
            </MotionBox>
          </Flex>
        </Container>
      </Box>

      {/* Form section (light bg) */}
      <SectionWrapper>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 10, lg: 16 }}
          align="flex-start"
        >
          {/* Left: Form */}
          <Box flex={1} maxW={{ lg: '560px' }}>
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="lg" fontWeight="800">
                Prefere enviar uma mensagem?
              </Heading>
              <Text color="gray.500" fontSize="md" mb={2}>
                Preencha o formulario e entraremos em contato.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600">Nome</FormLabel>
                  <Input placeholder="Seu nome" focusBorderColor="brand.500" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600">Email</FormLabel>
                  <Input type="email" placeholder="seu@email.com" focusBorderColor="brand.500" />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Telefone</FormLabel>
                <Input type="tel" placeholder="(11) 99999-9999" focusBorderColor="brand.500" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Mensagem</FormLabel>
                <Textarea
                  placeholder="Conte um pouco sobre seu negocio e o que precisa..."
                  rows={4}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <Button
                as="a"
                href="mailto:contato@catalisa.io"
                size="lg"
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
                fontWeight="700"
                w={{ base: 'full', md: 'auto' }}
                alignSelf="flex-start"
              >
                Enviar mensagem
              </Button>
            </VStack>
          </Box>

          {/* Right: Differentials */}
          <VStack flex={1} spacing={5} align="stretch" pt={{ base: 0, lg: 2 }}>
            {differentials.map((diff, i) => (
              <MotionBox
                key={diff.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <HStack
                  spacing={4}
                  p={5}
                  bg="gray.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ borderColor: 'brand.200', boxShadow: 'sm' }}
                  transition="all 0.2s"
                >
                  <Box p={3} borderRadius="xl" bg="brand.50" flexShrink={0}>
                    <Icon as={diff.icon} boxSize={5} color="brand.500" />
                  </Box>
                  <VStack align="flex-start" spacing={1}>
                    <Text fontWeight="700" fontSize="sm">{diff.title}</Text>
                    <Text color="gray.500" fontSize="sm" lineHeight="1.6">{diff.description}</Text>
                  </VStack>
                </HStack>
              </MotionBox>
            ))}
          </VStack>
        </Flex>
      </SectionWrapper>
    </>
  );
}
