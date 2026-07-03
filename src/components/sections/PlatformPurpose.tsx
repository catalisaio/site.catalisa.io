import { Heading, Text, VStack, SimpleGrid, Box, Icon, HStack, Link } from '@chakra-ui/react';
import { FiUsers, FiCalendar } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { SectionWrapper } from '../shared/SectionWrapper';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

export function PlatformPurpose() {
  const { t } = useTranslation('home');
  const lp = useLocalizedPath();

  const cards = [
    {
      icon: FiUsers,
      color: 'brand.500',
      title: t('platformPurpose.whatIs.title'),
      body: t('platformPurpose.whatIs.body'),
    },
    {
      icon: FiCalendar,
      color: 'whatsapp.500',
      title: t('platformPurpose.google.title'),
      body: t('platformPurpose.google.body'),
    },
  ];

  return (
    <SectionWrapper id="platform-purpose" bg="white">
      <VStack spacing={10} align="stretch">
        <VStack spacing={3} textAlign="center">
          <Heading as="h2" size="xl" fontWeight="800">
            {t('platformPurpose.heading')}
          </Heading>
          <Text color="gray.500" maxW="640px" fontSize="lg" mx="auto">
            {t('platformPurpose.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {cards.map((card) => (
            <Box
              key={card.title}
              bg="gray.50"
              p={8}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
            >
              <HStack spacing={3} mb={4}>
                <Icon as={card.icon} boxSize={6} color={card.color} />
                <Heading as="h3" size="md" fontWeight="700">
                  {card.title}
                </Heading>
              </HStack>
              <Text color="gray.600" fontSize="md" lineHeight="tall">
                {card.body}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          {t('platformPurpose.privacyNote')}{' '}
          <Link as={RouterLink} to={lp('/politica-privacidade')} color="brand.600" textDecoration="underline">
            {t('platformPurpose.privacyLink')}
          </Link>
        </Text>
      </VStack>
    </SectionWrapper>
  );
}
