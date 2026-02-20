import { Box, Container, Flex, HStack, VStack, Text, Link as ChakraLink, SimpleGrid } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiMail, FiMessageCircle } from 'react-icons/fi';
import { config } from '../../config';

type FooterLink = { label: string; to?: string; href?: string };

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Produto',
    links: [
      { label: 'Studio', to: '/studio' },
      { label: 'AI Agents', to: '/ai-agents' },
      { label: 'Building Blocks', to: '/building-blocks' },
      { label: 'Workflows', to: '/workflows' },
      { label: 'Casos de Uso', to: '/use-cases' },
    ],
  },
  {
    title: 'Verticais',
    links: [
      { label: 'Fintech', to: '/fintech' },
      { label: 'Bancario', to: '/bancario' },
      { label: 'Seguros', to: '/seguros' },
      { label: 'Varejo', to: '/varejo' },
      { label: 'Startups', to: '/startups' },
      { label: 'Casos de Uso', to: '/use-cases' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { label: 'Documentacao', href: config.docsUrl },
      { label: 'API Reference', href: config.apiReferenceUrl },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre', to: '/' },
      { label: 'Contato', to: '/contato' },
      { label: 'Termos de Uso', to: '/' },
      { label: 'Politica de Privacidade', to: '/' },
    ],
  },
];

export function Footer() {
  return (
    <Box bg="gray.900" color="whiteAlpha.800" pt={16} pb={8}>
      <Container maxW="1280px">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={10} mb={12}>
          {/* Brand column */}
          <VStack align="flex-start" spacing={4}>
            <Flex align="center" fontWeight="800" fontSize="xl">
              <Box as="span" color="white">Catalisa</Box>
              <Box as="span" color="#ECC94B">.</Box>
            </Flex>
            <Text fontSize="sm" color="whiteAlpha.600" lineHeight="tall">
              Plataforma de automacao WhatsApp com IA para fintechs e empresas brasileiras.
            </Text>
            <HStack spacing={3}>
              <ChakraLink href="mailto:contato@catalisa.io" _hover={{ color: 'brand.300' }}>
                <FiMail size={18} />
              </ChakraLink>
              <ChakraLink href="https://wa.me/5511977303414" _hover={{ color: 'whatsapp.400' }} isExternal>
                <FiMessageCircle size={18} />
              </ChakraLink>
            </HStack>
          </VStack>

          {/* Link columns */}
          {footerSections.map((section) => (
            <VStack key={section.title} align="flex-start" spacing={3}>
              <Text fontWeight="600" color="white" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                {section.title}
              </Text>
              {section.links.map((link) =>
                'to' in link ? (
                  <ChakraLink
                    key={link.label}
                    as={Link}
                    to={link.to}
                    fontSize="sm"
                    color="whiteAlpha.600"
                    _hover={{ color: 'white' }}
                  >
                    {link.label}
                  </ChakraLink>
                ) : (
                  <ChakraLink
                    key={link.label}
                    href={link.href}
                    fontSize="sm"
                    color="whiteAlpha.600"
                    _hover={{ color: 'white' }}
                    isExternal={'href' in link}
                  >
                    {link.label}
                  </ChakraLink>
                )
              )}
            </VStack>
          ))}
        </SimpleGrid>

        <Box borderTop="1px solid" borderColor="whiteAlpha.100" pt={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="xs" color="whiteAlpha.400">
              &copy; {new Date().getFullYear()} Catalisa. Todos os direitos reservados.
            </Text>
            <HStack spacing={4} fontSize="xs" color="whiteAlpha.400">
              <Text>Conforme LGPD</Text>
              <Text>Meta WhatsApp Business</Text>
              <Text>Dados no Brasil</Text>
            </HStack>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
