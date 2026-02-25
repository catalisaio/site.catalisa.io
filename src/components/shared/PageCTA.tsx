import { Box, Container, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import { MotionBox, fadeInUp } from '../motion';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

interface PageCTAProps {
  heading: string;
  subtitle?: string;
  primaryCTA: {
    label: string;
    href?: string;
    icon?: IconType;
  };
  secondaryCTA?: {
    label: string;
    to: string;
  };
  bg?: string;
}

export function PageCTA({
  heading,
  subtitle,
  primaryCTA,
  secondaryCTA,
  bg = 'brand.50',
}: PageCTAProps) {
  const PrimaryIcon = primaryCTA.icon || FiMessageCircle;

  return (
    <Box as="section" bg={bg}>
      <Container maxW="1280px" py={{ base: 16, md: 20 }}>
        <MotionBox {...fadeInUp}>
          <VStack
            spacing={6}
            textAlign="center"
            maxW="600px"
            mx="auto"
            p={{ base: 8, md: 12 }}
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="lg"
          >
            <Heading as="h2" size="lg" fontWeight="800">
              {heading}
            </Heading>

            {subtitle && (
              <Text color="gray.500" fontSize="md" lineHeight="1.7">
                {subtitle}
              </Text>
            )}

            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as="a"
                href={primaryCTA.href || WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                bg="whatsapp.500"
                color="white"
                _hover={{
                  bg: 'whatsapp.600',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)',
                }}
                leftIcon={<PrimaryIcon />}
                transition="all 0.2s"
                fontWeight="700"
              >
                {primaryCTA.label}
              </Button>

              {secondaryCTA && (
                <Button
                  as={Link}
                  to={secondaryCTA.to}
                  size="lg"
                  variant="outline"
                  borderColor="brand.500"
                  color="brand.500"
                  _hover={{ bg: 'brand.50' }}
                  fontWeight="600"
                >
                  {secondaryCTA.label}
                </Button>
              )}
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
