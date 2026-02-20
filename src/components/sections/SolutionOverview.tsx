import { Heading, Text, VStack, Box, SimpleGrid, Icon, HStack } from '@chakra-ui/react';
import { FiMessageCircle, FiGitBranch, FiCpu, FiBarChart2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

export function SolutionOverview() {
  const { t } = useTranslation('home');

  const steps = [
    {
      icon: FiMessageCircle,
      label: t('solution.steps.0.label'),
      title: t('solution.steps.0.title'),
      description: t('solution.steps.0.description'),
      color: 'whatsapp.500',
      bg: 'green.50',
    },
    {
      icon: FiGitBranch,
      label: t('solution.steps.1.label'),
      title: t('solution.steps.1.title'),
      description: t('solution.steps.1.description'),
      color: 'blue.500',
      bg: 'blue.50',
    },
    {
      icon: FiCpu,
      label: t('solution.steps.2.label'),
      title: t('solution.steps.2.title'),
      description: t('solution.steps.2.description'),
      color: 'brand.500',
      bg: 'brand.50',
    },
    {
      icon: FiBarChart2,
      label: t('solution.steps.3.label'),
      title: t('solution.steps.3.title'),
      description: t('solution.steps.3.description'),
      color: 'orange.500',
      bg: 'orange.50',
    },
  ];
  return (
    <SectionWrapper bg="gray.50">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          {t('solution.heading')}{' '}
          <Text as="span" color="brand.500">{t('solution.headingHighlight')}</Text>
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          {t('solution.subtitle')}
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {steps.map((step, i) => (
          <MotionBox
            key={step.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
          >
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: step.color, boxShadow: 'lg', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
              h="full"
              position="relative"
            >
              {/* Step number */}
              <Text
                position="absolute"
                top={3}
                right={4}
                fontSize="4xl"
                fontWeight="900"
                color="gray.100"
                lineHeight={1}
              >
                {i + 1}
              </Text>

              <VStack align="flex-start" spacing={4}>
                <Box p={3} borderRadius="lg" bg={step.bg}>
                  <Icon as={step.icon} boxSize={6} color={step.color} />
                </Box>
                <HStack>
                  <Text fontSize="xs" fontWeight="700" color={step.color} textTransform="uppercase" letterSpacing="wider">
                    {step.label}
                  </Text>
                </HStack>
                <Heading as="h3" size="md" fontWeight="700">
                  {step.title}
                </Heading>
                <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                  {step.description}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
