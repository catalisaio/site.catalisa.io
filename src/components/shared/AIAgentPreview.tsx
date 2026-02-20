import { Box, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { FiCheck, FiCpu } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';

interface AgentAction {
  label: string;
  delay: number;
}

export function AIAgentPreview() {
  const { t } = useTranslation('home');
  const actions = t('agentPreview.actions', { returnObjects: true }) as AgentAction[];

  return (
    <Box
      maxW="360px"
      w="full"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="2xl"
      bg="#0B141A"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      {/* Agent header */}
      <Flex
        bg="#1F2C34"
        px={4}
        py={3}
        align="center"
        gap={3}
      >
        <Flex
          w={9}
          h={9}
          borderRadius="full"
          bg="brand.500"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Box as={FiCpu} color="white" boxSize="16px" />
        </Flex>
        <Box flex={1}>
          <Text color="white" fontSize="sm" fontWeight="600">{t('agentPreview.title')}</Text>
          <HStack spacing={1.5}>
            <Box w={1.5} h={1.5} borderRadius="full" bg="whatsapp.400" />
            <Text color="whatsapp.400" fontSize="xs">{t('agentPreview.online')}</Text>
          </HStack>
        </Box>
        <Box
          bg="whiteAlpha.100"
          px={2}
          py={0.5}
          borderRadius="full"
        >
          <Text color="whiteAlpha.600" fontSize="2xs" fontWeight="600">{t('agentPreview.autoBadge')}</Text>
        </Box>
      </Flex>

      {/* Recent actions */}
      <VStack spacing={0} align="stretch" px={4} py={3} minH="220px">
        <Text color="whiteAlpha.400" fontSize="2xs" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={2}>
          {t('agentPreview.recentActionsHeader')}
        </Text>
        {actions.map((action, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: action.delay, duration: 0.35 }}
          >
            <HStack spacing={2.5} py={1.5} borderBottom="1px solid" borderColor="whiteAlpha.50">
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: action.delay + 0.2, duration: 0.25, type: 'spring', stiffness: 300 }}
              >
                <Flex
                  w={5}
                  h={5}
                  borderRadius="full"
                  bg="whatsapp.500"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Box as={FiCheck} color="white" boxSize="12px" strokeWidth={3} />
                </Flex>
              </MotionBox>
              <Text color="whiteAlpha.700" fontSize="xs" lineHeight="1.4">
                {action.label}
              </Text>
              <Text color="whiteAlpha.300" fontSize="2xs" ml="auto" flexShrink={0}>
                {`${Math.floor(i * 2.5 + 1)}min`}
              </Text>
            </HStack>
          </MotionBox>
        ))}

        {/* Typing indicator */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.4 }}
          mt={2}
        >
          <HStack spacing={2}>
            <HStack spacing={1}>
              {[0, 1, 2].map((dot) => (
                <MotionBox
                  key={dot}
                  w="5px"
                  h="5px"
                  borderRadius="full"
                  bg="brand.400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                />
              ))}
            </HStack>
            <Text color="whiteAlpha.400" fontSize="xs" fontStyle="italic">
              {t('agentPreview.typing')}
            </Text>
          </HStack>
        </MotionBox>
      </VStack>

      {/* Stats footer */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <Flex
          bg="whiteAlpha.50"
          px={4}
          py={2.5}
          justify="space-between"
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
        >
          <VStack spacing={0}>
            <Text color="white" fontSize="sm" fontWeight="700">47</Text>
            <Text color="whiteAlpha.400" fontSize="2xs">{t('agentPreview.stats.conversations')}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text color="whatsapp.400" fontSize="sm" fontWeight="700">94%</Text>
            <Text color="whiteAlpha.400" fontSize="2xs">{t('agentPreview.stats.satisfaction')}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text color="brand.300" fontSize="sm" fontWeight="700">12s</Text>
            <Text color="whiteAlpha.400" fontSize="2xs">{t('agentPreview.stats.avgTime')}</Text>
          </VStack>
        </Flex>
      </MotionBox>
    </Box>
  );
}
