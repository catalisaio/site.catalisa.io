import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiMessageCircle, FiCpu, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { MotionBox, staggerContainer, staggerItem } from '../../motion';

interface TimelineEvent {
  title: string;
  detail: string;
}

interface AnatomyStep {
  chat: { text: string; sent: boolean };
  timeline: TimelineEvent[];
}

export function AnatomySection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const steps = t('anatomy.steps', { returnObjects: true }) as AnatomyStep[];

  return (
    <SectionWrapper bg="gray.50" id="anatomy">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="white"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="gray.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('anatomy.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('anatomy.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('anatomy.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
          {t('anatomy.subtitle')}
        </Text>

        {/* Multi-model note */}
        <Box
          mt={2}
          px={5}
          py={3}
          borderRadius="xl"
          bg="brand.50"
          border="1px solid"
          borderColor="brand.200"
          maxW="600px"
        >
          <Text fontSize="xs" color="brand.700" fontWeight="500">
            {t('anatomy.multiModelNote')}
          </Text>
        </Box>
      </VStack>

      <MotionBox {...staggerContainer}>
        <VStack spacing={0} maxW="900px" mx="auto" position="relative">
          {/* Vertical connector line */}
          <Box
            position="absolute"
            left={{ base: '20px', md: '50%' }}
            top="0"
            bottom="0"
            w="2px"
            bg="gray.200"
            transform={{ md: 'translateX(-1px)' }}
          />

          {steps.map((step, i) => (
            <MotionBox key={i} {...staggerItem} w="full">
              <Flex
                direction={{ base: 'column', md: i % 2 === 0 ? 'row' : 'row-reverse' }}
                gap={4}
                align="flex-start"
                py={4}
                position="relative"
              >
                {/* Step indicator */}
                <Box
                  position={{ md: 'absolute' }}
                  left={{ base: '12px', md: '50%' }}
                  transform={{ md: 'translateX(-50%)' }}
                  w="18px"
                  h="18px"
                  borderRadius="full"
                  bg="brand.500"
                  border="3px solid"
                  borderColor="white"
                  boxShadow="0 0 0 2px var(--chakra-colors-brand-200)"
                  zIndex={1}
                  flexShrink={0}
                />

                {/* Chat bubble */}
                <Box
                  flex={1}
                  ml={{ base: '40px', md: i % 2 === 0 ? 0 : 8 }}
                  mr={{ md: i % 2 === 0 ? 8 : 0 }}
                >
                  <Box
                    p={4}
                    borderRadius="xl"
                    bg={step.chat.sent ? 'whatsapp.500' : 'white'}
                    color={step.chat.sent ? 'white' : 'gray.800'}
                    border={step.chat.sent ? 'none' : '1px solid'}
                    borderColor="gray.200"
                    maxW="350px"
                    ml={step.chat.sent ? 'auto' : 0}
                    mr={step.chat.sent ? 0 : 'auto'}
                  >
                    <HStack spacing={2} mb={1}>
                      <Icon
                        as={step.chat.sent ? FiCpu : FiMessageCircle}
                        boxSize={3}
                        opacity={0.7}
                      />
                      <Text fontSize="2xs" opacity={0.7}>
                        {step.chat.sent ? 'Agente IA' : 'Cliente'}
                      </Text>
                    </HStack>
                    <Text fontSize="sm">{step.chat.text}</Text>
                  </Box>
                </Box>

                {/* Timeline events */}
                <Box
                  flex={1}
                  ml={{ base: '40px', md: i % 2 === 0 ? 8 : 0 }}
                  mr={{ md: i % 2 === 0 ? 0 : 8 }}
                >
                  <VStack align="stretch" spacing={2}>
                    {step.timeline.map((event, j) => (
                      <HStack
                        key={j}
                        p={3}
                        borderRadius="lg"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        spacing={3}
                      >
                        <Icon as={FiCheck} boxSize={4} color="brand.500" />
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="xs" fontWeight="600" color="gray.700">
                            {event.title}
                          </Text>
                          <Text fontSize="2xs" color="gray.400">
                            {event.detail}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </Flex>
            </MotionBox>
          ))}
        </VStack>
      </MotionBox>
    </SectionWrapper>
  );
}
