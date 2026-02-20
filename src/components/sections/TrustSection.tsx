import { Heading, Text, VStack, Wrap, WrapItem, HStack, Icon, Box } from '@chakra-ui/react';
import { FiShield, FiLock, FiGlobe, FiUsers, FiKey, FiCheckCircle } from 'react-icons/fi';
import { SectionWrapper } from '../shared/SectionWrapper';

const badges = [
  { icon: FiShield, label: 'Conforme LGPD', color: 'green.500' },
  { icon: FiCheckCircle, label: 'Meta WhatsApp Business', color: 'blue.500' },
  { icon: FiLock, label: 'Criptografia ponta a ponta', color: 'brand.500' },
  { icon: FiUsers, label: 'Isolamento multi-tenant', color: 'orange.500' },
  { icon: FiKey, label: 'Controle de acesso (RBAC)', color: 'red.500' },
  { icon: FiGlobe, label: 'Dados armazenados no Brasil', color: 'cyan.500' },
];

export function TrustSection() {
  return (
    <SectionWrapper bg="gray.50">
      <VStack spacing={8} textAlign="center">
        <VStack spacing={3}>
          <Heading as="h2" size="xl" fontWeight="800">
            Seguranca de nivel bancario
          </Heading>
          <Text color="gray.500" maxW="500px" fontSize="lg">
            Seus dados protegidos com as mesmas praticas de seguranca de grandes instituicoes financeiras.
          </Text>
        </VStack>

        <Wrap spacing={4} justify="center">
          {badges.map((badge) => (
            <WrapItem key={badge.label}>
              <HStack
                bg="white"
                px={5}
                py={3}
                borderRadius="full"
                border="1px solid"
                borderColor="gray.200"
                spacing={3}
                _hover={{ borderColor: badge.color, boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                <Icon as={badge.icon} boxSize={4} color={badge.color} />
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  {badge.label}
                </Text>
              </HStack>
            </WrapItem>
          ))}
        </Wrap>

        <Box
          bg="white"
          px={6}
          py={3}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="sm" color="gray.500">
            Infraestrutura em <Text as="span" fontWeight="600" color="gray.700">nuvem no Brasil</Text> com backups automaticos e monitoramento 24/7
          </Text>
        </Box>
      </VStack>
    </SectionWrapper>
  );
}
