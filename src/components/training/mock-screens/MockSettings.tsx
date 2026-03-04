import {
  Box, Flex, Text, VStack, HStack, Switch, Select, Input,
  FormControl, FormLabel, Divider, Icon, Badge,
} from '@chakra-ui/react';
import { FiSettings, FiBell, FiShield, FiGlobe } from 'react-icons/fi';

interface Props {
  initialData?: Record<string, unknown>;
  activeStepId?: string;
}

const sections = [
  {
    icon: FiSettings,
    title: 'Geral',
    items: [
      { label: 'Nome da Empresa', type: 'input', value: 'Minha Empresa' },
      { label: 'Fuso Horario', type: 'select', options: ['America/Sao_Paulo', 'America/New_York', 'Europe/London'] },
      { label: 'Idioma', type: 'select', options: ['Portugues (BR)', 'English', 'Espanol'] },
    ],
  },
  {
    icon: FiBell,
    title: 'Notificacoes',
    items: [
      { label: 'Notificacoes por email', type: 'switch', value: true },
      { label: 'Resumo diario', type: 'switch', value: false },
      { label: 'Alertas de workflow', type: 'switch', value: true },
    ],
  },
  {
    icon: FiShield,
    title: 'Seguranca',
    items: [
      { label: 'Autenticacao 2FA', type: 'switch', value: false },
      { label: 'Sessao ativa', type: 'badge', value: '2h 15min' },
    ],
  },
  {
    icon: FiGlobe,
    title: 'Integracoes',
    items: [
      { label: 'WhatsApp', type: 'badge', value: 'Conectado', color: 'green' },
      { label: 'Webhook URL', type: 'input', value: 'https://api.exemplo.com/webhook' },
    ],
  },
];

export function MockSettings({ activeStepId }: Props) {
  return (
    <Box p={4} bg="gray.50" minH="300px">
      <Text fontSize="md" fontWeight="700" color="gray.800" mb={4}>Configuracoes</Text>

      <VStack spacing={3} align="stretch">
        {sections.map((section, i) => (
          <Box
            key={i}
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
            p={4}
            id={`settings-${section.title.toLowerCase()}`}
            boxShadow={activeStepId === `settings-${section.title.toLowerCase()}` ? '0 0 0 3px rgba(115,75,156,0.4)' : undefined}
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
