import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';

export function NotFound() {
  const { t } = useTranslation('common');

  return (
    <>
      <SEOHead pageKey="notFound" noIndex />
      <Box bg="hero.bg" minH="60vh" display="flex" alignItems="center" justifyContent="center" px={4}>
        <VStack spacing={6} textAlign="center">
          <Heading
            fontSize={{ base: '8xl', md: '9xl' }}
            fontWeight="800"
            bgGradient="linear(to-r, brand.400, brand.600)"
            bgClip="text"
          >
            404
          </Heading>
          <Heading as="h1" fontSize={{ base: 'xl', md: '2xl' }} color="white">
            {t('notFound.title')}
          </Heading>
          <Text color="whiteAlpha.700" maxW="md" fontSize="lg">
            {t('notFound.description')}
          </Text>
          <Button
            as={RouterLink}
            to="/"
            size="lg"
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
          >
            {t('notFound.backHome')}
          </Button>
        </VStack>
      </Box>
    </>
  );
}
