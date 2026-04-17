import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, VTEX_ACTIONS } from '../../data/vtexDay2026';

const MotionBox = motion(Box);

export function VtexDayWorkflowScroll() {
  const { t } = useTranslation('vtex-day-2026');

  return (
    <Box as="section" id="vtex-day-workflow" py={{ base: 16, md: 24 }} bg="hero.bg" color="white">
      <Container maxW="1200px">
        <VStack spacing={4} textAlign="center" mb={12}>
          <HStack spacing={3} justify="center" flexWrap="wrap">
            <Badge
              bg="whiteAlpha.100"
              color="whatsapp.300"
              px={4}
              py={1.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="600"
            >
              Assistente E-commerce · template produtivo
            </Badge>
            <HStack px={3} py={1.5} borderRadius="full" bg="#F7196318" border="1px solid" borderColor="#F7196340" spacing={2}>
              <Box w="8px" h="8px" borderRadius="full" bg="#F71963" boxShadow="0 0 6px #F71963"
                sx={{ animation: 'vtexPulse 2s ease-in-out infinite', '@keyframes vtexPulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
              <Text fontSize="xs" fontWeight="700" color="#F71963" letterSpacing="wide">POWERED BY VTEX</Text>
            </HStack>
          </HStack>
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }}>
            {t('workflow.heading')}
          </Heading>
          <Text color="whiteAlpha.700" fontSize="md" maxW="640px">
            {t('workflow.subtitle')}
          </Text>
        </VStack>

        <VStack spacing={6} align="stretch">
          {CATEGORIES.map((category, idx) => {
            const actions = VTEX_ACTIONS.filter((a) => a.category === category.key);
            return (
              <MotionBox
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="xl"
                p={{ base: 5, md: 7 }}
                _hover={{
                  bg: 'whiteAlpha.100',
                  borderColor: 'brand.300',
                  boxShadow: '0 0 30px rgba(115,75,156,0.2)',
                }}
                sx={{ transitionProperty: 'background, border-color, box-shadow', transitionDuration: '0.3s' }}
              >
                <HStack justify="space-between" mb={4} flexWrap="wrap" gap={3}>
                  <HStack spacing={3}>
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="lg"
                      bg="brand.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="sm"
                      fontWeight="700"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </Box>
                    <VStack align="flex-start" spacing={0}>
                      <Text fontSize="lg" fontWeight="700">
                        {category.label}
                      </Text>
                      <Text fontSize="sm" color="whiteAlpha.700">
                        {category.tagline}
                      </Text>
                    </VStack>
                  </HStack>
                  <Badge
                    bg="whiteAlpha.100"
                    color="whatsapp.300"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {actions.length} {actions.length === 1 ? 'ação' : 'ações'}
                  </Badge>
                </HStack>

                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                  {actions.map((action) => (
                    <Box
                      key={action.slug}
                      bg="rgba(0,0,0,0.3)"
                      border="1px solid"
                      borderColor={action.featured ? 'brand.400' : 'whiteAlpha.100'}
                      borderRadius="md"
                      px={3}
                      py={2.5}
                      position="relative"
                    >
                      {action.featured && (
                        <Box
                          position="absolute"
                          top={-1}
                          right={-1}
                          w="8px"
                          h="8px"
                          borderRadius="full"
                          bg="whatsapp.400"
                          boxShadow="0 0 8px rgba(37,211,102,0.6)"
                        />
                      )}
                      <Text
                        fontSize="xs"
                        fontFamily="mono"
                        color="brand.200"
                        fontWeight="600"
                        mb={0.5}
                      >
                        vtex-{action.slug}
                      </Text>
                      <Text fontSize="sm" color="white" fontWeight="600">
                        {action.label}
                      </Text>
                      <Text fontSize="xs" color="whiteAlpha.600" mt={0.5}>
                        {action.short}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </MotionBox>
            );
          })}
        </VStack>

        <Text
          textAlign="center"
          mt={12}
          fontSize={{ base: 'md', md: 'lg' }}
          color="whatsapp.300"
          fontWeight="700"
        >
          {t('workflow.footer')}
        </Text>
      </Container>
    </Box>
  );
}
