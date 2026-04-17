import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { PERSONAS, type PersonaKey } from '../../data/vtexDay2026';

const MotionBox = motion(Box);

export function VtexDayPersonaSelector() {
  const { t } = useTranslation('vtex-day-2026');
  const [active, setActive] = useState<PersonaKey>('lojista');

  const current = PERSONAS.find((p) => p.key === active)!;

  const onSelect = (key: PersonaKey) => {
    setActive(key);
    if (typeof window !== 'undefined' && 'dataLayer' in window) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: 'persona_selected',
        persona: key,
        page: '/vtex-day-2026',
      });
    }
  };

  return (
    <Box as="section" id="vtex-day-persona" py={{ base: 16, md: 24 }} bg="bg-accent">
      <Container maxW="1100px">
        <VStack spacing={4} textAlign="center" mb={10}>
          <Heading as="h2" size={{ base: 'lg', md: 'xl' }} color="text-primary">
            {t('persona.heading')}
          </Heading>
          <Text color="text-secondary" fontSize="md" maxW="560px">
            {t('persona.whyWeAsk')}
          </Text>
        </VStack>

        <Wrap spacing={3} justify="center" mb={10}>
          {PERSONAS.map((persona) => {
            const isActive = persona.key === active;
            return (
              <WrapItem key={persona.key}>
                <Button
                  onClick={() => onSelect(persona.key)}
                  variant="ghost"
                  size="lg"
                  bg={isActive ? 'brand.500' : 'transparent'}
                  color={isActive ? 'white' : 'text-primary'}
                  border="1px solid"
                  borderColor={isActive ? 'brand.500' : 'border-default'}
                  _hover={{
                    bg: isActive ? 'brand.600' : 'brand.50',
                    color: isActive ? 'white' : 'brand.700',
                  }}
                  px={6}
                  leftIcon={<Text fontSize="lg">{persona.icon}</Text>}
                  borderRadius="full"
                  fontWeight="600"
                >
                  {persona.label}
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>

        <AnimatePresence mode="wait">
          <MotionBox
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            bg="bg-card"
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            boxShadow="0 20px 50px -20px rgba(115,75,156,0.25)"
            border="1px solid"
            borderColor="border-default"
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              color="brand.500"
              textTransform="uppercase"
              letterSpacing="wide"
              mb={2}
            >
              {current.label}
            </Text>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="text-primary" fontWeight="600" mb={6}>
              {current.subtitle}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              {current.pains.map((pain, i) => (
                <VStack
                  key={i}
                  align="flex-start"
                  spacing={3}
                  bg="bg-accent"
                  borderRadius="lg"
                  p={5}
                  border="1px solid"
                  borderColor="border-default"
                  h="full"
                >
                  <Text fontSize="sm" color="text-muted" fontWeight="600">
                    {pain.question}
                  </Text>
                  <HStack spacing={2} align="flex-start">
                    <Icon as={FiArrowRight} color="whatsapp.500" boxSize={4} mt={1} flexShrink={0} />
                    <Text fontSize="sm" color="text-primary">
                      {pain.answer}
                    </Text>
                  </HStack>
                </VStack>
              ))}
            </SimpleGrid>

            <Text
              mt={6}
              fontSize="xs"
              color="text-muted"
              textAlign="center"
              fontFamily="mono"
              letterSpacing="wide"
            >
              {current.microCopy}
            </Text>
          </MotionBox>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
