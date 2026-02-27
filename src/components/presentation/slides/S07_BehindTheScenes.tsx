import { Heading, Text, VStack, Box, HStack, Flex, Icon } from '@chakra-ui/react';
import { FiCheck, FiZap, FiEye, FiCpu } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const modelIcons = [FiZap, FiEye, FiCpu];
const modelColors = ['whatsapp.400', 'catalisa.secondary', 'brand.400'];

export function S07_BehindTheScenes() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const steps = t('behindTheScenes.steps', { returnObjects: true }) as Array<{ label: string; detail: string }>;
  const models = t('behindTheScenes.models', { returnObjects: true }) as Array<{ label: string; time: string; desc: string }>;
  const chatMessages = t('behindTheScenes.chatMessages', { returnObjects: true }) as Array<{ from: string; text: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 5, md: 8 }} w="full">
        <VStack spacing={3} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.2">
              {t('behindTheScenes.headline')}{' '}
              <Text as="span" color="brand.400">{t('behindTheScenes.headlineHighlight')}</Text>
            </Heading>
          </MotionBox>
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }} maxW="700px">
              {t('behindTheScenes.subtitle')}
            </Text>
          </MotionBox>
        </VStack>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 6 }}
          w="full"
          align="stretch"
        >
          {/* Left: Chat preview */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            flex={1}
          >
            <Box
              bg={c.surfaceBg}
              p={{ base: 4, md: 5 }}
              borderRadius="xl"
              border="1px solid"
              borderColor={c.surfaceBorder}
              h="full"
            >
              <HStack mb={3} spacing={2}>
                <Box w={2.5} h={2.5} borderRadius="full" bg="whatsapp.400" />
                <Text fontSize="xs" fontWeight="700" color="whatsapp.400" letterSpacing="0.05em">
                  WHATSAPP
                </Text>
              </HStack>
              <VStack spacing={3} align="stretch">
                {chatMessages.map((msg, i) => (
                  <Box
                    key={i}
                    bg={msg.from === 'client' ? c.iconContainerBg : 'rgba(37,211,102,0.1)'}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    alignSelf={msg.from === 'client' ? 'flex-end' : 'flex-start'}
                    maxW="85%"
                  >
                    <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textSecondary}>
                      {msg.text}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </MotionBox>

          {/* Right: Timeline steps */}
          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            flex={1}
          >
            <Box
              bg={c.surfaceBg}
              p={{ base: 4, md: 5 }}
              borderRadius="xl"
              border="1px solid"
              borderColor={c.surfaceBorder}
              h="full"
            >
              <VStack spacing={2} align="stretch">
                {steps.map((step, i) => (
                  <HStack key={i} spacing={3}>
                    <Box
                      w={5}
                      h={5}
                      borderRadius="full"
                      bg="brand.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Icon as={FiCheck} boxSize={3} color="white" />
                    </Box>
                    <Box flex={1}>
                      <HStack justify="space-between">
                        <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600">{step.label}</Text>
                        <Text fontSize="xs" color={c.textSubtle}>{step.detail}</Text>
                      </HStack>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>
        </Flex>

        {/* Model cards */}
        <HStack spacing={{ base: 3, md: 5 }} w="full" justify="center" flexWrap="wrap">
          {models.map((model, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            >
              <HStack
                bg={c.surfaceBg}
                px={{ base: 3, md: 4 }}
                py={2}
                borderRadius="lg"
                border="1px solid"
                borderColor={c.surfaceBorder}
                spacing={2}
              >
                <Icon as={modelIcons[i]} boxSize={4} color={modelColors[i]} />
                <VStack spacing={0} align="flex-start">
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="700">{model.label}</Text>
                    <Text fontSize="xs" color={modelColors[i]} fontWeight="600">{model.time}</Text>
                  </HStack>
                  <Text fontSize="xs" color={c.textMuted}>{model.desc}</Text>
                </VStack>
              </HStack>
            </MotionBox>
          ))}
        </HStack>
      </VStack>
    </Slide>
  );
}
