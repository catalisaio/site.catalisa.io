import { useEffect, useState } from 'react';
import { Box, Container, Flex, HStack, Icon, Text, VStack, Badge } from '@chakra-ui/react';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { EVENT } from '../../data/vtexDay2026';

function timeUntil(startIso: string, endIso: string) {
  const now = Date.now();
  const start = new Date(startIso + 'T00:00:00-03:00').getTime();
  const end = new Date(endIso + 'T23:59:59-03:00').getTime();
  if (now >= start && now <= end) return { live: true, days: 0, hours: 0 };
  if (now > end) return { live: false, days: 0, hours: 0, ended: true };
  const diffMs = start - now;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { live: false, days, hours };
}

export function VtexDayConceptCard() {
  const { t } = useTranslation('vtex-day-2026');
  const [tick, setTick] = useState(() => timeUntil(EVENT.startDate, EVENT.endDate));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick(timeUntil(EVENT.startDate, EVENT.endDate));
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Box as="section" id="vtex-day-concept" py={{ base: 12, md: 20 }} bg="bg-page">
      <Container maxW="1200px">
        <Box
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          bgGradient="linear(135deg, brand.500, brand.700)"
          color="white"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="-30%"
            right="-10%"
            w="380px"
            h="380px"
            borderRadius="full"
            bgGradient="radial(circle, rgba(255,255,255,0.18) 0%, transparent 70%)"
            pointerEvents="none"
          />
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', lg: 'center' }}
            gap={8}
            position="relative"
          >
            <VStack align="flex-start" spacing={4}>
              <Badge
                bg="whiteAlpha.200"
                color="white"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="600"
                letterSpacing="wide"
              >
                {t('concept.tagline')}
              </Badge>
              <Text as="h2" fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" lineHeight="1.15">
                🏙 {t('concept.title')}
              </Text>
              <Text color="whiteAlpha.800" fontSize={{ base: 'md', md: 'lg' }} maxW="520px">
                {t('concept.detail', {
                  speakers: EVENT.speakers,
                  sessions: EVENT.sessions,
                  brands: EVENT.brands,
                })}
              </Text>

              <HStack spacing={6} flexWrap="wrap" pt={2}>
                <HStack spacing={2}>
                  <Icon as={FiCalendar} color="whiteAlpha.900" />
                  <Text fontSize="sm" fontWeight="600">16–17 abril 2026</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiMapPin} color="whiteAlpha.900" />
                  <Text fontSize="sm" fontWeight="600">{EVENT.venue}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiUsers} color="whiteAlpha.900" />
                  <Text fontSize="sm" fontWeight="600">{EVENT.visitors} pessoas</Text>
                </HStack>
              </HStack>
            </VStack>

            <Box
              bg="whiteAlpha.200"
              borderRadius="xl"
              px={6}
              py={5}
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.300"
              minW={{ base: 'full', lg: '260px' }}
            >
              {tick.live ? (
                <VStack spacing={1} align={{ base: 'flex-start', lg: 'center' }}>
                  <HStack>
                    <Box w="10px" h="10px" borderRadius="full" bg="#ff4b4b" boxShadow="0 0 10px #ff4b4b" />
                    <Text fontSize="sm" fontWeight="700" letterSpacing="wide">
                      {t('concept.live').toUpperCase()}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="whiteAlpha.800">
                    São Paulo Expo
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={0} align={{ base: 'flex-start', lg: 'center' }}>
                  <Text fontSize="xs" color="whiteAlpha.700" fontWeight="600" letterSpacing="wide">
                    {t('concept.countdown').toUpperCase()}
                  </Text>
                  <HStack spacing={4} pt={1}>
                    <VStack spacing={0}>
                      <Text fontSize="3xl" fontWeight="800" lineHeight="1">{tick.days}</Text>
                      <Text fontSize="xs" color="whiteAlpha.700">{t('concept.daysLeft')}</Text>
                    </VStack>
                    <VStack spacing={0}>
                      <Text fontSize="3xl" fontWeight="800" lineHeight="1">{tick.hours}</Text>
                      <Text fontSize="xs" color="whiteAlpha.700">{t('concept.hoursLeft')}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              )}
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
