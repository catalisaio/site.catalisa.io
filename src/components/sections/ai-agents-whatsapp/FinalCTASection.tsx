import { Heading, Text, VStack, Button, HStack, Box } from '@chakra-ui/react';
import { FiMessageCircle, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';
import { useLocalizedPath } from '../../../i18n/useLocalizedPath';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20AI%20Agents%20no%20WhatsApp.';

export function FinalCTASection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const lp = useLocalizedPath();

  return (
    <SectionWrapper bg="whatsapp.500" py={{ base: 20, md: 28 }}>
      <VStack spacing={6} textAlign="center" maxW="700px" mx="auto">
        <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="800" color="white">
          {t('finalCTA.headline')}{' '}
          <GradientText
            gradient="linear(to-r, white, yellow.200)"
            fontSize="inherit"
            fontWeight="inherit"
          >
            {t('finalCTA.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="whiteAlpha.800" fontSize="lg" lineHeight="1.7">
          {t('finalCTA.subtitle')}
        </Text>

        <HStack spacing={4} flexWrap="wrap" justify="center">
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            bg="white"
            color="whatsapp.600"
            _hover={{
              bg: 'gray.100',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            }}
            leftIcon={<FiMessageCircle />}
            transition="all 0.2s"
            fontWeight="700"
          >
            {t('finalCTA.cta')}
          </Button>
          <Button
            as={Link}
            to={lp('/demo')}
            size="lg"
            variant="outline"
            borderColor="whiteAlpha.500"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            leftIcon={<FiPlay />}
          >
            {t('finalCTA.ctaSecondary')}
          </Button>
        </HStack>

        <HStack spacing={6} fontSize="sm" color="whiteAlpha.700" flexWrap="wrap" justify="center">
          <Text>{t('badges.lgpd', { ns: 'common' })}</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>{t('badges.metaWhatsApp', { ns: 'common' })}</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>{t('badges.composableRevenue', { ns: 'common' })}</Text>
        </HStack>
      </VStack>
    </SectionWrapper>
  );
}
