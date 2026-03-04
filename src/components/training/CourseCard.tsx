import { Box, Heading, Text, Badge, HStack, VStack, Icon } from '@chakra-ui/react';
import { FiClock, FiBookOpen, FiLock, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { ProgressBar } from './ProgressBar';
import type { Course } from '../../data/trainingCourses';
import { getTotalLessons } from '../../data/trainingCourses';

const difficultyColors: Record<string, string> = {
  iniciante: 'green',
  intermediario: 'orange',
  avancado: 'red',
};

const trackColors: Record<string, string> = {
  basico: 'blue',
  avancado: 'purple',
};

interface CourseCardProps {
  course: Course;
  progress: number;
  showTrackBadge?: boolean;
}

export function CourseCard({ course, progress, showTrackBadge = false }: CourseCardProps) {
  const { t } = useTranslation('training');
  const lp = useLocalizedPath();

  const totalLessons = getTotalLessons(course);

  const content = (
    <VStack
      align="flex-start"
      spacing={4}
      p={6}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor={course.available ? 'gray.200' : 'gray.100'}
      opacity={course.available ? 1 : 0.7}
      _hover={course.available ? { borderColor: 'blue.300', boxShadow: 'md', transform: 'translateY(-4px)' } : undefined}
      transition="all 0.2s"
      h="full"
      position="relative"
    >
      {!course.available && (
        <Badge position="absolute" top={4} right={4} colorScheme="gray" fontSize="xs">
          <HStack spacing={1}>
            <Icon as={FiLock} boxSize={3} />
            <Text>{t('comingSoon')}</Text>
          </HStack>
        </Badge>
      )}

      {/* Badges row */}
      <HStack spacing={2} flexWrap="wrap">
        {course.badge && (
          <Badge colorScheme={course.available ? 'blue' : 'gray'} fontSize="xs">
            {course.badge}
          </Badge>
        )}
        {showTrackBadge && course.track && (
          <Badge colorScheme={trackColors[course.track] || 'gray'} fontSize="xs" variant="subtle">
            {t(`catalog.filters.${course.track}`)}
          </Badge>
        )}
        {course.difficulty && (
          <Badge colorScheme={difficultyColors[course.difficulty] || 'gray'} fontSize="xs" variant="outline">
            {t(`catalog.filters.${course.difficulty}`)}
          </Badge>
        )}
        {course.totalXP && (
          <Badge colorScheme="yellow" fontSize="xs" variant="subtle">
            <HStack spacing={1}>
              <Icon as={FiStar} boxSize={2.5} />
              <Text>{course.totalXP} XP</Text>
            </HStack>
          </Badge>
        )}
      </HStack>

      <Heading as="h3" size="sm" fontWeight="700">
        {t(course.titleKey)}
      </Heading>

      <Text color="gray.600" fontSize="sm" lineHeight="tall" flex={1}>
        {t(course.descriptionKey)}
      </Text>

      {course.available && (
        <>
          <HStack spacing={4} color="gray.500" fontSize="xs">
            <HStack spacing={1}>
              <Icon as={FiBookOpen} boxSize={3.5} />
              <Text>{totalLessons} {t('lessons')}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiClock} boxSize={3.5} />
              <Text>{t(course.durationKey)}</Text>
            </HStack>
          </HStack>
          <ProgressBar value={progress} />
        </>
      )}
    </VStack>
  );

  if (!course.available) {
    return <Box>{content}</Box>;
  }

  return (
    <Box as={Link} to={lp(`/treinamento/${course.slug}`)} _hover={{ textDecoration: 'none' }}>
      {content}
    </Box>
  );
}
