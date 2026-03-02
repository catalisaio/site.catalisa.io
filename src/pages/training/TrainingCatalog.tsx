import { Container, Heading, Text, VStack, SimpleGrid, HStack, Icon, Button } from '@chakra-ui/react';
import { FiBookOpen, FiLogOut } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { CourseCard } from '../../components/training/CourseCard';
import { useTrainingProgress } from '../../hooks/useTrainingProgress';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { courses } from '../../data/trainingCourses';

function CatalogContent() {
  const { t } = useTranslation('training');
  const { getCourseProgress } = useTrainingProgress();
  const { user, signOut } = useSupabaseAuth();

  return (
    <Container maxW="1100px" py={12}>
      <VStack spacing={10} align="stretch">
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

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              progress={course.available ? getCourseProgress(course.slug, course.modules) : 0}
            />
          ))}
        </SimpleGrid>
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
