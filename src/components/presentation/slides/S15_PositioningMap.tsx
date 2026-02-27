import { Heading, Text, VStack, Box, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Slide } from '../Slide';
import { MotionBox } from '../../motion';
import { usePresentationColors } from '../PresentationThemeContext';

interface Player {
  name: string;
  quadrant: string;
  highlight?: boolean;
}

function getPlayerPosition(quadrant: string, index: number, total: number) {
  const basePositions: Record<string, { xRange: [number, number]; yRange: [number, number] }> = {
    niche: { xRange: [10, 40], yRange: [55, 85] },
    visionary: { xRange: [55, 85], yRange: [55, 85] },
    challenger: { xRange: [10, 40], yRange: [15, 45] },
    leader: { xRange: [55, 85], yRange: [15, 45] },
  };
  const pos = basePositions[quadrant] || basePositions.niche;
  const spread = total > 1 ? index / (total - 1) : 0.5;
  return {
    x: pos.xRange[0] + spread * (pos.xRange[1] - pos.xRange[0]),
    y: pos.yRange[0] + (index % 2 === 0 ? 0.3 : 0.7) * (pos.yRange[1] - pos.yRange[0]),
  };
}

export function S15_PositioningMap() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const players = t('positioningMap.players', { returnObjects: true }) as Player[];
  const quadrants = t('positioningMap.quadrants', { returnObjects: true }) as Record<string, string>;

  const groupedByQuadrant: Record<string, Player[]> = {};
  players.forEach((p) => {
    if (!groupedByQuadrant[p.quadrant]) groupedByQuadrant[p.quadrant] = [];
    groupedByQuadrant[p.quadrant].push(p);
  });

  return (
    <Slide>
      <VStack spacing={{ base: 4, md: 6 }} w="full">
        <VStack spacing={2} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800">
              {t('positioningMap.headline')}
            </Heading>
          </MotionBox>
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} maxW="600px">
              {t('positioningMap.subtitle')}
            </Text>
          </MotionBox>
        </VStack>

        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          w="full"
          maxW="700px"
          mx="auto"
        >
          <Box
            position="relative"
            w="full"
            pb="100%"
            bg={c.surfaceBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={c.surfaceBorder}
            overflow="hidden"
          >
            <Box position="absolute" inset={0}>
              {/* Quadrant lines */}
              <Box position="absolute" left="50%" top={0} bottom={0} w="1px" bg={c.surfaceBorder} />
              <Box position="absolute" top="50%" left={0} right={0} h="1px" bg={c.surfaceBorder} />

              {/* Quadrant labels */}
              <Text position="absolute" top={2} left={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.challenger}
              </Text>
              <Text position="absolute" top={2} right={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.leader}
              </Text>
              <Text position="absolute" bottom={2} left={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.niche}
              </Text>
              <Text position="absolute" bottom={2} right={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.visionary}
              </Text>

              {/* Players */}
              {players.map((player) => {
                const group = groupedByQuadrant[player.quadrant] || [];
                const idx = group.indexOf(player);
                const pos = getPlayerPosition(player.quadrant, idx, group.length);
                return (
                  <Flex
                    key={player.name}
                    position="absolute"
                    left={`${pos.x}%`}
                    top={`${pos.y}%`}
                    transform="translate(-50%, -50%)"
                    direction="column"
                    align="center"
                    gap={1}
                  >
                    <Box
                      w={player.highlight ? 5 : 3}
                      h={player.highlight ? 5 : 3}
                      borderRadius="full"
                      bg={player.highlight ? 'brand.400' : c.textGhost}
                      boxShadow={player.highlight ? '0 0 20px rgba(115,75,156,0.6)' : 'none'}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight={player.highlight ? '800' : '500'}
                      color={player.highlight ? 'brand.300' : c.textMuted}
                      whiteSpace="nowrap"
                    >
                      {player.highlight ? `★ ${player.name}` : player.name}
                    </Text>
                  </Flex>
                );
              })}

              {/* Axis labels */}
              <Text
                position="absolute"
                bottom={-1}
                left="50%"
                transform="translateX(-50%)"
                fontSize="xs"
                color={c.textSubtle}
                fontWeight="600"
                bg={c.surfaceBg}
                px={2}
              >
                {t('positioningMap.axisX')} →
              </Text>
              <Text
                position="absolute"
                top="50%"
                left={-1}
                transform="translateY(-50%) rotate(-90deg)"
                fontSize="xs"
                color={c.textSubtle}
                fontWeight="600"
                bg={c.surfaceBg}
                px={2}
                whiteSpace="nowrap"
              >
                {t('positioningMap.axisY')} →
              </Text>
            </Box>
          </Box>
        </MotionBox>

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <Text fontSize="xs" color={c.textGhost} fontStyle="italic" textAlign="center" maxW="500px">
            {t('positioningMap.disclaimer')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
