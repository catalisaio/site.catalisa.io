import { Heading, Text, VStack, Box, Icon, SimpleGrid, GridItem } from '@chakra-ui/react';
import { FiMessageCircle, FiCpu, FiGitBranch, FiBox, FiUsers, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

export function FeatureBentoGrid() {
  const { t } = useTranslation('home');

  const features = [
    {
      icon: FiMessageCircle,
      title: t('features.items.0.title'),
      description: t('features.items.0.description'),
      color: 'whatsapp.500',
      bg: 'green.50',
      span: 2,
    },
    {
      icon: FiCpu,
      title: t('features.items.1.title'),
      description: t('features.items.1.description'),
      color: 'brand.500',
      bg: 'brand.50',
      span: 2,
    },
    {
      icon: FiGitBranch,
      title: t('features.items.2.title'),
      description: t('features.items.2.description'),
      color: 'blue.500',
      bg: 'blue.50',
      span: 1,
    },
    {
      icon: FiBox,
      title: t('features.items.3.title'),
      description: t('features.items.3.description'),
      color: 'orange.500',
      bg: 'orange.50',
      span: 1,
    },
    {
      icon: FiUsers,
      title: t('features.items.4.title'),
      description: t('features.items.4.description'),
      color: 'cyan.500',
      bg: 'cyan.50',
      span: 1,
    },
    {
      icon: FiShield,
      title: t('features.items.5.title'),
      description: t('features.items.5.description'),
      color: 'red.500',
      bg: 'red.50',
      span: 1,
    },
  ];
  return (
    <SectionWrapper>
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h2" size="xl" fontWeight="800">
          {t('features.heading')}{' '}
          <Text as="span" color="brand.500">{t('features.headingHighlight')}</Text>
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
        {features.map((feature, i) => (
          <GridItem key={feature.title} colSpan={{ base: 1, lg: feature.span }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              h="full"
            >
              <Box
                bg="white"
                p={7}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                _hover={{ borderColor: feature.color, boxShadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.3s"
                h="full"
              >
                <VStack align="flex-start" spacing={4}>
                  <Box p={3} borderRadius="lg" bg={feature.bg}>
                    <Icon as={feature.icon} boxSize={6} color={feature.color} />
                  </Box>
                  <Heading as="h3" size="sm" fontWeight="700">
                    {feature.title}
                  </Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                    {feature.description}
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          </GridItem>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
