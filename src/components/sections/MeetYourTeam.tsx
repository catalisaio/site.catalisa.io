import { useState } from 'react';
import { Box, Heading, Text, VStack, HStack, Flex, SimpleGrid } from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { GradientText } from '../shared/GradientText';
import { AgentProfileCard } from '../shared/AgentProfileCard';
import { MotionBox, staggerContainer } from '../motion';

interface AgentData {
  role: string;
  capabilities: string[];
  tools: string[];
  stats: string;
}

export function MeetYourTeam() {
  const { t } = useTranslation('home');
  const agents = t('meetYourTeam.agents', { returnObjects: true }) as AgentData[];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = agents[selectedIndex];

  return (
    <SectionWrapper bg="white" id="meet-your-team">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="brand.50"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="brand.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('meetYourTeam.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('meetYourTeam.heading')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('meetYourTeam.headingGradient')}
          </GradientText>
        </Heading>
      </VStack>

      {/* Agent cards - horizontal scroll on mobile */}
      <MotionBox {...staggerContainer}>
        <Flex
          gap={4}
          justify={{ base: 'flex-start', lg: 'center' }}
          overflowX={{ base: 'auto', lg: 'visible' }}
          pb={4}
          px={2}
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {agents.map((agent, i) => (
            <AgentProfileCard
              key={agent.role}
              role={agent.role}
              capabilities={agent.capabilities}
              tools={agent.tools}
              stats={agent.stats}
              isSelected={i === selectedIndex}
              onSelect={() => setSelectedIndex(i)}
              colorIndex={i}
            />
          ))}
        </Flex>
      </MotionBox>

      {/* Expanded detail panel */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={selected.role}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <Box
            mt={6}
            p={6}
            borderRadius="2xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
          >
            <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
              {/* Capabilities */}
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="700" color="gray.800" mb={3}>
                  {t('meetYourTeam.capabilitiesLabel')}
                </Text>
                <VStack align="flex-start" spacing={2}>
                  {selected.capabilities.map((cap) => (
                    <HStack key={cap} spacing={2}>
                      <Box as={FiCheck} color="brand.500" boxSize={4} flexShrink={0} />
                      <Text fontSize="sm" color="gray.600">{cap}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Tools */}
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="700" color="gray.800" mb={3}>
                  {t('meetYourTeam.toolsLabel')}
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  {selected.tools.map((tool) => (
                    <HStack
                      key={tool}
                      px={3}
                      py={2}
                      borderRadius="lg"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      spacing={2}
                    >
                      <Box w="6px" h="6px" borderRadius="full" bg="brand.400" />
                      <Text fontSize="sm" color="gray.600">{tool}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Stats */}
              <Box>
                <Text fontSize="sm" fontWeight="700" color="gray.800" mb={3}>
                  Performance
                </Text>
                <Box
                  px={4}
                  py={3}
                  borderRadius="lg"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontSize="sm" color="gray.600" fontFamily="mono">
                    {selected.stats}
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Box>
        </MotionBox>
      </AnimatePresence>
    </SectionWrapper>
  );
}
