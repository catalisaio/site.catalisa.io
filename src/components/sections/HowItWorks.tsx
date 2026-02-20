import { Heading, Text, VStack, Box, SimpleGrid, Icon, HStack } from '@chakra-ui/react';
import { FiSmartphone, FiLayout, FiZap } from 'react-icons/fi';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

const steps = [
  {
    icon: FiSmartphone,
    number: '01',
    title: 'Conecte seu WhatsApp',
    description: 'QR Code para Baileys ou Cloud API da Meta. Setup em 2 minutos. Multi-device suportado.',
    color: 'whatsapp.500',
  },
  {
    icon: FiLayout,
    number: '02',
    title: 'Monte seu workflow visual',
    description: 'Arraste building blocks no canvas. Conecte triggers a blocos. Configure cada um sem codigo.',
    color: 'brand.500',
  },
  {
    icon: FiZap,
    number: '03',
    title: 'Ative e escale',
    description: 'IA assume a operacao. Voce monitora resultados. Escale de 1 para 1.000 conversas sem contratar.',
    color: 'catalisa.accent',
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          Como funciona
        </Heading>
        <Text color="gray.500" maxW="500px" fontSize="lg">
          Tres passos para automatizar seu WhatsApp com inteligencia artificial.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {steps.map((step, i) => (
          <MotionBox
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
          >
            <VStack align="flex-start" spacing={5} position="relative">
              <HStack spacing={4}>
                <Box
                  p={4}
                  borderRadius="xl"
                  bg="white"
                  boxShadow="md"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Icon as={step.icon} boxSize={7} color={step.color} />
                </Box>
                <Text fontSize="5xl" fontWeight="900" color="gray.100" lineHeight={1}>
                  {step.number}
                </Text>
              </HStack>
              <Heading as="h3" size="md" fontWeight="700">
                {step.title}
              </Heading>
              <Text color="gray.500" lineHeight="1.7">
                {step.description}
              </Text>

              {/* Connector line (not on last) */}
              {i < 2 && (
                <Box
                  display={{ base: 'none', md: 'block' }}
                  position="absolute"
                  top="28px"
                  right="-16px"
                  w="32px"
                  h="2px"
                  bg="gray.200"
                />
              )}
            </VStack>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
