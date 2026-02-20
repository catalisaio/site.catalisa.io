import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Flex, Badge,
  List, ListItem, ListIcon,
} from '@chakra-ui/react';
import {
  FiCpu, FiMessageCircle, FiTool, FiDatabase, FiUsers, FiArrowRight,
  FiCheck, FiMic, FiSmile, FiEdit3, FiGlobe, FiImage, FiFileText,
  FiSearch, FiCalendar, FiGitBranch, FiSettings, FiSend, FiUserPlus,
  FiClipboard, FiBarChart2,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { MotionBox } from '../components/motion';
import { GradientText } from '../components/shared/GradientText';
import { agentTemplates } from '../data/useCases';
import { FinalCTA } from '../components/sections/FinalCTA';

export function AIAgents() {
  const { t } = useTranslation('ai-agents');
  const comparisonItems = [
    {
      type: t('comparison.items.0.type'),
      description: t('comparison.items.0.description'),
      capabilities: t('comparison.items.0.capabilities', { returnObjects: true }) as string[],
      color: 'gray',
      level: t('comparison.items.0.level'),
    },
    {
      type: t('comparison.items.1.type'),
      description: t('comparison.items.1.description'),
      capabilities: t('comparison.items.1.capabilities', { returnObjects: true }) as string[],
      color: 'brand',
      level: t('comparison.items.1.level'),
      highlight: true,
    },
    {
      type: t('comparison.items.2.type'),
      description: t('comparison.items.2.description'),
      capabilities: t('comparison.items.2.capabilities', { returnObjects: true }) as string[],
      color: 'purple',
      level: t('comparison.items.2.level'),
    },
  ];

  const aiCapabilities = [
    { icon: FiSmile, label: t('aiCapabilities.items.0.label'), description: t('aiCapabilities.items.0.description') },
    { icon: FiFileText, label: t('aiCapabilities.items.1.label'), description: t('aiCapabilities.items.1.description') },
    { icon: FiDatabase, label: t('aiCapabilities.items.2.label'), description: t('aiCapabilities.items.2.description') },
    { icon: FiEdit3, label: t('aiCapabilities.items.3.label'), description: t('aiCapabilities.items.3.description') },
    { icon: FiGlobe, label: t('aiCapabilities.items.4.label'), description: t('aiCapabilities.items.4.description') },
    { icon: FiTool, label: t('aiCapabilities.items.5.label'), description: t('aiCapabilities.items.5.description') },
    { icon: FiImage, label: t('aiCapabilities.items.6.label'), description: t('aiCapabilities.items.6.description') },
    { icon: FiMic, label: t('aiCapabilities.items.7.label'), description: t('aiCapabilities.items.7.description') },
  ];
  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={6} textAlign="center" maxW="800px" mx="auto">
            <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('hero.badge')}
            </Badge>
            <Heading as="h1" size="2xl" fontWeight="800" color="white" lineHeight="1.15">
              {t('hero.heading')}{' '}
              <GradientText gradient="linear(to-r, brand.300, whatsapp.400)">{t('hero.headingGradient')}</GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" lineHeight="1.7">
              {t('hero.subtitle')}
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Comparison: Chatbot vs Agent vs Team */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('comparison.heading')}{' '}<Text as="span" color="brand.500">{t('comparison.headingHighlight')}</Text>
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {comparisonItems.map((item, i) => (
            <MotionBox
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Box
                bg="white"
                p={7}
                borderRadius="xl"
                border="2px solid"
                borderColor={item.highlight ? 'brand.400' : 'gray.100'}
                boxShadow={item.highlight ? 'lg' : 'sm'}
                h="full"
                position="relative"
              >
                {item.highlight && (
                  <Badge
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                    colorScheme="brand"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    {t('comparison.yourProduct')}
                  </Badge>
                )}
                <VStack align="flex-start" spacing={4}>
                  <Badge colorScheme={item.color} variant="subtle" fontSize="xs">{item.level}</Badge>
                  <Heading as="h3" size="md" fontWeight="700">{item.type}</Heading>
                  <Text color="gray.500" fontSize="sm">{item.description}</Text>
                  <List spacing={2}>
                    {item.capabilities.map((cap) => (
                      <ListItem key={cap} fontSize="sm" color="gray.600">
                        <ListIcon as={FiCheck} color={item.highlight ? 'brand.500' : 'gray.400'} />
                        {cap}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Box bg="brand.50" p={6} borderRadius="xl" mt={8} textAlign="center">
          <Text color="gray.700" fontSize="md" fontWeight="500">
            <Text as="span" fontWeight="700" color="brand.600">{t('comparison.calloutBold')}</Text>{' '}
            {t('comparison.calloutText')}
          </Text>
        </Box>
      </SectionWrapper>

      {/* How Agents Work */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('howAgentsWork.heading')}
          </Heading>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
          {[
            { icon: FiEdit3, title: t('howAgentsWork.items.0.title'), description: t('howAgentsWork.items.0.description'), color: 'brand.500' },
            { icon: FiTool, title: t('howAgentsWork.items.1.title'), description: t('howAgentsWork.items.1.description'), color: 'orange.500' },
            { icon: FiMessageCircle, title: t('howAgentsWork.items.2.title'), description: t('howAgentsWork.items.2.description'), color: 'whatsapp.500' },
            { icon: FiCpu, title: t('howAgentsWork.items.3.title'), description: t('howAgentsWork.items.3.description'), color: 'blue.500' },
          ].map((item, i) => (
            <MotionBox
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.100" h="full">
                <VStack align="flex-start" spacing={3}>
                  <Icon as={item.icon} boxSize={6} color={item.color} />
                  <Heading as="h3" size="sm" fontWeight="700">{item.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">{item.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Agent Marketplace */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('marketplace.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px">
            {t('marketplace.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {agentTemplates.map((template, i) => (
            <MotionBox
              key={template.name}
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
                _hover={{ borderColor: 'brand.200', boxShadow: 'md' }}
                transition="all 0.2s"
                h="full"
              >
                <VStack align="flex-start" spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Heading as="h3" size="sm" fontWeight="700">{template.name}</Heading>
                    <Badge colorScheme="brand" fontSize="2xs">{template.category}</Badge>
                  </HStack>
                  <Text color="gray.500" fontSize="sm">{template.description}</Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {template.tools.map((tool) => (
                      <Badge key={tool} variant="outline" fontSize="2xs" colorScheme="gray">
                        {tool}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* AI Processing Powers */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('aiCapabilities.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px">
            {t('aiCapabilities.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
          {aiCapabilities.map((cap, i) => (
            <MotionBox
              key={cap.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Box
                bg="white"
                p={5}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: 'brand.200', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                textAlign="center"
              >
                <VStack spacing={3}>
                  <Icon as={cap.icon} boxSize={6} color="brand.500" />
                  <Text fontWeight="600" fontSize="sm">{cap.label}</Text>
                  <Text color="gray.400" fontSize="xs">{cap.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* Real-World Example */}
      <SectionWrapper>
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('realWorldExample.heading')}
          </Heading>
        </VStack>

        <Flex justify="center" overflow="auto" pb={4}>
          <HStack spacing={3} px={4}>
            {[
              { action: t('realWorldExample.steps.0'), color: 'green.500', icon: FiMessageCircle },
              { action: t('realWorldExample.steps.1'), color: 'purple.500', icon: FiMic },
              { action: t('realWorldExample.steps.2'), color: 'orange.500', icon: FiSmile },
              { action: t('realWorldExample.steps.3'), color: 'brand.500', icon: FiCpu },
              { action: t('realWorldExample.steps.4'), color: 'blue.500', icon: FiUsers },
              { action: t('realWorldExample.steps.5'), color: 'whatsapp.500', icon: FiMessageCircle },
            ].map((step, i) => (
              <MotionBox
                key={step.action}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <HStack spacing={3}>
                  <VStack
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    minW="130px"
                    spacing={2}
                  >
                    <Icon as={step.icon} boxSize={5} color={step.color} />
                    <Text fontSize="xs" fontWeight="600" textAlign="center">{step.action}</Text>
                  </VStack>
                  {i < 5 && <Icon as={FiArrowRight} color="gray.300" />}
                </HStack>
              </MotionBox>
            ))}
          </HStack>
        </Flex>
      </SectionWrapper>

      {/* Available Tools Grid */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="purple" fontSize="xs" px={3} py={1} borderRadius="full">
            {t('toolsGrid.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('toolsGrid.heading')}
          </Heading>
          <Text color="gray.500" maxW="600px">
            {t('toolsGrid.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          {[
            { icon: FiSearch, title: t('toolsGrid.items.0.title'), description: t('toolsGrid.items.0.description'), color: 'orange.500' },
            { icon: FiUserPlus, title: t('toolsGrid.items.1.title'), description: t('toolsGrid.items.1.description'), color: 'orange.500' },
            { icon: FiMessageCircle, title: t('toolsGrid.items.2.title'), description: t('toolsGrid.items.2.description'), color: 'green.500' },
            { icon: FiCalendar, title: t('toolsGrid.items.3.title'), description: t('toolsGrid.items.3.description'), color: 'blue.500' },
            { icon: FiGitBranch, title: t('toolsGrid.items.4.title'), description: t('toolsGrid.items.4.description'), color: 'blue.500' },
            { icon: FiCpu, title: t('toolsGrid.items.5.title'), description: t('toolsGrid.items.5.description'), color: 'purple.500' },
            { icon: FiSettings, title: t('toolsGrid.items.6.title'), description: t('toolsGrid.items.6.description'), color: 'gray.500' },
            { icon: FiSend, title: t('toolsGrid.items.7.title'), description: t('toolsGrid.items.7.description'), color: 'cyan.500' },
            { icon: FiClipboard, title: t('toolsGrid.items.8.title'), description: t('toolsGrid.items.8.description'), color: 'pink.500' },
            { icon: FiBarChart2, title: t('toolsGrid.items.9.title'), description: t('toolsGrid.items.9.description'), color: 'teal.500' },
            { icon: FiDatabase, title: t('toolsGrid.items.10.title'), description: t('toolsGrid.items.10.description'), color: 'teal.500' },
            { icon: FiGlobe, title: t('toolsGrid.items.11.title'), description: t('toolsGrid.items.11.description'), color: 'cyan.500' },
          ].map((category, i) => (
            <MotionBox
              key={category.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Box
                bg="white" p={4} borderRadius="xl" border="1px solid" borderColor="gray.100"
                _hover={{ borderColor: category.color, transform: 'translateY(-2px)' }}
                transition="all 0.2s" h="full"
              >
                <VStack align="flex-start" spacing={2}>
                  <Icon as={category.icon} boxSize={5} color={category.color} />
                  <Text fontWeight="600" fontSize="sm">{category.title}</Text>
                  <Text color="gray.400" fontSize="xs">{category.description}</Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      <FinalCTA />
    </>
  );
}
