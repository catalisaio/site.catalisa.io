import { Box, Container, Heading, Text, VStack, Flex, Badge, Image } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';

export function ProductScreenshot() {
  const { t } = useTranslation('workflows');
  return (
    <Box py={{ base: 16, lg: 20 }}>
      <Container maxW="1280px">
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 8, lg: 12 }}
          align="center"
        >
          {/* Text */}
          <VStack align="flex-start" spacing={4} flex={1} maxW={{ lg: '360px' }}>
            <Badge colorScheme="green" fontSize="xs" px={3} py={1} borderRadius="full">
              {t('screenshot.badge')}
            </Badge>
            <Heading as="h2" size="lg" fontWeight="800" lineHeight="1.2">
              {t('screenshot.heading')}{' '}
              <Text as="span" color="brand.500">{t('screenshot.headingHighlight')}</Text>
            </Heading>
            <Text color="gray.500" fontSize="sm" lineHeight="1.7">
              {t('screenshot.description')}
            </Text>
          </VStack>

          {/* Screenshot */}
          <MotionBox
            flex={2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box
              borderRadius="xl"
              overflow="hidden"
              boxShadow="2xl"
              border="1px solid"
              borderColor="gray.200"
            >
              <Image
                src="/screenshots/workflow-editor.png"
                alt="Editor visual de workflows do Catalisa mostrando Hub de Eventos Fan-out/Fan-in com execucao paralela"
                w="100%"
                h="auto"
                loading="lazy"
              />
            </Box>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
}
