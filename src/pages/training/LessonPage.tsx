import {
  Container, Heading, Text, VStack, HStack, Button, Icon, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Box, Progress,
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

  // Find all lessons and current position
  const allLessons: { moduleSlug: string; lessonSlug: string }[] = [];
  for (const m of course.modules) {
    for (const l of m.lessons) {
      allLessons.push({ moduleSlug: m.slug, lessonSlug: l.slug });
    }
  }
  const currentIndex = allLessons.findIndex(
    (l) => l.moduleSlug === mod.slug && l.lessonSlug === lesson.slug,
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Progress
  const progressPercent = allLessons.length > 0 ? ((currentIndex + 1) / allLessons.length) * 100 : 0;
  const blockCount = lesson.contentBlocks?.length || 0;

  const contentKey = `content.${course.slug}.${mod.slug}.${lesson.slug}`;

  const handleComplete = () => {
    completeLesson(course.slug, mod.slug, lesson.slug, course.modules);
    if (nextLesson) {
      navigate(lp(`/treinamento/${course.slug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`));
    }
  };

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Fixed Progress Bar */}
      <Box position="sticky" top={0} zIndex={10} bg="white" borderBottom="1px solid" borderColor="gray.100">
        <Progress
          value={progressPercent}
          size="xs"
          colorScheme="purple"
          bg="gray.100"
        />
        <Flex maxW="1100px" mx="auto" px={6} py={2} align="center" justify="space-between">
          <Text fontSize="2xs" color="gray.500">
            Licao {currentIndex + 1} de {allLessons.length}
            {blockCount > 0 && ` \u00B7 ${blockCount} blocos`}
          </Text>
          <Text fontSize="2xs" color="gray.500">
            {Math.round(progressPercent)}% concluido
          </Text>
        </Flex>
      </Box>

      <Container maxW="1100px" py={8} px={6}>
        <VStack spacing={6} align="stretch">
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

          {/* Lesson Content - no wrapper card, each block has its own styling */}
          <LessonContent
            contentKey={contentKey}
            contentBlocks={lesson.contentBlocks}
            courseSlug={course.slug}
            moduleSlug={mod.slug}
            lessonSlug={lesson.slug}
          />

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
    </Box>
  );
}

export function LessonPage() {
  return (
    <ProtectedRoute>
      <LessonPageContent />
    </ProtectedRoute>
  );
}
