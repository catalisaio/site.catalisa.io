import { Heading, Text, SimpleGrid, VStack, HStack, Box, Icon } from '@chakra-ui/react';
import { FiClock, FiUsers, FiXCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

const columnIcons = [FiClock, FiUsers, FiXCircle];

export function S04_WhatsAppProblem() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const columns = t('whatsappProblem.columns', { returnObjects: true }) as Array<{ title: string; description: string }>;
  const metrics = t('whatsappProblem.metrics', { returnObjects: true }) as Array<{ value: string; label: string }>;

  return (
    <Slide>
      <VStack spacing={{ base: 8, md: 10 }} w="full">
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" textAlign="center">
            {t('whatsappProblem.headline')}
          </Heading>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="full">
          {columns.map((col, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <VStack
                bg={c.surfaceBg}
                p={6}
                borderRadius="xl"
                border="1px solid"
                borderColor={c.surfaceBorder}
                align="flex-start"
                spacing={3}
                h="full"
              >
                <Icon as={columnIcons[i]} boxSize={6} color="red.400" />
                <Text fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>{col.title}</Text>
                <Text color={c.textMuted} fontSize={{ base: 'sm', md: 'md' }}>{col.description}</Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Metrics */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          w="full"
        >
          <Box
            bg={c.problemIconBg}
            bgGradient="linear(to-r, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.05))"
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.problemBorder}
          >
            <Text fontSize="xs" color={c.problemAccent} fontWeight="600" letterSpacing="0.1em" mb={4}>
              {t('whatsappProblem.metricsLabel')}
            </Text>
            <HStack justify="space-around" flexWrap="wrap" gap={4}>
              {metrics.map((m, i) => (
                <VStack key={i} spacing={1}>
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color={c.problemAccent}>{m.value}</Text>
                  <Text fontSize={{ base: 'xs', md: 'sm' }} color={c.textMuted}>{m.label}</Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
