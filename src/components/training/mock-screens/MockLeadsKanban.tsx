import { Box, Flex, Text, Badge, Avatar, HStack, VStack, Icon, Button } from '@chakra-ui/react';
import { FiMessageSquare, FiPhone, FiList, FiPlus } from 'react-icons/fi';
import { MotionBox } from '../../motion';
import { hp, type MockScreenProps } from './highlightUtils';

const columns = [
  {
    name: 'Novo', color: 'blue', leads: [
      { name: 'Pedro Lima', phone: '+55 11 98765-4321', messages: 3 },
      { name: 'Camila Souza', phone: '+55 21 97654-3210', messages: 1 },
    ],
  },
  {
    name: 'Qualificado', color: 'purple', leads: [
      { name: 'Roberto Alves', phone: '+55 31 96543-2109', messages: 7 },
    ],
  },
  {
    name: 'Em Negociacao', color: 'orange', leads: [
      { name: 'Fernanda Dias', phone: '+55 41 95432-1098', messages: 12 },
      { name: 'Marcos Reis', phone: '+55 51 94321-0987', messages: 5 },
    ],
  },
  {
    name: 'Fechado', color: 'green', leads: [
      { name: 'Julia Martins', phone: '+55 61 93210-9876', messages: 20 },
    ],
  },
];

export function MockLeadsKanban({ activeStepId, onStepAction }: MockScreenProps) {
  return (
    <Box p={4} bg="gray.50" minH="300px" overflowX="auto">
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={2}>
          <Text fontSize="md" fontWeight="700" color="gray.800">Leads - Kanban</Text>
          <Badge colorScheme="purple" fontSize="xs">6 leads</Badge>
        </HStack>
        <HStack spacing={1}>
          <Button size="xs" leftIcon={<FiList />} variant="outline" {...hp(activeStepId, 'btn-view-toggle', onStepAction)}>
            Tabela
          </Button>
          <Button size="xs" leftIcon={<FiPlus />} variant="outline" {...hp(activeStepId, 'btn-add-column', onStepAction)}>
            Coluna
          </Button>
        </HStack>
      </Flex>

      <Flex gap={3} minW="800px">
        {columns.map((col) => (
          <Box
            key={col.name}
            flex={1}
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            {...hp(activeStepId, `kanban-${col.name.toLowerCase().replace(/\s/g, '-')}`, onStepAction)}
          >
            <Flex align="center" gap={2} p={3} borderBottom="1px solid" borderColor="gray.100">
              <Box w="8px" h="8px" borderRadius="full" bg={`${col.color}.400`} />
              <Text fontSize="xs" fontWeight="600" color="gray.700">{col.name}</Text>
              <Badge size="sm" colorScheme={col.color} borderRadius="full" ml="auto">
                {col.leads.length}
              </Badge>
            </Flex>

            <VStack spacing={2} p={2} align="stretch">
              {col.leads.map((lead, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.100"
                  cursor="grab"
                  _hover={{ bg: 'purple.50', borderColor: 'purple.200' }}
                  {...(i === 0 && col.name === 'Novo' ? hp(activeStepId, 'kanban-card-drag', onStepAction) : {})}
                >
                  <HStack spacing={2} mb={1}>
                    <Avatar size="2xs" name={lead.name} bg={`${col.color}.100`} color={`${col.color}.600`} />
                    <Text fontSize="xs" fontWeight="600" color="gray.800">{lead.name}</Text>
                  </HStack>
                  <HStack spacing={3} mt={1}>
                    <HStack spacing={1}>
                      <Icon as={FiPhone} boxSize={2.5} color="gray.400" />
                      <Text fontSize="2xs" color="gray.500">{lead.phone}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FiMessageSquare} boxSize={2.5} color="gray.400" />
                      <Text fontSize="2xs" color="gray.500">{lead.messages}</Text>
                    </HStack>
                  </HStack>
                </MotionBox>
              ))}
            </VStack>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
