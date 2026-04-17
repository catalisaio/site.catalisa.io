import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

interface Step {
  title: string;
  desc: string;
  time: string;
}

export function VtexDayFiveMinutes() {
  const { t } = useTranslation('vtex-day-2026');
  const steps = t('fiveMin.steps', { returnObjects: true }) as Step[];

  return (
    <Box as="section" id="vtex-day-five-min" py={{ base: 16, md: 24 }} bg="bg-accent">
      <Container maxW="1200px">
        <VStack spacing={3} textAlign="center" mb={12}>
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }} color="text-primary">
            {t('fiveMin.heading')}
          </Heading>
        </VStack>

        <Box position="relative">
          <Box
            display={{ base: 'none', md: 'block' }}
            position="absolute"
            top="32px"
            left="10%"
            right="10%"
            h="2px"
            bgGradient="linear(to-r, brand.200, brand.500, whatsapp.500)"
            opacity={0.4}
            zIndex={0}
          />

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} position="relative" zIndex={1}>
            {steps.map((step, i) => (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <VStack spacing={3} align={{ base: 'flex-start', md: 'center' }} textAlign={{ base: 'left', md: 'center' }}>
                  <Box
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    bg="bg-card"
                    border="2px solid"
                    borderColor="brand.500"
                    color="brand.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="800"
                    fontSize="xl"
                    boxShadow="0 4px 20px rgba(115,75,156,0.2)"
                  >
                    {i + 1}
                  </Box>
                  <HStack spacing={2}>
                    <Heading as="h3" fontSize="md" fontWeight="700" color="text-primary">
                      {step.title}
                    </Heading>
                    <Badge bg="whatsapp.50" color="whatsapp.700" fontSize="xs" borderRadius="full" px={2}>
                      {step.time}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="text-secondary" lineHeight="1.55">
                    {step.desc}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}
