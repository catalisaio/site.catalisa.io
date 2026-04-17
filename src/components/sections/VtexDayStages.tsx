import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack, Wrap, WrapItem } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { STAGES, VOICES, EVENT } from '../../data/vtexDay2026';

const MotionBox = motion(Box);

export function VtexDayStages() {
  const { t } = useTranslation('vtex-day-2026');

  return (
    <Box as="section" id="vtex-day-stages" py={{ base: 16, md: 24 }} bg="bg-page">
      <Container maxW="1200px">
        <VStack spacing={3} textAlign="center" mb={10}>
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }} color="text-primary">
            {t('stages.heading')}
          </Heading>
          <Text color="text-secondary" fontSize="md">
            {t('stages.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={14}>
          {STAGES.map((stage, i) => (
            <MotionBox
              key={stage.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              bg="bg-card"
              borderRadius="xl"
              p={6}
              border="1px solid"
              borderColor="border-default"
              _hover={{
                borderColor: 'brand.300',
                boxShadow: '0 10px 30px -10px rgba(115,75,156,0.3)',
                transform: 'translateY(-2px)',
              }}
              sx={{ transitionProperty: 'border-color, box-shadow, transform', transitionDuration: '0.2s' }}
            >
              <Text fontSize="2xl" mb={2}>
                {stage.icon}
              </Text>
              <Heading as="h3" fontSize="lg" fontWeight="700" color="text-primary" mb={2}>
                {stage.name}
              </Heading>
              <Text fontSize="sm" color="text-secondary" lineHeight="1.55">
                {stage.blurb}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>

        <VStack spacing={6} mb={10}>
          <Heading as="h3" fontSize={{ base: 'md', md: 'lg' }} color="text-secondary" fontWeight="700">
            — {t('stages.voicesHeading')} —
          </Heading>
          <Wrap spacing={4} justify="center">
            {VOICES.map((voice) => (
              <WrapItem key={voice.name}>
                <Box
                  bg="bg-card"
                  borderRadius="full"
                  px={4}
                  py={2}
                  border="1px solid"
                  borderColor="border-default"
                  minW="240px"
                >
                  <HStack spacing={3}>
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="full"
                      bg="brand.500"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize="sm"
                      fontWeight="700"
                      flexShrink={0}
                    >
                      {voice.name
                        .split(' ')
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </Box>
                    <VStack spacing={0} align="flex-start">
                      <Text fontSize="sm" fontWeight="700" color="text-primary" noOfLines={1}>
                        {voice.name}
                      </Text>
                      <Text fontSize="xs" color="text-muted" noOfLines={1}>
                        {voice.company}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>

        <Text
          textAlign="center"
          color="text-muted"
          fontSize="sm"
          fontStyle="italic"
        >
          {t('stages.boothNudge')} — {EVENT.boothLabel}
        </Text>
      </Container>
    </Box>
  );
}
