import { Box, Heading, Text, HStack, VStack, Icon } from '@chakra-ui/react';
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { ProgressBar } from './ProgressBar';
import type { Module } from '../../data/trainingCourses';

interface ModuleCardProps {
  courseSlug: string;
  module: Module;
  index: number;
  progress: number;
  isLessonComplete: (courseSlug: string, moduleSlug: string, lessonSlug: string) => boolean;
}

export function ModuleCard({ courseSlug, module, index, progress, isLessonComplete }: ModuleCardProps) {
  const { t } = useTranslation('training');
  const lp = useLocalizedPath();
  const totalMin = module.lessons.reduce((acc, l) => acc + l.durationMin, 0);

  return (
    <VStack
      align="flex-start"
      spacing={4}
      p={6}
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
    >
      <HStack justify="space-between" w="full">
        <HStack spacing={3}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg={progress === 100 ? 'green.100' : 'blue.50'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            fontWeight="700"
            color={progress === 100 ? 'green.600' : 'blue.600'}
          >
            {index + 1}
          </Box>
          <VStack align="flex-start" spacing={0}>
            <Heading as="h4" size="xs" fontWeight="700">
              {t(module.titleKey)}
            </Heading>
            <Text color="gray.500" fontSize="xs">{t(module.descriptionKey)}</Text>
          </VStack>
        </HStack>
        <HStack spacing={1} color="gray.400" fontSize="xs">
          <Icon as={FiClock} boxSize={3} />
          <Text>{totalMin} min</Text>
        </HStack>
      </HStack>

      <ProgressBar value={progress} size="sm" />

      <VStack align="flex-start" spacing={2} w="full" pl={2}>
        {module.lessons.map((lesson) => {
          const completed = isLessonComplete(courseSlug, module.slug, lesson.slug);
          return (
            <HStack
              key={lesson.slug}
              as={Link}
              to={lp(`/treinamento/${courseSlug}/${module.slug}/${lesson.slug}`)}
              spacing={2}
              w="full"
              p={2}
              borderRadius="md"
              _hover={{ bg: 'gray.50' }}
              transition="background 0.15s"
            >
              <Icon
                as={completed ? FiCheckCircle : FiCircle}
                color={completed ? 'green.400' : 'gray.300'}
                boxSize={4}
              />
              <Text fontSize="sm" color={completed ? 'gray.700' : 'gray.600'} flex={1}>
                {t(lesson.titleKey)}
              </Text>
              <Text fontSize="xs" color="gray.400">{lesson.durationMin} min</Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}
