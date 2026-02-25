import { Box, SimpleGrid, HStack, VStack, Text, Flex, Icon } from '@chakra-ui/react';
import { FiArrowRight, FiMessageCircle, FiUsers, FiCpu, FiBarChart2, FiShield, FiServer } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { MotionBox } from '../motion';

interface CardItem {
  title: string;
  agent: string;
  app: string;
}

const agentIcons = [FiMessageCircle, FiUsers, FiCpu];
const appIcons = [FiBarChart2, FiShield, FiServer];

export function AgentsAndAppsTogether() {
  const { t } = useTranslation('home');

  const cards = t('agentsAndApps.examples', { returnObjects: true }) as CardItem[];

  return (
    <SectionWrapper bg="white">
      <SectionHeader
        badge={t('agentsAndApps.badge')}
        heading={t('agentsAndApps.heading')}
        headingGradient={t('agentsAndApps.headingGradient')}
        subtitle={t('agentsAndApps.subtitle')}
        gradient="linear(to-r, brand.400, brand.500, orange.400)"
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, md: 6 }}>
        {cards.map((card, i) => (
          <MotionBox
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
              h="full"
            >
              <VStack align="flex-start" spacing={5}>
                {/* Card title */}
                <Text fontWeight="700" fontSize="md" color="gray.800">
                  {card.title}
                </Text>

                {/* Agent + Arrow + App row */}
                <Flex align="center" gap={3} w="full">
                  {/* Agent side */}
                  <VStack
                    flex={1}
                    align="center"
                    spacing={2}
                    p={3}
                    borderRadius="lg"
                    bg="brand.50"
                    border="1px solid"
                    borderColor="brand.100"
                  >
                    <Box
                      p={2.5}
                      borderRadius="full"
                      bg="brand.100"
                    >
                      <Icon as={agentIcons[i % agentIcons.length]} color="brand.500" boxSize={5} />
                    </Box>
                    <Text color="brand.600" fontSize="xs" fontWeight="600" textAlign="center">
                      {card.agent}
                    </Text>
                  </VStack>

                  {/* Arrow */}
                  <Box flexShrink={0}>
                    <Icon as={FiArrowRight} color="gray.400" boxSize={5} />
                  </Box>

                  {/* App side */}
                  <VStack
                    flex={1}
                    align="center"
                    spacing={2}
                    p={3}
                    borderRadius="lg"
                    bg="orange.50"
                    border="1px solid"
                    borderColor="orange.100"
                  >
                    <Box
                      p={2.5}
                      borderRadius="full"
                      bg="orange.100"
                    >
                      <Icon as={appIcons[i % appIcons.length]} color="orange.500" boxSize={5} />
                    </Box>
                    <Text color="orange.600" fontSize="xs" fontWeight="600" textAlign="center">
                      {card.app}
                    </Text>
                  </VStack>
                </Flex>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>

      {/* Bottom callout */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Box
          mt={{ base: 10, md: 12 }}
          p={{ base: 5, md: 7 }}
          borderRadius="2xl"
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
        >
          <HStack spacing={4} align="flex-start" direction={{ base: 'column', md: 'row' }}>
            <Box
              p={3}
              borderRadius="xl"
              bg="orange.100"
              flexShrink={0}
            >
              <Icon as={FiServer} color="orange.500" boxSize={6} />
            </Box>
            <VStack align="flex-start" spacing={1}>
              <Text fontWeight="700" fontSize="md" color="gray.800">
                {t('agentsAndApps.callout.heading')}
              </Text>
              <Text color="gray.600" fontSize="sm" lineHeight="1.7">
                {t('agentsAndApps.callout.description')}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </MotionBox>
    </SectionWrapper>
  );
}
