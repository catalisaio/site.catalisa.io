import { Box, Container, Text, HStack } from '@chakra-ui/react';

const partners = [
  'WhatsApp Business',
  'Meta',
  'Anthropic',
  'OpenAI',
  'Microsoft Teams',
  'Outlook',
  'Prisma',
  'Redis',
  'PostgreSQL',
  'Cloud Brasil',
];

export function LogoMarquee() {
  return (
    <Box bg="gray.50" py={6} overflow="hidden">
      <Container maxW="1280px" mb={4}>
        <Text textAlign="center" fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" fontWeight="600">
          Tecnologias e integrações
        </Text>
      </Container>
      <Box overflow="hidden" position="relative">
        {/* Fade edges */}
        <Box position="absolute" left={0} top={0} bottom={0} w="80px" bgGradient="linear(to-r, gray.50, transparent)" zIndex={1} />
        <Box position="absolute" right={0} top={0} bottom={0} w="80px" bgGradient="linear(to-l, gray.50, transparent)" zIndex={1} />

        <HStack spacing={12} className="marquee-track" w="max-content">
          {[...partners, ...partners].map((name, i) => (
            <Text
              key={i}
              fontSize="sm"
              fontWeight="600"
              color="gray.400"
              whiteSpace="nowrap"
              letterSpacing="wide"
              _hover={{ color: 'brand.500' }}
              transition="color 0.2s"
            >
              {name}
            </Text>
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
