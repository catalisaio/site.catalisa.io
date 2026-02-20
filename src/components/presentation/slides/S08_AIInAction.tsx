import { Heading, Text, VStack, HStack, Image } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { GradientText } from '../../shared/GradientText';
import { usePresentationColors } from '../PresentationThemeContext';

const screenshots = [
  '/screenshots/case/ai-assistant-plan.jpg',
  '/screenshots/case/ai-assistant-plan.jpg',
  '/screenshots/case/workflow-complete.jpg',
  '/screenshots/case/whatsapp-result.jpg',
];

export function S08_AIInAction() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const steps = t('aiInAction.steps', { returnObjects: true }) as Array<{ label: string; title: string; description: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 6, md: 8 }} w="full">
        <VStack spacing={2} textAlign="center">
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <Text fontSize="xs" color="brand.400" fontWeight="700" letterSpacing="0.15em">
              {t('aiInAction.badge')}
            </Text>
          </MotionBox>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Heading fontSize={{ base: 'xl', md: '3xl', lg: '4xl' }} fontWeight="800">
              {t('aiInAction.headline')}{' '}
              <GradientText>{t('aiInAction.headlineHighlight')}</GradientText>
            </Heading>
          </MotionBox>
        </VStack>

        {/* Timeline */}
        <HStack
          spacing={{ base: 2, md: 4 }}
          w="full"
          align="stretch"
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          {steps.map((step, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
              flex={{ base: '1 1 45%', lg: 1 }}
            >
              <VStack
                bg={c.surfaceBg}
                p={{ base: 3, md: 4 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                spacing={2}
                h="full"
                align="stretch"
              >
                <Text fontSize="xs" color="brand.400" fontWeight="700" letterSpacing="0.1em">
                  {step.label}
                </Text>
                <Image
                  src={screenshots[i]}
                  borderRadius="md"
                  h={{ base: '80px', md: '100px' }}
                  objectFit="cover"
                  opacity={0.85}
                />
                <Text fontWeight="700" fontSize={{ base: 'xs', md: 'sm' }} lineHeight="1.4">
                  {step.title}
                </Text>
                <Text color={c.textSubtle} fontSize="xs">
                  {step.description}
                </Text>
              </VStack>
            </MotionBox>
          ))}
        </HStack>
      </VStack>
    </Slide>
  );
}
