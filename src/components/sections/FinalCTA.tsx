import { lazy, Suspense } from 'react';
import { Heading, Text, VStack, Button, HStack, Box } from '@chakra-ui/react';
import { FiMessageCircle, FiUsers, FiHeadphones, FiDollarSign, FiUserCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { BehindTheScenesHint } from '../shared/BehindTheScenesHint';
import { useBehindTheScenes } from '../shared/BehindTheScenesModal';

const BehindTheScenesModal = lazy(() => import('../shared/BehindTheScenesModal').then(m => ({ default: m.BehindTheScenesModal })));

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

const agentAvatars = [
  { icon: FiUsers, color: 'blue.300', label: 'SDR' },
  { icon: FiHeadphones, color: 'green.300', label: 'Suporte' },
  { icon: FiDollarSign, color: 'orange.300', label: 'Financeiro' },
  { icon: FiUserCheck, color: 'purple.300', label: 'Onboarding' },
];

export function FinalCTA() {
  const { t } = useTranslation('home');
  const lp = useLocalizedPath();
  const behindTheScenes = useBehindTheScenes();
  return (
    <SectionWrapper id="final-cta" bg="brand.500" py={{ base: 20, md: 28 }}>
      <VStack spacing={6} textAlign="center" maxW="700px" mx="auto">
        {/* Mini agent avatars row */}
        <HStack spacing={-2} justify="center">
          {agentAvatars.map((agent) => (
            <Box
              key={agent.label}
              w="36px"
              h="36px"
              borderRadius="full"
              bg="whiteAlpha.200"
              border="2px solid"
              borderColor="brand.400"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box as={agent.icon} color={agent.color} boxSize={4} />
            </Box>
          ))}
        </HStack>

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
            rel="noopener noreferrer"
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

        {/* Urgency note */}
        <Box
          bg="whiteAlpha.100"
          px={5}
          py={3}
          borderRadius="xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Text fontSize="sm" fontWeight="600" color="whiteAlpha.900">
            {t('finalCTA.urgencyNote')}
          </Text>
        </Box>

        <HStack spacing={6} fontSize="sm" color="whiteAlpha.700" flexWrap="wrap" justify="center">
          <Text>{t('badges.setupInMinutes', { ns: 'common' })}</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>{t('badges.lgpd', { ns: 'common' })}</Text>
          <Box w={1} h={1} borderRadius="full" bg="whiteAlpha.400" />
          <Text>{t('badges.metaWhatsApp', { ns: 'common' })}</Text>
        </HStack>

        <BehindTheScenesHint onOpen={behindTheScenes.onOpen} variant="light" />
      </VStack>

      {behindTheScenes.isOpen && (
        <Suspense fallback={null}>
          <BehindTheScenesModal isOpen={behindTheScenes.isOpen} onClose={behindTheScenes.onClose} />
        </Suspense>
      )}
    </SectionWrapper>
  );
}
