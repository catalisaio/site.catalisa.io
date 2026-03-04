import { useState, useCallback } from 'react';
import {
  Text, HStack, Icon, Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Box,
} from '@chakra-ui/react';
import { FiChevronRight, FiClock, FiX } from 'react-icons/fi';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { LessonContent } from '../../components/training/LessonContent';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { useTrainingSession } from '../../hooks/useTrainingSession';
import { getCourse, getModule, getLesson } from '../../data/trainingCourses';

// Height of the site's fixed header (from PageLayout pt="64px")
const SITE_HEADER_H = 64;
// Height of slide nav footer (dots + buttons + padding)
const NAV_FOOTER_H = 72;

function LessonPageContent() {
  const { courseSlug, moduleSlug, lessonSlug } = useParams<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>();
  const { t } = useTranslation('training');
  const lp = useLocalizedPath();
  const { isLessonComplete, completeLesson } = useTrainingProgress();
  useTrainingSession(courseSlug, moduleSlug, lessonSlug);

  const course = courseSlug ? getCourse(courseSlug) : undefined;
  const mod = course && moduleSlug ? getModule(course, moduleSlug) : undefined;
  const lesson = mod && lessonSlug ? getLesson(mod, lessonSlug) : undefined;

  // Slide progress state (updated by LessonContent callback)
  const [slideInfo, setSlideInfo] = useState({ current: 0, total: 1 });

  const handleSlideChange = useCallback((current: number, total: number) => {
    setSlideInfo({ current, total });
  }, []);

  if (!course || !mod || !lesson) {
    return <Navigate to={lp('/treinamento')} replace />;
  }

  const completed = isLessonComplete(course.slug, mod.slug, lesson.slug);

  // Find next lesson for navigation after completion
  const allLessons: { moduleSlug: string; lessonSlug: string }[] = [];
  for (const m of course.modules) {
    for (const l of m.lessons) {
      allLessons.push({ moduleSlug: m.slug, lessonSlug: l.slug });
    }
  }
  const currentIndex = allLessons.findIndex(
    (l) => l.moduleSlug === mod.slug && l.lessonSlug === lesson.slug,
  );
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const contentKey = `content.${course.slug}.${mod.slug}.${lesson.slug}`;

  // Mark lesson complete (no navigation — the completion slide handles navigation)
  const handleComplete = () => {
    completeLesson(course.slug, mod.slug, lesson.slug, course.modules);
  };

  // URLs for the completion slide
  const nextLessonUrl = nextLesson
    ? lp(`/treinamento/${course.slug}/${nextLesson.moduleSlug}/${nextLesson.lessonSlug}`)
    : undefined;
  const courseUrl = lp(`/treinamento/${course.slug}`);
  const catalogUrl = lp('/treinamento');

  // Segmented progress: each slide is one segment
  const segmentProgress = slideInfo.total > 0
    ? ((slideInfo.current + 1) / slideInfo.total) * 100
    : 0;

  return (
    <Box
      bg="gray.50"
      mt={`-${SITE_HEADER_H}px`}
      pt={`${SITE_HEADER_H}px`}
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      position="relative"
    >
      {/* Lesson Header */}
      <Box
        flexShrink={0}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.100"
        zIndex={10}
      >
        {/* Segmented progress bar */}
        <Box h="3px" bg="gray.100" w="full">
          <Box
            h="full"
            bg="purple.500"
            w={`${segmentProgress}%`}
            transition="width 0.3s ease"
            borderRadius="full"
          />
        </Box>

        <Flex px={4} py={1.5} align="center" justify="space-between" maxW="1200px" mx="auto" w="full">
          {/* Left: breadcrumb */}
          <HStack spacing={3} flex="1" minW={0}>
            <Breadcrumb
              separator={<FiChevronRight size={10} />}
              fontSize="xs"
              color="gray.400"
              display={{ base: 'none', md: 'flex' }}
            >
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to={lp(`/treinamento/${course.slug}`)}>
                  {t(course.titleKey)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontWeight="500" color="gray.600">
                  {t(lesson.titleKey)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Badge colorScheme="blue" fontSize="2xs" display={{ base: 'inline-flex', md: 'none' }}>
              {t(mod.titleKey)}
            </Badge>
          </HStack>

          {/* Center: slide counter */}
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.500" fontWeight="500">
              {slideInfo.current + 1} / {slideInfo.total}
            </Text>
            <HStack spacing={1} color="gray.400" fontSize="2xs">
              <Icon as={FiClock} boxSize={3} />
              <Text>{lesson.durationMin} min</Text>
            </HStack>
          </HStack>

          {/* Right: close button */}
          <Flex flex="1" justify="flex-end">
            <Box
              as={Link}
              to={lp(`/treinamento/${course.slug}`)}
              color="gray.400"
              _hover={{ color: 'gray.600' }}
              p={1}
            >
              <Icon as={FiX} boxSize={4} />
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Slide Content */}
      <Box flex="1" overflow="hidden" pb={`${NAV_FOOTER_H}px`}>
        <LessonContent
          contentKey={contentKey}
          contentBlocks={lesson.contentBlocks}
          courseSlug={course.slug}
          moduleSlug={mod.slug}
          lessonSlug={lesson.slug}
          onComplete={handleComplete}
          isCompleted={completed}
          onSlideChange={handleSlideChange}
          nextLessonUrl={nextLessonUrl}
          courseUrl={courseUrl}
          catalogUrl={catalogUrl}
          lessonTitle={t(lesson.titleKey)}
        />
      </Box>
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
