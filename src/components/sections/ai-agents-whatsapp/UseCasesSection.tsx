import { useState } from 'react';
import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Button,
  SimpleGrid,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { PhoneMockup } from '../../shared/PhoneMockup';
import { WhatsAppChatPreview } from '../../shared/WhatsAppChatPreview';
import type { ChatMessage } from '../../shared/WhatsAppChatPreview';
import { MotionBox } from '../../motion';

interface BeforeAfter {
  label: string;
  stats: string[];
}

interface Scenario {
  title: string;
  description: string;
  before: BeforeAfter;
  after: BeforeAfter;
  blocks: string[];
  chatMessages: ChatMessage[];
}

export function UseCasesSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const scenariosRaw = t('useCases.scenarios', { returnObjects: true });
  const scenarios = (Array.isArray(scenariosRaw) ? scenariosRaw : []) as Scenario[];
  const [activeTab, setActiveTab] = useState(0);
  const active = scenarios[activeTab];

  return (
    <SectionWrapper bg="white" id="use-cases">
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
            &#10022; {t('useCases.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('useCases.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('useCases.headlineGradient')}
          </GradientText>
        </Heading>
      </VStack>

      {/* Tabs */}
      <HStack
        spacing={2}
        justify="center"
        mb={8}
        flexWrap="wrap"
      >
        {scenarios.map((scenario, i) => (
          <Button
            key={scenario.title}
            size="sm"
            variant={activeTab === i ? 'solid' : 'outline'}
            colorScheme={activeTab === i ? 'brand' : 'gray'}
            onClick={() => setActiveTab(i)}
            borderRadius="full"
          >
            {scenario.title}
          </Button>
        ))}
      </HStack>

      {/* Active scenario content */}
      <MotionBox
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={8}
          maxW="1000px"
          mx="auto"
          align="flex-start"
        >
          {/* Left: Phone with chat */}
          <Box flex="0 0 auto" mx={{ base: 'auto', lg: 0 }}>
            <PhoneMockup maxH="440px">
              <WhatsAppChatPreview
                messages={active.chatMessages}
                title={active.title}
                triggerMode="auto"
              />
            </PhoneMockup>
          </Box>

          {/* Right: Details */}
          <VStack align="stretch" flex={1} spacing={6}>
            <Text color="gray.500" fontSize="md">
              {active.description}
            </Text>

            {/* Before/After comparison */}
            <SimpleGrid columns={2} spacing={4}>
              <Box p={4} borderRadius="xl" bg="red.50" border="1px solid" borderColor="red.200">
                <Text fontSize="xs" fontWeight="700" color="red.500" textTransform="uppercase" mb={2}>
                  {active.before.label}
                </Text>
                <VStack align="flex-start" spacing={1}>
                  {active.before.stats.map((stat) => (
                    <Text key={stat} fontSize="sm" color="red.700">
                      {stat}
                    </Text>
                  ))}
                </VStack>
              </Box>
              <Box p={4} borderRadius="xl" bg="green.50" border="1px solid" borderColor="green.200">
                <Text fontSize="xs" fontWeight="700" color="green.500" textTransform="uppercase" mb={2}>
                  {active.after.label}
                </Text>
                <VStack align="flex-start" spacing={1}>
                  {active.after.stats.map((stat) => (
                    <Text key={stat} fontSize="sm" color="green.700" fontWeight="600">
                      {stat}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </SimpleGrid>

            {/* Building blocks used */}
            <Box>
              <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" mb={2}>
                Building Blocks
              </Text>
              <Wrap spacing={2}>
                {active.blocks.map((block) => (
                  <WrapItem key={block}>
                    <Box
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg="brand.50"
                      border="1px solid"
                      borderColor="brand.200"
                      fontSize="xs"
                      color="brand.600"
                      fontWeight="600"
                    >
                      {block}
                    </Box>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          </VStack>
        </Flex>
      </MotionBox>
    </SectionWrapper>
  );
}
