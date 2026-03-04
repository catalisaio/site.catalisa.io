import { useState, useMemo } from 'react';
import {
  Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Button,
  Input, InputGroup, InputLeftElement, Badge, Box, Divider,
} from '@chakra-ui/react';
import { FiBookOpen, FiLogOut, FiSearch, FiInbox } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { CourseCard } from '../../components/training/CourseCard';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { courses } from '../../data/trainingCourses';

const trackOrder = ['basico', 'avancado'] as const;

const trackColors: Record<string, string> = {
  basico: 'blue',
  avancado: 'purple',
  compliance: 'green',
  other: 'green',
};

function CatalogContent() {
  const { t } = useTranslation('training');
  const { getCourseProgress } = useTrainingProgress();
  const { user, signOut } = useSupabaseAuth();

  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (search) {
        const title = t(c.titleKey).toLowerCase();
        const desc = t(c.descriptionKey).toLowerCase();
        const q = search.toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      if (trackFilter === 'compliance') {
        if (c.track) return false;
      } else if (trackFilter !== 'all' && c.track !== trackFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [courses, search, trackFilter, difficultyFilter, t]);

  const groupedByTrack = useMemo(() => {
    const groups: { track: string; label: string; color: string; courses: typeof filteredCourses }[] = [];

    for (const track of trackOrder) {
      const trackCourses = filteredCourses.filter((c) => c.track === track);
      if (trackCourses.length > 0) {
        groups.push({
          track,
          label: t(`catalog.filters.${track}`),
          color: trackColors[track],
          courses: trackCourses,
        });
      }
    }

    const noTrack = filteredCourses.filter((c) => !c.track);
    if (noTrack.length > 0) {
      groups.push({
        track: 'other',
        label: t('catalog.filters.compliance'),
        color: trackColors.other,
        courses: noTrack,
      });
    }

    return groups;
  }, [filteredCourses, t]);

  const showGroupHeaders = trackFilter === 'all';

  const trackButtons = ['all', ...trackOrder, 'compliance'] as const;
  const difficultyButtons = ['all', 'iniciante', 'intermediario', 'avancado'] as const;

  return (
    <Container maxW="1200px" py={12}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <VStack spacing={3}>
          <HStack justify="space-between" w="full" align="flex-start">
            <VStack align="flex-start" spacing={1}>
              <HStack spacing={2}>
                <Icon as={FiBookOpen} color="blue.500" boxSize={6} />
                <Heading size="lg">{t('catalog.heading')}</Heading>
              </HStack>
              <Text color="gray.600" fontSize="sm">
                {t('catalog.subtitle')}
              </Text>
            </VStack>
            <VStack align="flex-end" spacing={1}>
              <Text fontSize="xs" color="gray.500">{user?.email}</Text>
              <Button size="xs" variant="ghost" leftIcon={<FiLogOut />} onClick={signOut}>
                {t('catalog.logout')}
              </Button>
            </VStack>
          </HStack>
        </VStack>

        {/* Search */}
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={t('catalog.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
            borderRadius="lg"
          />
        </InputGroup>

        {/* Filters */}
        <HStack spacing={3} flexWrap="wrap">
          <HStack spacing={1}>
            {trackButtons.map((val) => (
              <Button
                key={val}
                size="sm"
                variant={trackFilter === val ? 'solid' : 'outline'}
                colorScheme={val === 'all' ? 'gray' : trackColors[val] || 'gray'}
                onClick={() => setTrackFilter(val)}
                borderRadius="full"
                fontWeight={trackFilter === val ? '600' : '400'}
              >
                {t(`catalog.filters.${val}`)}
              </Button>
            ))}
          </HStack>
          <Box h="20px" borderLeft="1px solid" borderColor="gray.300" />
          <HStack spacing={1}>
            {difficultyButtons.map((val) => (
              <Button
                key={val}
                size="sm"
                variant={difficultyFilter === val ? 'solid' : 'outline'}
                colorScheme={difficultyFilter === val ? 'gray' : 'gray'}
                onClick={() => setDifficultyFilter(val)}
                borderRadius="full"
                fontWeight={difficultyFilter === val ? '600' : '400'}
              >
                {t(`catalog.filters.${val}`)}
              </Button>
            ))}
          </HStack>
        </HStack>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <VStack spacing={3} py={16} color="gray.400">
            <Icon as={FiInbox} boxSize={10} />
            <Text fontSize="md">{t('catalog.noResults')}</Text>
          </VStack>
        ) : showGroupHeaders ? (
          <VStack spacing={10} align="stretch">
            {groupedByTrack.map((group) => (
              <VStack key={group.track} spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Heading size="sm" color={`${group.color}.600`}>
                    {group.label}
                  </Heading>
                  <Divider flex={1} />
                  <Badge colorScheme={group.color} fontSize="xs" borderRadius="full" px={2}>
                    {t('catalog.courseCount', { count: group.courses.length })}
                  </Badge>
                </HStack>
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
                  {group.courses.map((course) => (
                    <CourseCard
                      key={course.slug}
                      course={course}
                      progress={course.available ? getCourseProgress(course.slug, course.modules) : 0}
                      showTrackBadge={false}
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            ))}
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                progress={course.available ? getCourseProgress(course.slug, course.modules) : 0}
                showTrackBadge
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
}

export function TrainingCatalog() {
  return (
    <ProtectedRoute>
      <CatalogContent />
    </ProtectedRoute>
  );
}
