import { Container, Heading, Text, VStack, HStack, Icon, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { FiChevronRight, FiClock, FiBookOpen } from 'react-icons/fi';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { ModuleCard } from '../../components/training/ModuleCard';
import { ProgressBar } from '../../components/training/ProgressBar';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { getCourse, getTotalLessons, getTotalDuration } from '../../data/trainingCourses';

function CourseContent() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const { t } = useTranslation('training');
  const lp = useLocalizedPath();
  const { getModuleProgress, getCourseProgress, isLessonComplete } = useTrainingProgress();

  const course = courseSlug ? getCourse(courseSlug) : undefined;

  if (!course || !course.available) {
    return <Navigate to={lp('/treinamento')} replace />;
  }

  const totalLessons = getTotalLessons(course);
  const totalDuration = getTotalDuration(course);
  const courseProgress = getCourseProgress(course.slug, course.modules);

  return (
    <Container maxW="800px" py={12}>
      <VStack spacing={8} align="stretch">
        <Breadcrumb separator={<FiChevronRight />} fontSize="sm" color="gray.500">
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={lp('/treinamento')}>{t('catalog.heading')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{t(course.titleKey)}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack align="flex-start" spacing={3}>
          {course.badge && (
            <Badge colorScheme="blue" fontSize="xs">{course.badge}</Badge>
          )}
          <Heading size="lg">{t(course.titleKey)}</Heading>
          <Text color="gray.600" fontSize="sm" lineHeight="tall">
            {t(course.descriptionKey)}
          </Text>
          <HStack spacing={4} color="gray.500" fontSize="sm">
            <HStack spacing={1}>
              <Icon as={FiBookOpen} boxSize={4} />
              <Text>{totalLessons} {t('lessons')}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiClock} boxSize={4} />
              <Text>{totalDuration} min</Text>
            </HStack>
          </HStack>
          <ProgressBar value={courseProgress} size="md" />
        </VStack>

        <VStack spacing={4} align="stretch">
          {course.modules.map((mod, i) => (
            <ModuleCard
              key={mod.slug}
              courseSlug={course.slug}
              module={mod}
              index={i}
              progress={getModuleProgress(course.slug, mod.slug, mod.lessons.map((l) => l.slug))}
              isLessonComplete={isLessonComplete}
            />
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

export function CourseDetail() {
  return (
    <ProtectedRoute>
      <CourseContent />
    </ProtectedRoute>
  );
}
