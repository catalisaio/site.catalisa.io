import { Heading, Text, VStack, Wrap, WrapItem, HStack, Icon, Box } from '@chakra-ui/react';
import { FiShield, FiLock, FiGlobe, FiUsers, FiKey, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';

export function TrustSection() {
  const { t } = useTranslation('home');

  const badges = [
    { icon: FiShield, label: t('badges.lgpd', { ns: 'common' }), color: 'green.500' },
    { icon: FiCheckCircle, label: t('badges.metaWhatsApp', { ns: 'common' }), color: 'blue.500' },
    { icon: FiLock, label: t('badges.encryption', { ns: 'common' }), color: 'brand.500' },
    { icon: FiUsers, label: t('badges.multiTenant', { ns: 'common' }), color: 'orange.500' },
    { icon: FiKey, label: t('badges.rbac', { ns: 'common' }), color: 'red.500' },
    { icon: FiGlobe, label: t('badges.dataStoredBrazil', { ns: 'common' }), color: 'cyan.500' },
  ];
  return (
    <SectionWrapper bg="gray.50">
      <VStack spacing={8} textAlign="center">
        <VStack spacing={3}>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('trust.heading')}
          </Heading>
          <Text color="gray.500" maxW="500px" fontSize="lg">
            {t('trust.subtitle')}
          </Text>
        </VStack>

        <Wrap spacing={4} justify="center">
          {badges.map((badge) => (
            <WrapItem key={badge.label}>
              <HStack
                bg="white"
                px={5}
                py={3}
                borderRadius="full"
                border="1px solid"
                borderColor="gray.200"
                spacing={3}
                _hover={{ borderColor: badge.color, boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                <Icon as={badge.icon} boxSize={4} color={badge.color} />
                <Text fontSize="sm" fontWeight="500" color="gray.700">
                  {badge.label}
                </Text>
              </HStack>
            </WrapItem>
          ))}
        </Wrap>

        <Box
          bg="white"
          px={6}
          py={3}
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="sm" color="gray.500">
            {t('trust.infrastructure')} <Text as="span" fontWeight="600" color="gray.700">{t('trust.cloudBrazil')}</Text> {t('trust.monitoring')}
          </Text>
        </Box>
      </VStack>
    </SectionWrapper>
  );
}
