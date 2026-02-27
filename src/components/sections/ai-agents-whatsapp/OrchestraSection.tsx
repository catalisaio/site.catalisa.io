import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  SimpleGrid,
  Flex,
  Icon,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiCpu, FiUsers, FiHeadphones, FiDollarSign, FiUserCheck, FiBarChart2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { MotionBox, staggerContainer, staggerItem } from '../../motion';
import type { IconType } from 'react-icons';

interface AgentData {
  name: string;
  desc: string;
  tools: string[];
}

interface CardData {
  title: string;
  description: string;
}

const agentIcons: IconType[] = [FiUsers, FiHeadphones, FiDollarSign, FiUserCheck, FiBarChart2];
const agentColors = ['blue.400', 'green.400', 'orange.400', 'purple.400', 'cyan.400'];

export function OrchestraSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const agents = t('orchestra.agents', { returnObjects: true }) as AgentData[];
  const cards = t('orchestra.cards', { returnObjects: true }) as CardData[];

  return (
    <SectionWrapper bg="gray.900" id="orchestra">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="whiteAlpha.100"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="whiteAlpha.200"
          spacing={2}
        >
          <Text color="brand.300" fontSize="sm" fontWeight="600">
            &#10022; {t('orchestra.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="white"
          lineHeight="1.2"
        >
          {t('orchestra.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('orchestra.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="whiteAlpha.600" fontSize={{ base: 'md', md: 'lg' }} maxW="650px">
          {t('orchestra.subtitle')}
        </Text>

        {/* Gartner note */}
        <Box
          mt={2}
          px={5}
          py={3}
          borderRadius="xl"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="brand.400"
          maxW="600px"
        >
          <Text fontSize="sm" color="brand.300" fontWeight="500">
            {t('orchestra.gartnerNote')}
          </Text>
        </Box>
      </VStack>

      {/* Orchestrator + Agents visual */}
      <Box maxW="800px" mx="auto" mb={12}>
        {/* Central orchestrator */}
        <Flex justify="center" mb={8}>
          <VStack
            p={6}
            borderRadius="2xl"
            bg="brand.500"
            border="2px solid"
            borderColor="brand.300"
            spacing={2}
            minW="200px"
          >
            <Icon as={FiCpu} boxSize={8} color="white" />
            <Text color="white" fontWeight="700" fontSize="md">
              {t('orchestra.orchestrator')}
            </Text>
            <Text color="whiteAlpha.700" fontSize="xs" textAlign="center" maxW="220px">
              {t('orchestra.orchestratorDesc')}
            </Text>
          </VStack>
        </Flex>

        {/* Connection lines visual */}
        <Box h="2px" bg="whiteAlpha.200" mx="auto" maxW="600px" mb={8} />

        {/* Agents ring */}
        <MotionBox {...staggerContainer}>
          <Flex
            gap={3}
            justify="center"
            flexWrap="wrap"
          >
            {agents.map((agent, i) => (
              <MotionBox key={agent.name} {...staggerItem}>
                <VStack
                  p={4}
                  borderRadius="xl"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  spacing={2}
                  w={{ base: '140px', md: '150px' }}
                  transition="all 0.3s"
                  _hover={{
                    bg: 'whiteAlpha.100',
                    borderColor: agentColors[i],
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Icon as={agentIcons[i]} boxSize={6} color={agentColors[i]} />
                  <Text color="white" fontWeight="600" fontSize="sm">
                    {agent.name}
                  </Text>
                  <Text color="whiteAlpha.500" fontSize="2xs" textAlign="center">
                    {agent.desc}
                  </Text>
                  <Wrap spacing={1} justify="center">
                    {agent.tools.map((tool) => (
                      <WrapItem key={tool}>
                        <Box
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          bg="whiteAlpha.100"
                          fontSize="2xs"
                          color="whiteAlpha.600"
                        >
                          {tool}
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </MotionBox>
            ))}
          </Flex>
        </MotionBox>
      </Box>

      {/* WhatsApp native features callout */}
      <Box
        maxW="700px"
        mx="auto"
        p={5}
        borderRadius="xl"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whatsapp.600"
        textAlign="center"
        mb={10}
      >
        <Text fontSize="sm" color="whatsapp.300" fontWeight="500">
          {t('orchestra.whatsappNative')}
        </Text>
      </Box>

      {/* Detail cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="900px" mx="auto">
        {cards.map((card) => (
          <Box
            key={card.title}
            p={6}
            borderRadius="2xl"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <VStack align="flex-start" spacing={2}>
              <Text color="white" fontWeight="700" fontSize="md">
                {card.title}
              </Text>
              <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.6">
                {card.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
