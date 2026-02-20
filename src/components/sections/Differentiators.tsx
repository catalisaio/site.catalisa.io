import { Heading, Text, VStack, Box, SimpleGrid, Icon, HStack, Badge } from '@chakra-ui/react';
import { FiZap, FiBox, FiMessageCircle, FiClock } from 'react-icons/fi';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

const differentiators = [
  {
    icon: FiZap,
    vs: 'vs n8n / Make',
    title: 'IA nativa, nao plugin',
    description: 'Agentes de IA, analise de sentimento, OCR e geracao de texto sao building blocks nativos — sem instalar plugins ou configurar APIs externas.',
    color: 'purple.500',
    bg: 'purple.50',
  },
  {
    icon: FiBox,
    vs: 'vs Intercom / WATI',
    title: 'Blocos composiveis, nao chatbot',
    description: 'Nao e um chatbot com menu fixo. Sao 150+ building blocks que voce combina livremente para criar automacoes sob medida.',
    color: 'orange.500',
    bg: 'orange.50',
  },
  {
    icon: FiMessageCircle,
    vs: 'vs Zapier / Pipedream',
    title: 'WhatsApp nativo + IA embarcada',
    description: 'Conexao direta com WhatsApp (Baileys + Cloud API), agentes IA com ferramentas reais, CRM integrado — tudo na mesma plataforma.',
    color: 'green.500',
    bg: 'green.50',
  },
  {
    icon: FiClock,
    vs: 'vs Desenvolvimento interno',
    title: '150+ building blocks. Meses de economia.',
    description: 'De fintech a CRM, de seguranca a calendario — building blocks prontos e testados. Foque no seu negocio, nao em infraestrutura.',
    color: 'blue.500',
    bg: 'blue.50',
  },
];

export function Differentiators() {
  return (
    <SectionWrapper bg="gray.50">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Badge colorScheme="brand" fontSize="xs" px={3} py={1} borderRadius="full">
          DIFERENCIAIS
        </Badge>
        <Heading as="h2" size="xl" fontWeight="800">
          Por que a <Text as="span" color="brand.500">Catalisa</Text>?
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          Comparamos com as alternativas para voce decidir com clareza.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {differentiators.map((item, i) => (
          <MotionBox
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Box
              bg="white"
              p={7}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: item.color, boxShadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
              h="full"
            >
              <VStack align="flex-start" spacing={4}>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg={item.bg}>
                    <Icon as={item.icon} boxSize={5} color={item.color} />
                  </Box>
                  <Badge colorScheme="gray" variant="subtle" fontSize="xs" px={2}>
                    {item.vs}
                  </Badge>
                </HStack>
                <Heading as="h3" size="sm" fontWeight="700">
                  {item.title}
                </Heading>
                <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                  {item.description}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
