import { Heading, Text, SimpleGrid, VStack, Icon, Box } from '@chakra-ui/react';
import { FiClock, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox, staggerItem } from '../motion';

export function ProblemStatement() {
  const { t } = useTranslation('home');

  const problems = [
    {
      icon: FiClock,
      title: t('problem.items.0.title'),
      description: t('problem.items.0.description'),
    },
    {
      icon: FiUsers,
      title: t('problem.items.1.title'),
      description: t('problem.items.1.description'),
    },
    {
      icon: FiAlertTriangle,
      title: t('problem.items.2.title'),
      description: t('problem.items.2.description'),
    },
  ];
  return (
    <SectionWrapper>
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          {t('problem.heading')}{' '}
          <Text as="span" color="brand.500">{t('problem.headingHighlight')}</Text>
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          {t('problem.subtitle')}
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {problems.map((problem) => (
          <MotionBox key={problem.title} {...staggerItem}>
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: 'brand.200', boxShadow: 'md', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
              h="full"
            >
              <VStack align="flex-start" spacing={4}>
                <Box p={3} borderRadius="lg" bg="red.50">
                  <Icon as={problem.icon} boxSize={6} color="red.400" />
                </Box>
                <Heading as="h3" size="md" fontWeight="700">
                  {problem.title}
                </Heading>
                <Text color="gray.500" lineHeight="1.7">
                  {problem.description}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
