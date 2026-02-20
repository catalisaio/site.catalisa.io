import { Heading, Text, VStack, Box, SimpleGrid, Icon, HStack, Badge } from '@chakra-ui/react';
import { FiZap, FiBox, FiMessageCircle, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

export function Differentiators() {
  const { t } = useTranslation('home');

  const differentiators = [
    {
      icon: FiZap,
      vs: t('differentiators.items.0.vs'),
      title: t('differentiators.items.0.title'),
      description: t('differentiators.items.0.description'),
      color: 'purple.500',
      bg: 'purple.50',
    },
    {
      icon: FiBox,
      vs: t('differentiators.items.1.vs'),
      title: t('differentiators.items.1.title'),
      description: t('differentiators.items.1.description'),
      color: 'orange.500',
      bg: 'orange.50',
    },
    {
      icon: FiMessageCircle,
      vs: t('differentiators.items.2.vs'),
      title: t('differentiators.items.2.title'),
      description: t('differentiators.items.2.description'),
      color: 'green.500',
      bg: 'green.50',
    },
    {
      icon: FiClock,
      vs: t('differentiators.items.3.vs'),
      title: t('differentiators.items.3.title'),
      description: t('differentiators.items.3.description'),
      color: 'blue.500',
      bg: 'blue.50',
    },
  ];
  return (
    <SectionWrapper bg="gray.50">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Badge colorScheme="brand" fontSize="xs" px={3} py={1} borderRadius="full">
          {t('differentiators.badge')}
        </Badge>
        <Heading as="h2" size="xl" fontWeight="800">
          {t('differentiators.heading')} <Text as="span" color="brand.500">{t('differentiators.headingHighlight')}</Text>
        </Heading>
        <Text color="gray.500" maxW="600px" fontSize="lg">
          {t('differentiators.subtitle')}
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {differentiators.map((item, i) => (
          <MotionBox
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Box
              bg="white"
              p={7}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.100"
              _hover={{ borderColor: item.color, boxShadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.3s"
              h="full"
            >
              <VStack align="flex-start" spacing={4}>
                <HStack spacing={3}>
                  <Box p={3} borderRadius="lg" bg={item.bg}>
                    <Icon as={item.icon} boxSize={5} color={item.color} />
                  </Box>
                  <Badge colorScheme="gray" variant="subtle" fontSize="xs" px={2}>
                    {item.vs}
                  </Badge>
                </HStack>
                <Heading as="h3" size="sm" fontWeight="700">
                  {item.title}
                </Heading>
                <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                  {item.description}
                </Text>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
