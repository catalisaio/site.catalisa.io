import {
  Box, Flex, Text, VStack, HStack, Switch, Select, Input,
  FormControl, FormLabel, Divider, Icon, Badge,
} from '@chakra-ui/react';
import { FiSettings, FiBell, FiShield, FiGlobe, FiUser, FiSmartphone } from 'react-icons/fi';
import { hp, type MockScreenProps } from './highlightUtils';

const sections = [
  {
    id: 'settings-profile',
    icon: FiUser,
    title: 'Perfil',
    items: [
      { label: 'Nome', type: 'input', value: 'Admin' },
      { label: 'Email', type: 'input', value: 'admin@empresa.com' },
    ],
  },
  {
    id: 'settings-devices',
    icon: FiSmartphone,
    title: 'Dispositivos',
    items: [
      { label: 'WhatsApp Principal', type: 'badge', value: 'Conectado', color: 'green' },
      { label: 'WhatsApp Suporte', type: 'badge', value: 'Desconectado', color: 'red' },
    ],
  },
  {
    id: 'settings-geral',
    icon: FiSettings,
    title: 'Geral',
    items: [
      { label: 'Nome da Empresa', type: 'input', value: 'Minha Empresa' },
      { label: 'Fuso Horario', type: 'select', options: ['America/Sao_Paulo', 'America/New_York', 'Europe/London'] },
      { label: 'Idioma', type: 'select', options: ['Portugues (BR)', 'English', 'Espanol'] },
    ],
  },
  {
    id: 'settings-notificacoes',
    icon: FiBell,
    title: 'Notificacoes',
    items: [
      { label: 'Notificacoes por email', type: 'switch', value: true },
      { label: 'Resumo diario', type: 'switch', value: false },
      { label: 'Alertas de workflow', type: 'switch', value: true },
    ],
  },
  {
    id: 'settings-seguranca',
    icon: FiShield,
    title: 'Seguranca',
    items: [
      { label: 'Autenticacao 2FA', type: 'switch', value: false },
      { label: 'Sessao ativa', type: 'badge', value: '2h 15min' },
    ],
  },
  {
    id: 'settings-integracoes',
    icon: FiGlobe,
    title: 'Integracoes',
    items: [
      { label: 'WhatsApp', type: 'badge', value: 'Conectado', color: 'green' },
      { label: 'Webhook URL', type: 'input', value: 'https://api.exemplo.com/webhook' },
    ],
  },
];

export function MockSettings({ activeStepId, onStepAction }: MockScreenProps) {
  return (
    <Box p={4} bg="gray.50" minH="300px">
      <Text fontSize="md" fontWeight="700" color="gray.800" mb={4}>Configuracoes</Text>

      <VStack spacing={3} align="stretch">
        {sections.map((section) => (
          <Box
            key={section.id}
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            p={4}
            {...hp(activeStepId, section.id, onStepAction)}
          >
            <HStack spacing={2} mb={3}>
              <Icon as={section.icon} color="purple.500" boxSize={4} />
              <Text fontSize="sm" fontWeight="700" color="gray.800">{section.title}</Text>
            </HStack>
            <VStack spacing={2} align="stretch" divider={<Divider />}>
              {section.items.map((item, j) => (
                <Flex key={j} justify="space-between" align="center" py={1}>
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel fontSize="xs" color="gray.600" mb={0}>{item.label}</FormLabel>
                    {item.type === 'switch' && <Switch size="sm" colorScheme="purple" defaultChecked={item.value as boolean} />}
                    {item.type === 'input' && <Input size="xs" w="180px" defaultValue={item.value as string} />}
                    {item.type === 'select' && (
                      <Select size="xs" w="180px" defaultValue={(item as { options: string[] }).options[0]}>
                        {(item as { options: string[] }).options.map(opt => <option key={opt}>{opt}</option>)}
                      </Select>
                    )}
                    {item.type === 'badge' && (
                      <Badge colorScheme={(item as { color?: string }).color || 'gray'} fontSize="xs">
                        {item.value as string}
                      </Badge>
                    )}
                  </FormControl>
                </Flex>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
