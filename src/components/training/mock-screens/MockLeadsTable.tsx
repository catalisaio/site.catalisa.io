import { useState } from 'react';
import {
  Box, Flex, Text, Input, Table, Thead, Tbody, Tr, Th, Td,
  Badge, IconButton, HStack, Avatar, InputGroup, InputLeftElement, Icon,
  Menu, MenuButton, MenuList, MenuItem, Button, Checkbox,
} from '@chakra-ui/react';
import { FiSearch, FiMoreVertical, FiFilter, FiPlus, FiDownload } from 'react-icons/fi';
import { hp, type MockScreenProps } from './highlightUtils';

const mockLeads = [
  { id: 1, name: 'Maria Silva', phone: '+55 11 98765-4321', type: 'Cliente', status: 'Novo', date: '04/03/2026' },
  { id: 2, name: 'Joao Santos', phone: '+55 21 97654-3210', type: 'Parceiro', status: 'Qualificado', date: '03/03/2026' },
  { id: 3, name: 'Ana Costa', phone: '+55 31 96543-2109', type: 'Cliente', status: 'Em Negociacao', date: '02/03/2026' },
  { id: 4, name: 'Carlos Oliveira', phone: '+55 41 95432-1098', type: 'Lead', status: 'Novo', date: '01/03/2026' },
  { id: 5, name: 'Lucia Pereira', phone: '+55 51 94321-0987', type: 'Cliente', status: 'Fechado', date: '28/02/2026' },
];

const statusColors: Record<string, string> = {
  Novo: 'blue', Qualificado: 'purple', 'Em Negociacao': 'orange', Fechado: 'green',
};

export function MockLeadsTable({ activeStepId, onStepAction }: MockScreenProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = mockLeads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search),
  );

  return (
    <Box p={4} bg="gray.50" minH="300px">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="md" fontWeight="700" color="gray.800">Leads</Text>
        <HStack>
          <Button
            size="xs"
            leftIcon={<FiPlus />}
            colorScheme="purple"
            {...hp(activeStepId, 'btn-add-lead', onStepAction)}
          >
            Novo Lead
          </Button>
          <IconButton aria-label="Exportar" icon={<FiDownload />} size="xs" variant="outline" />
        </HStack>
      </Flex>

      {/* Search + Filter */}
      <Flex gap={2} mb={3}>
        <InputGroup size="sm" flex={1}>
          <InputLeftElement><Icon as={FiSearch} color="gray.400" boxSize={3} /></InputLeftElement>
          <Input
            placeholder="Buscar leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            bg="white"
            borderRadius="md"
            {...hp(activeStepId, 'search-leads', onStepAction)}
          />
        </InputGroup>
        <Button size="sm" leftIcon={<FiFilter />} variant="outline" {...hp(activeStepId, 'btn-filter', onStepAction)}>
          Filtros
        </Button>
      </Flex>

      {/* Table */}
      <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden">
        <Table size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th w="32px" py={2}><Checkbox size="sm" /></Th>
              <Th py={2} fontSize="2xs" {...hp(activeStepId, 'column-name', onStepAction)}>Nome</Th>
              <Th py={2} fontSize="2xs">Telefone</Th>
              <Th py={2} fontSize="2xs" {...hp(activeStepId, 'column-type', onStepAction)}>Tipo</Th>
              <Th py={2} fontSize="2xs" {...hp(activeStepId, 'column-status', onStepAction)}>Status</Th>
              <Th py={2} fontSize="2xs">Data</Th>
              <Th py={2} w="40px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((lead, idx) => (
              <Tr
                key={lead.id}
                _hover={{ bg: 'gray.50' }}
                cursor="pointer"
                bg={selected.includes(lead.id) ? 'purple.50' : undefined}
                {...(idx === 0 ? hp(activeStepId, 'lead-row-1', onStepAction) : {})}
                onClick={() => {
                  if (activeStepId === 'lead-row-1' && idx === 0) {
                    onStepAction?.();
                    return;
                  }
                  setSelected(prev =>
                    prev.includes(lead.id) ? prev.filter(id => id !== lead.id) : [...prev, lead.id],
                  );
                }}
              >
                <Td py={2}><Checkbox size="sm" isChecked={selected.includes(lead.id)} /></Td>
                <Td py={2}>
                  <HStack spacing={2}>
                    <Avatar size="xs" name={lead.name} bg="purple.100" color="purple.600" />
                    <Text fontSize="xs" fontWeight="500">{lead.name}</Text>
                  </HStack>
                </Td>
                <Td py={2}><Text fontSize="xs" color="gray.600">{lead.phone}</Text></Td>
                <Td py={2}><Text fontSize="xs" color="gray.600">{lead.type}</Text></Td>
                <Td py={2}>
                  <Badge
                    colorScheme={statusColors[lead.status] || 'gray'}
                    fontSize="2xs"
                    borderRadius="full"
                    px={2}
                  >
                    {lead.status}
                  </Badge>
                </Td>
                <Td py={2}><Text fontSize="xs" color="gray.500">{lead.date}</Text></Td>
                <Td py={2}>
                  <Menu>
                    <MenuButton as={IconButton} icon={<FiMoreVertical />} size="xs" variant="ghost" />
                    <MenuList minW="120px">
                      <MenuItem fontSize="xs">Editar</MenuItem>
                      <MenuItem fontSize="xs">Enviar mensagem</MenuItem>
                      <MenuItem fontSize="xs" color="red.500">Excluir</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
