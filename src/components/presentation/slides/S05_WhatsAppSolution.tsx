import { Heading, Text, VStack, HStack, Box, Icon } from '@chakra-ui/react';
import { FiMessageCircle, FiGitBranch, FiCpu, FiBarChart2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const stepIcons = [FiMessageCircle, FiGitBranch, FiCpu, FiBarChart2];
const stepColors = ['whatsapp.400', 'brand.400', 'catalisa.secondary', 'catalisa.info'];

export function S05_WhatsAppSolution() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const steps = t('whatsappSolution.steps', { returnObjects: true }) as Array<{ label: string; title: string; description: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 12 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('whatsappSolution.headline')}
          </Heading>
        </MotionBox>

        <HStack
          spacing={{ base: 4, md: 6 }}
          w="full"
          justify="center"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
        >
          {steps.map((step, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              flex={{ base: '1 1 45%', md: 1 }}
            >
              <VStack
                bg={c.surfaceBg}
                p={{ base: 5, md: 6 }}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                spacing={3}
                textAlign="center"
                h="full"
              >
                <Box
                  p={3}
                  borderRadius="full"
                  bg={c.iconContainerBg}
                >
                  <Icon as={stepIcons[i]} boxSize={{ base: 6, md: 8 }} color={stepColors[i]} />
                </Box>
                <Text fontSize="xs" color={stepColors[i]} fontWeight="700" letterSpacing="0.1em" textTransform="uppercase">
                  {step.label}
                </Text>
                <Text fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>{step.title}</Text>
                <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }}>{step.description}</Text>
              </VStack>
            </MotionBox>
          ))}
        </HStack>
      </VStack>
    </Slide>
  );
}
