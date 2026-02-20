import { Box, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { FiEdit3, FiCpu, FiCheckCircle, FiPlay } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';

const stepIcons = [FiEdit3, FiCpu, FiCheckCircle, FiPlay];
const stepColors = ['brand.400', 'blue.400', 'green.400', 'whatsapp.400'];
const stepDelays = [0.3, 1.2, 2.1, 3.0];

interface StudioStep {
  label: string;
  detail: string;
}

export function StudioBuilderPreview() {
  const { t } = useTranslation('home');
  const steps = t('studioPreview.steps', { returnObjects: true }) as StudioStep[];

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
      {/* Header */}
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
          bgGradient="linear(to-br, brand.500, brand.400)"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Text fontSize="md">&#10022;</Text>
        </Flex>
        <Box flex={1}>
          <Text color="white" fontSize="sm" fontWeight="600">{t('studioPreview.title')}</Text>
          <HStack spacing={1.5}>
            <Box w={1.5} h={1.5} borderRadius="full" bg="brand.300" />
            <Text color="brand.300" fontSize="xs">{t('studioPreview.builderActive')}</Text>
          </HStack>
        </Box>
        <Box bg="whiteAlpha.100" px={2} py={0.5} borderRadius="full">
          <Text color="whiteAlpha.600" fontSize="2xs" fontWeight="600">{t('studioPreview.aiBadge')}</Text>
        </Box>
      </Flex>

      {/* Steps flow */}
      <VStack spacing={0} align="stretch" px={4} py={3} minH="220px">
        <Text color="whiteAlpha.400" fontSize="2xs" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={3}>
          {t('studioPreview.pipelineHeader')}
        </Text>

        {steps.map((step, i) => {
          const icon = stepIcons[i];
          const color = stepColors[i];
          const delay = stepDelays[i];

          return (
            <MotionBox
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay, duration: 0.4 }}
            >
              <HStack spacing={3} py={2} borderBottom="1px solid" borderColor="whiteAlpha.50">
                {/* Step icon with animated appear */}
                <MotionBox
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.15, duration: 0.25, type: 'spring', stiffness: 300 }}
                >
                  <Flex
                    w={7}
                    h={7}
                    borderRadius="lg"
                    bg={`${color.split('.')[0]}.900`}
                    border="1px solid"
                    borderColor={color}
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Box as={icon} color={color} boxSize="14px" />
                  </Flex>
                </MotionBox>

                <Box flex={1}>
                  <Text color="white" fontSize="xs" fontWeight="600">{step.label}</Text>
                  <Text color="whiteAlpha.500" fontSize="2xs">{step.detail}</Text>
                </Box>

                {/* Progress indicator */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.3, duration: 0.3 }}
                >
                  <Box
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg={color}
                  />
                </MotionBox>
              </HStack>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <MotionBox
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: delay + 0.4, duration: 0.3 }}
                  transformOrigin="top"
                >
                  <Box w="1px" h="8px" bg="whiteAlpha.100" ml="14px" />
                </MotionBox>
              )}
            </MotionBox>
          );
        })}

        {/* Typing / processing indicator */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 0.4 }}
          mt={3}
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
              {t('studioPreview.typing')}
            </Text>
          </HStack>
        </MotionBox>
      </VStack>

      {/* Stats footer */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
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
            <Text color="white" fontSize="sm" fontWeight="700">0</Text>
            <Text color="whiteAlpha.400" fontSize="2xs">{t('studioPreview.stats.codeLines')}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text color="brand.300" fontSize="sm" fontWeight="700">4</Text>
            <Text color="whiteAlpha.400" fontSize="2xs">{t('studioPreview.stats.steps')}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text color="whatsapp.400" fontSize="sm" fontWeight="700">&lt;2min</Text>
            <Text color="whiteAlpha.400" fontSize="2xs">{t('studioPreview.stats.totalTime')}</Text>
          </VStack>
        </Flex>
      </MotionBox>
    </Box>
  );
}
