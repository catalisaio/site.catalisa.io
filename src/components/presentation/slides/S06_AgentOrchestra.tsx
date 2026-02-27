import { Heading, Text, VStack, Box, HStack, Icon, Wrap, WrapItem, Tag, SimpleGrid } from '@chakra-ui/react';
import { FiCpu, FiUser, FiHeadphones, FiDollarSign, FiUserPlus, FiBarChart2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const agentIcons = [FiUser, FiHeadphones, FiDollarSign, FiUserPlus, FiBarChart2];
const agentColors = ['blue.400', 'green.400', 'orange.400', 'purple.400', 'cyan.400'];

export function S06_AgentOrchestra() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const agents = t('agentOrchestra.agents', { returnObjects: true }) as Array<{
    name: string;
    desc: string;
    tools: string[];
  }>;

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 8 }} w="full">
        <VStack spacing={3} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.2">
              {t('agentOrchestra.headline')}{' '}
              <Text as="span" color="brand.400">{t('agentOrchestra.headlineHighlight')}</Text>
            </Heading>
          </MotionBox>
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }} maxW="700px">
              {t('agentOrchestra.subtitle')}
            </Text>
          </MotionBox>
        </VStack>

        {/* Orchestrator */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <VStack
            bg="brand.500"
            color="white"
            px={{ base: 5, md: 8 }}
            py={{ base: 3, md: 4 }}
            borderRadius="xl"
            spacing={1}
            boxShadow="0 0 30px rgba(115,75,156,0.4)"
          >
            <Icon as={FiCpu} boxSize={{ base: 5, md: 7 }} />
            <Text fontWeight="800" fontSize={{ base: 'md', md: 'lg' }}>{t('agentOrchestra.orchestrator')}</Text>
            <Text fontSize="xs" opacity={0.8}>{t('agentOrchestra.orchestratorDesc')}</Text>
          </VStack>
        </MotionBox>

        {/* Connection line */}
        <Box w="2px" h={{ base: 3, md: 4 }} bg="brand.400" opacity={0.4} />

        {/* Agents grid */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={{ base: 3, md: 4 }} w="full">
          {agents.map((agent, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                p={{ base: 3, md: 4 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
              >
                <VStack align="flex-start" spacing={2}>
                  <HStack spacing={2}>
                    <Box p={2} borderRadius="lg" bg={c.iconContainerBg}>
                      <Icon as={agentIcons[i]} boxSize={4} color={agentColors[i]} />
                    </Box>
                    <Text fontWeight="700" fontSize={{ base: 'sm', md: 'md' }}>{agent.name}</Text>
                  </HStack>
                  <Text color={c.textMuted} fontSize="xs" lineHeight="1.5">{agent.desc}</Text>
                  <Wrap spacing={1}>
                    {agent.tools.map((tool, j) => (
                      <WrapItem key={j}>
                        <Tag size="sm" bg={c.tagBg} color={c.tagColor} fontSize="xs" borderRadius="md">
                          {tool}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Gartner note */}
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }} w="full">
          <Box
            bg={c.surfaceBg}
            px={{ base: 4, md: 6 }}
            py={3}
            borderRadius="lg"
            border="1px solid"
            borderColor="brand.800"
            textAlign="center"
          >
            <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary} fontStyle="italic">
              {t('agentOrchestra.gartnerNote')}
            </Text>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
