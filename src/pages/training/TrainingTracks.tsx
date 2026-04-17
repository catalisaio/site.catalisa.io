import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Badge, Icon, Flex, Progress } from '@chakra-ui/react';
import { FiBookOpen, FiTrendingUp, FiAward } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { MotionBox, fadeInUp } from '../../components/motion';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { useTrainingGamification } from '../../hooks/useTrainingGamification';
import { tracks } from '../../data/trainingTracks';
import { courses } from '../../data/trainingCourses';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

const iconMap: Record<string, React.ComponentType> = {
  'book-open': FiBookOpen,
  'trending-up': FiTrendingUp,
  'award': FiAward,
};

export function TrainingTracks() {
  const { getCourseProgress } = useTrainingProgress();
  const { totalXP, badges: earnedBadges } = useTrainingGamification();
  const lp = useLocalizedPath();

  return (
    <ProtectedRoute>
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="6xl">
          {/* Header with XP */}
          <Flex justify="space-between" align="center" mb={8}>
            <Box>
              <Heading size="lg" color="gray.800" mb={1}>Trilhas de Aprendizado</Heading>
              <Text color="gray.600" fontSize="sm">Escolha sua trilha e avance no seu ritmo</Text>
            </Box>
            <HStack spacing={4}>
              <Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full">
                {totalXP} XP
              </Badge>
              <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
                {earnedBadges.length} badges
              </Badge>
            </HStack>
          </Flex>

          {/* Track Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {tracks.map((track) => {
              const trackCourses = track.courseSlugs
                .map(slug => courses.find(c => c.slug === slug))
                .filter(Boolean) as typeof courses;

              const totalCourses = trackCourses.length;
              const completedCourses = trackCourses.filter(c =>
                getCourseProgress(c.slug, c.modules) === 100,
              ).length;
              const progressPct = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

              const TrackIcon = iconMap[track.icon] || FiBookOpen;

              return (
                <MotionBox key={track.slug} {...fadeInUp}>
                  <Box
                    as={RouterLink}
                    to={lp(`/treinamento/trilhas/${track.slug}`)}
                    bg="white"
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.200"
                    p={6}
                    transition="all 0.2s"
                    _hover={{ shadow: 'lg', borderColor: `${track.colorScheme}.300`, transform: 'translateY(-2px)' }}
                    display="block"
                  >
                    <Flex align="center" gap={3} mb={4}>
                      <Flex
                        w="48px"
                        h="48px"
                        borderRadius="xl"
                        bg={`${track.colorScheme}.100`}
                        align="center"
                        justify="center"
                      >
                        <Icon as={TrackIcon} color={`${track.colorScheme}.600`} boxSize={5} />
                      </Flex>
                      <Box>
                        <Heading size="sm" color="gray.800">{track.name}</Heading>
                        <Badge colorScheme={track.colorScheme} fontSize="2xs" mt={0.5}>
                          {track.totalXP} XP
                        </Badge>
                      </Box>
                    </Flex>

                    <Text fontSize="sm" color="gray.600" lineHeight="tall" mb={4}>
                      {track.description}
                    </Text>

                    <VStack spacing={2} align="stretch">
                      <Flex justify="space-between" fontSize="xs" color="gray.500">
                        <Text>{completedCourses} de {totalCourses} cursos</Text>
                        <Text>{progressPct}%</Text>
                      </Flex>
                      <Progress
                        value={progressPct}
                        size="sm"
                        borderRadius="full"
                        colorScheme={progressPct === 100 ? 'green' : track.colorScheme}
                      />
                    </VStack>

                    {track.certificateSlug && progressPct === 100 && (
                      <Badge colorScheme="green" mt={3} fontSize="xs">
                        Certificado disponivel!
                      </Badge>
                    )}
                  </Box>
                </MotionBox>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
