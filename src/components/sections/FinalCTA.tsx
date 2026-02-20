import { Heading, Text, VStack, Button, HStack, Box } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function FinalCTA() {
  const { t } = useTranslation('home');
  const lp = useLocalizedPath();
  return (
    <SectionWrapper bg="brand.500" py={{ base: 20, md: 28 }}>
      <VStack spacing={6} textAlign="center" maxW="700px" mx="auto">
        <Heading as="h2" size="2xl" fontWeight="800" color="white">
          {t('finalCTA.heading')}
        </Heading>
        <Text color="whiteAlpha.800" fontSize="lg" lineHeight="1.7">
          {t('finalCTA.subtitle')}
        </Text>

        <HStack spacing={4} flexWrap="wrap" justify="center">
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            size="lg"
            bg="white"
            color="brand.600"
            _hover={{ bg: 'gray.100', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
            leftIcon={<FiMessageCircle />}
            transition="all 0.2s"
            fontWeight="700"
          >
            {t('cta.letsChat', { ns: 'common' })}
          </Button>
          <Button
            as={Link}
            to={lp('/contato')}
            size="lg"
            variant="outline"
            borderColor="whiteAlpha.500"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            {t('cta.learnMore', { ns: 'common' })}
          </Button>
        </HStack>

        <HStack spacing={6} fontSize="sm" color="whiteAlpha.700" flexWrap="wrap" justify="center">
          <Text>{t('badges.setupInMinutes', { ns: 'common' })}</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>{t('badges.lgpd', { ns: 'common' })}</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>{t('badges.metaWhatsApp', { ns: 'common' })}</Text>
        </HStack>
      </VStack>
    </SectionWrapper>
  );
}
