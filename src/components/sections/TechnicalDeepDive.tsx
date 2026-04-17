import { Box, Container, Heading, Text, VStack, HStack, Icon, Badge, Code, SimpleGrid, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCode, FiDatabase, FiShield, FiCheckCircle, FiTerminal } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

const FEATURES = [
  {
    icon: FiCode,
    title: 'TypeScript',
    description: 'Cada Building Block é uma função TypeScript tipada',
    color: '#3178C6',
  },
  {
    icon: FiCheckCircle,
    title: 'Test Coverage',
    description: 'Unit tests + integration tests para cada bloco',
    color: '#25D366',
  },
  {
    icon: FiDatabase,
    title: 'Versionamento',
    description: 'Semver documentado com changelog',
    color: '#FDC234',
  },
  {
    icon: FiShield,
    title: 'SLA Garantido',
    description: 'Uptime de 99.9% por Building Block',
    color: '#734B9C',
  },
];

export function TechnicalDeepDive() {
  const { t } = useTranslation('determinism');

  return (
    <Box bg="hero.bg" py={{ base: 12, md: 20 }}>
      <Container maxW="1000px">
        <VStack spacing={8} mb={12}>
          <Badge bg="whiteAlpha.100" color="brand.400" px={4} py={1} borderRadius="full" fontSize="sm">
            {t('technical.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800" color="white" textAlign="center">
            {t('technical.heading')}
          </Heading>
          <Text color="whiteAlpha.700" maxW="600px" textAlign="center" fontSize="lg">
            {t('technical.subtitle')}
          </Text>
        </VStack>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={12}>
          {FEATURES.map((feature, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <HStack 
                align="flex-start" 
                spacing={4} 
                p={5} 
                bg="whiteAlpha.50" 
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
              >
                <Box
                  p={3}
                  borderRadius="lg"
                  bg={`${feature.color}20`}
                >
                  <Icon as={feature.icon} boxSize={6} color={feature.color} />
                </Box>
                <VStack align="flex-start" spacing={1}>
                  <Heading size="sm" color="white" fontWeight="700">
                    {feature.title}
                  </Heading>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    {feature.description}
                  </Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Code Example */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Box
            bg="#1E1E1E"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <HStack 
              px={4} 
              py={3} 
              bg="#2D2D2D" 
              borderBottom="1px solid"
              borderColor="whiteAlpha.100"
            >
              <Icon as={FiTerminal} color="whiteAlpha.600" />
              <Text color="whiteAlpha.600" fontSize="sm" fontFamily="mono">
                catalisa.whatsapp.send.ts
              </Text>
            </HStack>
            <Box p={5} overflowX="auto">
              <Code 
                display="block" 
                whiteSpace="pre" 
                bg="transparent" 
                color="#D4D4D4"
                fontSize="sm"
                fontFamily="mono"
              >
{`// Building Block: WhatsApp Send Message
// Tipo: Determinístico
// Testado: 47 unit tests + 12 integration tests

interface SendMessageParams {
  phone: string;
  template: string;
  variables?: Record<string, string>;
  priority?: 'high' | 'normal' | 'low';
}

async function sendMessage(
  params: SendMessageParams
): Promise<Result<MessageResponse>> {
  // Validação determinística
  const validation = validatePhone(params.phone);
  if (!validation.valid) {
    return Err(new InvalidPhoneError(validation.error));
  }

  // Tentativa com retry exponencial
  const result = await withRetry(
    () => whatsappApi.send(params),
    { maxAttempts: 3, backoff: 'exponential' }
  );

  return result;
}

// Resultado: 100% previsível
// - Sucesso: { success: true, messageId: "..." }
// - Erro: { success: false, error: "..." }`}
              </Code>
            </Box>
          </Box>
        </MotionBox>

        {/* Accordion for more details */}
        <Accordion allowToggle mt={8}>
          <AccordionItem border="none">
            <AccordionButton 
              py={4} 
              color="whiteAlpha.700" 
              _hover={{ bg: 'whiteAlpha.50' }}
              borderRadius="lg"
            >
              <HStack flex="1" textAlign="left">
                <Icon as={FiCode} />
                <Text fontWeight="600">{t('technical.accordion.title')}</Text>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <VStack align="stretch" spacing={4}>
                {(t('technical.accordion.items', { returnObjects: true }) as string[]).map((item, i) => (
                  <HStack key={i} spacing={3}>
                    <Icon as={FiCheckCircle} color="whatsapp.400" />
                    <Text color="whiteAlpha.600" fontSize="sm">{item}</Text>
                  </HStack>
                ))}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </Box>
  );
}
