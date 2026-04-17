import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Flex, VStack, HStack, Icon, Badge, Button, Spinner, Center,
} from '@chakra-ui/react';
import { FiAward, FiPrinter, FiShare2 } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';

interface CertificateData {
  certificate_slug: string;
  certificate_number: string;
  issued_at: string;
  user_email?: string;
}

export function TrainingCertificate() {
  const { certId } = useParams<{ certId: string }>();
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!certId) return;
    (async () => {
      const { data } = await supabase
        .from('training_certificates')
        .select('certificate_slug, certificate_number, issued_at')
        .eq('certificate_number', certId)
        .single();

      if (data) {
        setCert(data as CertificateData);
      }
      setLoading(false);
    })();
  }, [certId]);

  if (loading) {
    return <Center minH="60vh"><Spinner size="lg" color="purple.500" /></Center>;
  }

  if (!cert) {
    return (
      <Center minH="60vh">
        <VStack spacing={2}>
          <Icon as={FiAward} boxSize={12} color="gray.300" />
          <Heading size="md" color="gray.500">Certificado nao encontrado</Heading>
          <Text color="gray.400" fontSize="sm">Verifique o numero do certificado</Text>
        </VStack>
      </Center>
    );
  }

  const certName = cert.certificate_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const issuedDate = new Date(cert.issued_at).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      <Container maxW="3xl">
        {/* Print / Share buttons */}
        <Flex justify="flex-end" gap={2} mb={4} className="no-print">
          <Button
            size="sm"
            leftIcon={<FiPrinter />}
            variant="outline"
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
          <Button
            size="sm"
            leftIcon={<FiShare2 />}
            colorScheme="purple"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copiar Link
          </Button>
        </Flex>

        {/* Certificate */}
        <Box
          bg="white"
          borderRadius="2xl"
          border="3px solid"
          borderColor="yellow.400"
          p={{ base: 6, md: 12 }}
          textAlign="center"
          position="relative"
          overflow="hidden"
          sx={{
            '@media print': {
              border: '3px solid #ECC94B',
              boxShadow: 'none',
              borderRadius: '0',
            },
          }}
        >
          {/* Decorative corners */}
          <Box position="absolute" top={4} left={4} w="40px" h="40px" borderLeft="2px solid" borderTop="2px solid" borderColor="yellow.300" />
          <Box position="absolute" top={4} right={4} w="40px" h="40px" borderRight="2px solid" borderTop="2px solid" borderColor="yellow.300" />
          <Box position="absolute" bottom={4} left={4} w="40px" h="40px" borderLeft="2px solid" borderBottom="2px solid" borderColor="yellow.300" />
          <Box position="absolute" bottom={4} right={4} w="40px" h="40px" borderRight="2px solid" borderBottom="2px solid" borderColor="yellow.300" />

          <VStack spacing={6}>
            {/* Logo / Icon */}
            <Flex w="80px" h="80px" borderRadius="full" bg="yellow.100" align="center" justify="center">
              <Icon as={FiAward} boxSize={10} color="yellow.600" />
            </Flex>

            <VStack spacing={1}>
              <Text fontSize="sm" color="gray.500" textTransform="uppercase" letterSpacing="widest">
                Certificado de Conclusao
              </Text>
              <Heading size="lg" color="gray.800">
                {certName}
              </Heading>
            </VStack>

            <Box w="60px" h="1px" bg="yellow.400" />

            <VStack spacing={1}>
              <Text fontSize="sm" color="gray.500">Concedido a</Text>
              <Heading size="md" color="purple.600">
                {cert.user_email || 'Aluno Catalisa'}
              </Heading>
            </VStack>

            <Text fontSize="sm" color="gray.600" maxW="400px" lineHeight="tall">
              Por ter completado com sucesso todos os requisitos da certificacao
              na plataforma Catalisa Academy.
            </Text>

            <VStack spacing={1}>
              <Text fontSize="xs" color="gray.400">Emitido em {issuedDate}</Text>
              <HStack spacing={2}>
                <Badge colorScheme="yellow" fontSize="xs" px={2} py={0.5}>
                  #{cert.certificate_number}
                </Badge>
              </HStack>
            </VStack>

            {/* Signature line */}
            <Flex gap={12} mt={4}>
              <VStack spacing={0}>
                <Box w="120px" h="1px" bg="gray.300" mb={1} />
                <Text fontSize="2xs" color="gray.400">Catalisa Academy</Text>
              </VStack>
            </Flex>
          </VStack>
        </Box>
      </Container>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          header, footer, nav { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </Box>
  );
}
