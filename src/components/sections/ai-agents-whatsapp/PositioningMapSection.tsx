import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../../shared/SectionWrapper';
import { GradientText } from '../../shared/GradientText';

interface Player {
  name: string;
  quadrant: string;
  highlight?: boolean;
}

// Map quadrant to approximate position percentages
const quadrantPositions: Record<string, { x: [number, number]; y: [number, number] }> = {
  niche: { x: [10, 35], y: [10, 40] },
  challenger: { x: [10, 40], y: [55, 85] },
  visionary: { x: [55, 85], y: [40, 65] },
  leader: { x: [65, 90], y: [70, 95] },
};

function getPlayerPosition(player: Player, index: number) {
  const range = quadrantPositions[player.quadrant] || quadrantPositions.niche;
  // Spread players within their quadrant
  const xSpread = range.x[1] - range.x[0];
  const ySpread = range.y[1] - range.y[0];
  return {
    left: `${range.x[0] + (index * 13) % xSpread}%`,
    bottom: `${range.y[0] + (index * 17) % ySpread}%`,
  };
}

export function PositioningMapSection() {
  const { t } = useTranslation('ai-agents-whatsapp');
  const players = t('positioningMap.players', { returnObjects: true }) as Player[];

  return (
    <SectionWrapper bg="white" id="positioning">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="brand.50"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="brand.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('positioningMap.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('positioningMap.headline')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('positioningMap.headlineGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
          {t('positioningMap.subtitle')}
        </Text>
      </VStack>

      {/* Map */}
      <Box maxW="600px" mx="auto" mb={6}>
        <Box
          position="relative"
          w="full"
          pt="100%"
          borderRadius="2xl"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Box position="absolute" inset={0} p={4}>
            {/* Axis labels */}
            <Text
              position="absolute"
              bottom={2}
              left="50%"
              transform="translateX(-50%)"
              fontSize="xs"
              color="gray.400"
              fontWeight="600"
            >
              {t('positioningMap.axisX')} &rarr;
            </Text>
            <Text
              position="absolute"
              left={2}
              top="50%"
              transform="translateY(-50%) rotate(-90deg)"
              fontSize="xs"
              color="gray.400"
              fontWeight="600"
              transformOrigin="center"
            >
              {t('positioningMap.axisY')} &uarr;
            </Text>

            {/* Quadrant labels */}
            <Text position="absolute" left="15%" bottom="15%" fontSize="2xs" color="gray.300" fontWeight="600">
              {t('positioningMap.quadrants.niche')}
            </Text>
            <Text position="absolute" right="15%" bottom="15%" fontSize="2xs" color="gray.300" fontWeight="600">
              {t('positioningMap.quadrants.visionary')}
            </Text>
            <Text position="absolute" left="15%" top="15%" fontSize="2xs" color="gray.300" fontWeight="600">
              {t('positioningMap.quadrants.challenger')}
            </Text>
            <Text position="absolute" right="15%" top="15%" fontSize="2xs" color="gray.300" fontWeight="600">
              {t('positioningMap.quadrants.leader')}
            </Text>

            {/* Grid lines */}
            <Box position="absolute" left="50%" top={4} bottom={4} w="1px" bg="gray.200" />
            <Box position="absolute" top="50%" left={4} right={4} h="1px" bg="gray.200" />

            {/* Players */}
            {players.map((player, i) => {
              const pos = getPlayerPosition(player, i);
              return (
                <Flex
                  key={player.name}
                  position="absolute"
                  left={pos.left}
                  bottom={pos.bottom}
                  align="center"
                  gap={1}
                  transform="translate(-50%, 50%)"
                >
                  <Box
                    w={player.highlight ? '12px' : '8px'}
                    h={player.highlight ? '12px' : '8px'}
                    borderRadius="full"
                    bg={player.highlight ? 'brand.500' : 'gray.400'}
                    boxShadow={player.highlight ? '0 0 0 3px var(--chakra-colors-brand-200)' : 'none'}
                  />
                  <Text
                    fontSize="2xs"
                    fontWeight={player.highlight ? '700' : '500'}
                    color={player.highlight ? 'brand.600' : 'gray.500'}
                    whiteSpace="nowrap"
                  >
                    {player.name}
                  </Text>
                </Flex>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Disclaimer */}
      <Text color="gray.400" fontSize="xs" textAlign="center" fontStyle="italic">
        {t('positioningMap.disclaimer')}
      </Text>
    </SectionWrapper>
  );
}
