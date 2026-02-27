import { Heading, Text, VStack, Box, Flex, SimpleGrid, HStack } from '@chakra-ui/react';
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
    visionary: { xRange: [10, 40], yRange: [15, 45] },
    challenger: { xRange: [55, 85], yRange: [55, 85] },
    leader: { xRange: [55, 85], yRange: [15, 45] },
  };
  const pos = basePositions[quadrant] || basePositions.niche;
  const spread = total > 1 ? index / (total - 1) : 0.5;
  return {
    x: pos.xRange[0] + spread * (pos.xRange[1] - pos.xRange[0]),
    y: pos.yRange[0] + (index % 2 === 0 ? 0.3 : 0.7) * (pos.yRange[1] - pos.yRange[0]),
  };
}

const insightColors = ['cyan.400', 'orange.400', 'brand.400'];

export function S16_AgenticQuadrant() {
  const { t } = useTranslation('presentation');
  const c = usePresentationColors();
  const players = t('agenticQuadrant.players', { returnObjects: true }) as Player[];
  const quadrants = t('agenticQuadrant.quadrants', { returnObjects: true }) as Record<string, string>;
  const insights = t('agenticQuadrant.insights', { returnObjects: true }) as Array<{ label: string; text: string }>;

  const groupedByQuadrant: Record<string, Player[]> = {};
  players.forEach((p) => {
    if (!groupedByQuadrant[p.quadrant]) groupedByQuadrant[p.quadrant] = [];
    groupedByQuadrant[p.quadrant].push(p);
  });

  return (
    <Slide>
      <VStack spacing={{ base: 4, md: 6 }} w="full">
        <VStack spacing={2} textAlign="center">
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.15em" textTransform="uppercase" color="catalisa.secondary">
              {t('agenticQuadrant.badge')}
            </Text>
          </MotionBox>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Heading fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="800" lineHeight="1.2">
              {t('agenticQuadrant.headline')}{' '}
              <Text as="span" color="catalisa.secondary">{t('agenticQuadrant.headlineHighlight')}</Text>
            </Heading>
          </MotionBox>
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={c.textMuted} fontSize={{ base: 'xs', md: 'sm' }} maxW="600px">
              {t('agenticQuadrant.subtitle')}
            </Text>
          </MotionBox>
        </VStack>

        {/* Quadrant chart */}
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          w="full"
          maxW="550px"
          mx="auto"
        >
          <Box
            position="relative"
            w="full"
            pb="85%"
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
                {quadrants.visionary}
              </Text>
              <Text position="absolute" top={2} right={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.leader}
              </Text>
              <Text position="absolute" bottom={2} left={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.niche}
              </Text>
              <Text position="absolute" bottom={2} right={3} fontSize="xs" color={c.textGhost} fontWeight="600">
                {quadrants.challenger}
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
                      bg={player.highlight ? 'catalisa.secondary' : c.textGhost}
                      boxShadow={player.highlight ? '0 0 20px rgba(253,194,52,0.5)' : 'none'}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight={player.highlight ? '800' : '500'}
                      color={player.highlight ? 'catalisa.secondary' : c.textMuted}
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
                {t('agenticQuadrant.axisX')} →
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
                {t('agenticQuadrant.axisY')} →
              </Text>
            </Box>
          </Box>
        </MotionBox>

        {/* Insight cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 2, md: 4 }} w="full">
          {insights.map((insight, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            >
              <Box
                bg={c.surfaceBg}
                px={{ base: 3, md: 4 }}
                py={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={c.surfaceBorder}
                h="full"
              >
                <HStack spacing={2} mb={1}>
                  <Box w={2} h={2} borderRadius="full" bg={insightColors[i]} />
                  <Text fontSize="xs" fontWeight="700" color={insightColors[i]}>
                    {insight.label}
                  </Text>
                </HStack>
                <Text fontSize="xs" color={c.textMuted} lineHeight="1.5">{insight.text}</Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}>
          <Text fontSize="xs" color={c.textGhost} fontStyle="italic" textAlign="center" maxW="500px">
            {t('agenticQuadrant.disclaimer')}
          </Text>
        </MotionBox>
      </VStack>
    </Slide>
  );
}
