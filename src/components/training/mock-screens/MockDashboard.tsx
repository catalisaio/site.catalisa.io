import { Box, Flex, Text, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Icon, HStack, VStack } from '@chakra-ui/react';
import { FiUsers, FiMessageSquare, FiTrendingUp, FiCpu, FiGrid, FiGitBranch, FiSettings } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import { hp, type MockScreenProps } from './highlightUtils';

const stats = [
  { id: 'stat-leads', label: 'Leads Ativos', value: '247', change: 12, icon: FiUsers, color: 'purple' },
  { id: 'stat-messages', label: 'Mensagens Hoje', value: '1.832', change: 23, icon: FiMessageSquare, color: 'blue' },
  { id: 'stat-conversion', label: 'Taxa Conversao', value: '34%', change: 5, icon: FiTrendingUp, color: 'green' },
  { id: 'stat-agents', label: 'Agentes Ativos', value: '4', change: 0, icon: FiCpu, color: 'orange' },
];

const navItems = [
  { id: 'nav-leads', label: 'Leads', icon: FiUsers },
  { id: 'nav-workflows', label: 'Workflows', icon: FiGitBranch },
  { id: 'nav-agents', label: 'Agentes IA', icon: FiCpu },
  { id: 'nav-settings', label: 'Configuracoes', icon: FiSettings },
];

const recentActivity = [
  { text: 'Lead Maria Silva qualificado', time: '2 min atras', color: 'green' },
  { text: 'Workflow "Follow-up" executado', time: '5 min atras', color: 'purple' },
  { text: 'Agente respondeu Joao Santos', time: '8 min atras', color: 'blue' },
  { text: '3 novas mensagens recebidas', time: '12 min atras', color: 'orange' },
];

export function MockDashboard({ activeStepId, onStepAction }: MockScreenProps) {
  return (
    <Flex bg="gray.50" minH="300px">
      {/* Sidebar */}
      <VStack
        w="140px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        py={3}
        px={2}
        spacing={1}
        align="stretch"
        flexShrink={0}
      >
        <Flex align="center" gap={1} px={2} mb={2}>
          <Icon as={FiGrid} color="purple.500" boxSize={3} />
          <Text fontSize="2xs" fontWeight="700" color="purple.600">Catalisa</Text>
        </Flex>
        {navItems.map(item => (
          <Flex
            key={item.id}
            {...hp(activeStepId, item.id, onStepAction)}
            align="center"
            gap={2}
            px={2}
            py={1.5}
            borderRadius="md"
            fontSize="2xs"
            color="gray.600"
            _hover={{ bg: 'purple.50', color: 'purple.600' }}
          >
            <Icon as={item.icon} boxSize={3} />
            <Text>{item.label}</Text>
          </Flex>
        ))}
      </VStack>

      {/* Main Content */}
      <Box flex={1} p={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="md" fontWeight="700" color="gray.800">Dashboard</Text>
          <Text fontSize="xs" color="gray.500">Atualizado agora</Text>
        </Flex>

        {/* KPI Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={4}>
          {stats.map((stat, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              p={3}
              {...hp(activeStepId, stat.id, onStepAction)}
            >
              <Stat size="sm">
                <Flex justify="space-between" align="flex-start">
                  <Box>
                    <StatLabel fontSize="2xs" color="gray.500">{stat.label}</StatLabel>
                    <StatNumber fontSize="lg" fontWeight="700" color="gray.800">{stat.value}</StatNumber>
                  </Box>
                  <Icon as={stat.icon} color={`${stat.color}.400`} boxSize={4} />
                </Flex>
                {stat.change > 0 && (
                  <StatHelpText fontSize="2xs" mb={0}>
                    <StatArrow type="increase" />
                    {stat.change}%
                  </StatHelpText>
                )}
              </Stat>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Chart + Activity */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          <Box
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            p={3}
            {...hp(activeStepId, 'chart-area', onStepAction)}
          >
            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={2}>Mensagens (7 dias)</Text>
            <svg viewBox="0 0 300 100" width="100%" style={{ display: 'block' }}>
              <polyline
                points="0,80 50,60 100,70 150,40 200,50 250,20 300,30"
                fill="none"
                stroke="#734B9C"
                strokeWidth="2"
              />
              <polyline
                points="0,80 50,60 100,70 150,40 200,50 250,20 300,30"
                fill="url(#chart-gradient)"
                stroke="none"
              />
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#734B9C" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#734B9C" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </Box>

          <Box
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            p={3}
            {...hp(activeStepId, 'activity-feed', onStepAction)}
          >
            <Text fontSize="xs" fontWeight="600" color="gray.700" mb={2}>Atividade Recente</Text>
            {recentActivity.map((item, i) => (
              <HStack key={i} spacing={2} py={1.5} borderBottom={i < recentActivity.length - 1 ? '1px solid' : undefined} borderColor="gray.50">
                <Box w="6px" h="6px" borderRadius="full" bg={`${item.color}.400`} flexShrink={0} />
                <Text fontSize="2xs" color="gray.700" flex={1}>{item.text}</Text>
                <Text fontSize="2xs" color="gray.400" flexShrink={0}>{item.time}</Text>
              </HStack>
            ))}
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
