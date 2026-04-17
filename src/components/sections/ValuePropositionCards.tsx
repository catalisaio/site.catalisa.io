import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Icon, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiShield, FiZap, FiTrendingUp, FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

const CARDS = [
  {
    icon: FiShield,
    color: '#734B9C',
    bg: 'purple.50',
  },
  {
    icon: FiZap,
    color: '#25D366',
    bg: 'green.50',
  },
  {
    icon: FiTrendingUp,
    color: '#FDC234',
    bg: 'yellow.50',
  },
];

function ValueCard({ index, icon, color, bg }: { index: number; icon: React.ElementType; color: string; bg: string }) {
  const { t } = useTranslation('determinism');
  const cards = t('valueProps.cards', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.100"
        h="100%"
        _hover={{ 
          borderColor: color, 
          boxShadow: `0 20px 60px ${color}15` 
        }}
        transition="all 0.3s"
      >
        <VStack align="flex-start" spacing={4}>
          <Box
            p={4}
            borderRadius="xl"
            bg={bg}
          >
            <Icon as={icon} boxSize={8} color={color} />
          </Box>
          
          <Heading as="h3" size="md" fontWeight="700">
            {cards[index].title}
          </Heading>
          
          <Text color="gray.500" lineHeight="1.7">
            {cards[index].description}
          </Text>

          <HStack spacing={2} color={color} fontSize="sm" fontWeight="600" pt={2}>
            <Icon as={FiCheck} />
            <Text>{t('valueProps.included')}</Text>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}

export function ValuePropositionCards() {
  const { t } = useTranslation('determinism');

  return (
    <Box bg="gray.50" py={{ base: 12, md: 20 }}>
      <Container maxW="1200px">
        <VStack spacing={4} mb={12} textAlign="center">
          <Badge colorScheme="brand" fontSize="xs" px={3} py={1} borderRadius="full">
            {t('valueProps.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800" maxW="700px">
            {t('valueProps.heading')}
          </Heading>
          <Text color="gray.500" maxW="600px" fontSize="lg">
            {t('valueProps.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} maxW="1000px" mx="auto">
          {CARDS.map((card, i) => (
            <ValueCard key={i} index={i} {...card} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
