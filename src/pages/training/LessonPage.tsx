import {
  Container, Heading, Text, VStack, HStack, Button, Icon, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Box,
} from '@chakra-ui/react';
import { FiChevronRight, FiChevronLeft, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { LessonContent } from '../../components/training/LessonContent';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { useTrainingSession } from '../../hooks/useTrainingSession';
import { getCourse, getModule, getLesson } from '../../data/trainingCourses';

function LessonPageContent() {
  const { courseSlug, moduleSlug, lessonSlug } = useParams<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>();
  const { t } = useTranslation('training');
  const lp = useLocalizedPath();
  const navigate = useNavigate();
  const { isLessonComplete, completeLesson } = useTrainingProgress();
  useTrainingSession(courseSlug, moduleSlug, lessonSlug);

  const course = courseSlug ? getCourse(courseSlug) : undefined;
  const mod = course && moduleSlug ? getModule(course, moduleSlug) : undefined;
  const lesson = mod && lessonSlug ? getLesson(mod, lessonSlug) : undefined;

  if (!course || !mod || !lesson) {
    return <Navigate to={lp('/treinamento')} replace />;
  }

  const completed = isLessonComplete(course.slug, mod.slug, lesson.slug);

  // Find next lesson (in this module or next module)
  const getAdjacentLesson = (direction: 'prev' | 'next') => {
    const allLessons: { moduleSlug: string; lessonSlug: string }[] = [];
    for (const m of course.modules) {
      for (const l of m.lessons) {
        allLessons.push({ moduleSlug: m.slug, lessonSlug: l.slug });
      }
    }
    const currentIndex = allLessons.findIndex(
      (l) => l.moduleSlug === mod.slug && l.lessonSlug === lesson.slug,
    );
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    return allLessons[targetIndex] || null;
  };

  const prevLesson = getAdjacentLesson('prev');
  const nextLesson = getAdjacentLesson('next');

  const contentKey = `content.${course.slug}.${mod.slug}.${lesson.slug}`;

  const handleComplete = () => {
    completeLesson(course.slug, mod.slug, lesson.slug, course.modules);
    if (nextLesson) {
      navigate(lp(`/treinamento/${course.slug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`));
    }
  };

  return (
    <Container maxW="800px" py={12}>
      <VStack spacing={8} align="stretch">
        <Breadcrumb separator={<FiChevronRight />} fontSize="sm" color="gray.500">
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={lp('/treinamento')}>{t('catalog.heading')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={lp(`/treinamento/${course.slug}`)}>
              {t(course.titleKey)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{t(lesson.titleKey)}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <VStack align="flex-start" spacing={2}>
          <HStack spacing={2}>
            <Badge colorScheme="blue" fontSize="xs">{t(mod.titleKey)}</Badge>
            <HStack spacing={1} color="gray.400" fontSize="xs">
              <Icon as={FiClock} boxSize={3} />
              <Text>{lesson.durationMin} min</Text>
            </HStack>
          </HStack>
          <Heading size="md">{t(lesson.titleKey)}</Heading>
        </VStack>

        <Box bg="white" p={6} borderRadius="xl" border="1px solid" borderColor="gray.200">
          <LessonContent
            contentKey={contentKey}
            contentBlocks={lesson.contentBlocks}
            courseSlug={course.slug}
            moduleSlug={mod.slug}
            lessonSlug={lesson.slug}
          />
        </Box>

        <Flex justify="space-between" align="center" pt={4}>
          {prevLesson ? (
            <Button
              as={Link}
              to={lp(`/treinamento/${course.slug}/${prevLesson.moduleSlug}/${prevLesson.lessonSlug}`)}
              variant="ghost"
              leftIcon={<FiChevronLeft />}
              size="sm"
            >
              {t('lesson.previous')}
            </Button>
          ) : (
            <Box />
          )}

          {completed ? (
            <HStack spacing={2} color="green.500" fontSize="sm">
              <Icon as={FiCheckCircle} />
              <Text fontWeight="600">{t('lesson.completed')}</Text>
            </HStack>
          ) : (
            <Button
              colorScheme="green"
              onClick={handleComplete}
              rightIcon={nextLesson ? <FiChevronRight /> : undefined}
              size="sm"
            >
              {nextLesson ? t('lesson.completeAndNext') : t('lesson.markComplete')}
            </Button>
          )}

          {nextLesson && completed ? (
            <Button
              as={Link}
              to={lp(`/treinamento/${course.slug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`)}
              variant="ghost"
              rightIcon={<FiChevronRight />}
              size="sm"
            >
              {t('lesson.next')}
            </Button>
          ) : (
            <Box />
          )}
        </Flex>
      </VStack>
    </Container>
  );
}

export function LessonPage() {
  return (
    <ProtectedRoute>
      <LessonPageContent />
    </ProtectedRoute>
  );
}
