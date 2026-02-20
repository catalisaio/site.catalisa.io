import { Heading, Text, VStack, Button, HStack, Box } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { SectionWrapper } from '../shared/SectionWrapper';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function FinalCTA() {
  return (
    <SectionWrapper bg="brand.500" py={{ base: 20, md: 28 }}>
      <VStack spacing={6} textAlign="center" maxW="700px" mx="auto">
        <Heading as="h2" size="2xl" fontWeight="800" color="white">
          Comece sua automacao inteligente
        </Heading>
        <Text color="whiteAlpha.800" fontSize="lg" lineHeight="1.7">
          Conecte seu WhatsApp, monte workflows visuais e ative agentes de IA em minutos.
        </Text>

        <HStack spacing={4} flexWrap="wrap" justify="center">
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            size="lg"
            bg="white"
            color="brand.600"
            _hover={{ bg: 'gray.100', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
            leftIcon={<FiMessageCircle />}
            transition="all 0.2s"
            fontWeight="700"
          >
            Vamos conversar
          </Button>
          <Button
            as={Link}
            to="/contato"
            size="lg"
            variant="outline"
            borderColor="whiteAlpha.500"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            Conheca mais
          </Button>
        </HStack>

        <HStack spacing={6} fontSize="sm" color="whiteAlpha.700" flexWrap="wrap" justify="center">
          <Text>Setup em minutos</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>Conforme LGPD</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>Meta WhatsApp Business</Text>
        </HStack>
      </VStack>
    </SectionWrapper>
  );
}
