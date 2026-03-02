import { Box, Container, Heading, Text, VStack, HStack, Button, Flex, SimpleGrid } from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MotionBox } from '../motion';
import { GradientText } from './GradientText';
import { AnimatedCounter } from './AnimatedCounter';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

interface CTAProps {
  label: string;
  href?: string;
  to?: string;
  icon?: IconType;
  variant?: 'whatsapp' | 'brand';
}

interface StatProps {
  value: string;
  label: string;
  numericValue?: number;
  suffix?: string;
  prefix?: string;
}

interface PageHeroProps {
  badge: string;
  badgeIcon?: IconType;
  heading: string;
  headingGradient?: string;
  subtitle: string;
  primaryCTA?: CTAProps;
  secondaryCTA?: CTAProps;
  stats?: StatProps[];
  accentColor?: string;
  gradient?: string;
  children?: ReactNode;
  heroId?: string;
}

export function PageHero({
  badge,
  badgeIcon: BadgeIcon,
  heading,
  headingGradient,
  subtitle,
  primaryCTA,
  secondaryCTA,
  stats,
  accentColor = 'brand',
  gradient,
  children,
  heroId,
}: PageHeroProps) {
  const hasVisual = !!children;
  const gradientStr = gradient || `linear(to-r, ${accentColor}.300, ${accentColor}.400, catalisa.accent)`;

  return (
    <Box
      id="hero"
      data-hero-id={heroId}
      bg="hero.bg"
      position="relative"
      overflow="hidden"
      minH={{ base: 'auto', lg: hasVisual ? '85vh' : 'auto' }}
      display="flex"
      alignItems="center"
    >
      {/* Background radial gradients */}
      <Box
        position="absolute"
        top="-20%"
        left="10%"
        w="60%"
        h="80%"
        bgGradient={`radial(circle, rgba(115, 75, 156, 0.08) 0%, transparent 60%)`}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="5%"
        w="40%"
        h="50%"
        bgGradient={`radial(circle, rgba(37, 211, 102, 0.04) 0%, transparent 60%)`}
        pointerEvents="none"
      />

      <Container maxW="1280px" py={{ base: 20, md: 28 }} position="relative" zIndex={1}>
        <Flex
          direction={{ base: 'column', lg: hasVisual ? 'row' : 'column' }}
          gap={{ base: 10, lg: 16 }}
          align="center"
          textAlign={hasVisual ? { base: 'center', lg: 'left' } : 'center'}
        >
          {/* Text Content */}
          <VStack
            spacing={6}
            flex={1}
            align={hasVisual ? { base: 'center', lg: 'flex-start' } : 'center'}
            maxW={hasVisual ? { lg: '560px' } : '800px'}
            mx={hasVisual ? undefined : 'auto'}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HStack
                bg="whiteAlpha.100"
                px={4}
                py={1.5}
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.200"
                spacing={2}
              >
                {BadgeIcon && <Box as={BadgeIcon} color={`${accentColor}.300`} boxSize={4} />}
                <Text color={`${accentColor}.300`} fontSize="sm" fontWeight="600">
                  {badge}
                </Text>
              </HStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.1"
              >
                {heading}{' '}
                {headingGradient && (
                  <GradientText gradient={gradientStr} fontSize="inherit" fontWeight="inherit">
                    {headingGradient}
                  </GradientText>
                )}
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Text
                color="whiteAlpha.700"
                fontSize={{ base: 'md', md: 'lg' }}
                lineHeight="1.7"
                maxW="600px"
              >
                {subtitle}
              </Text>
            </MotionBox>

            {/* CTAs */}
            {(primaryCTA || secondaryCTA) && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <HStack spacing={4} flexWrap="wrap" justify={hasVisual ? { base: 'center', lg: 'flex-start' } : 'center'}>
                  {primaryCTA && (
                    <Button
                      as="a"
                      href={primaryCTA.href || WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="lg"
                      bg={primaryCTA.variant === 'brand' ? `${accentColor}.500` : 'whatsapp.500'}
                      color="white"
                      _hover={{
                        bg: primaryCTA.variant === 'brand' ? `${accentColor}.600` : 'whatsapp.600',
                        transform: 'translateY(-2px)',
                        boxShadow: primaryCTA.variant === 'brand'
                          ? `0 8px 30px rgba(115, 75, 156, 0.4)`
                          : '0 8px 30px rgba(37, 211, 102, 0.4)',
                      }}
                      leftIcon={primaryCTA.icon ? <Box as={primaryCTA.icon} /> : <FiMessageCircle />}
                      transition="all 0.2s"
                      fontWeight="700"
                    >
                      {primaryCTA.label}
                    </Button>
                  )}
                  {secondaryCTA && (
                    <Button
                      as={secondaryCTA.to ? Link : 'a'}
                      {...(secondaryCTA.to ? { to: secondaryCTA.to } : { href: secondaryCTA.href })}
                      size="lg"
                      variant="ghost"
                      color="whiteAlpha.800"
                      borderColor="whiteAlpha.300"
                      border="1px solid"
                      _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                    >
                      {secondaryCTA.label}
                    </Button>
                  )}
                </HStack>
              </MotionBox>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                w="full"
              >
                <SimpleGrid
                  columns={{ base: stats.length > 2 ? 3 : stats.length, md: stats.length }}
                  spacing={{ base: 4, md: 8 }}
                  pt={4}
                  justifyItems={hasVisual ? { base: 'center', lg: 'start' } : 'center'}
                >
                  {stats.map((stat) => (
                    <VStack key={stat.label} spacing={0}>
                      {stat.numericValue !== undefined ? (
                        <AnimatedCounter
                          target={stat.numericValue}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          fontSize="3xl"
                          fontWeight="800"
                          color="white"
                        />
                      ) : (
                        <Text fontSize="3xl" fontWeight="800" color="white">
                          {stat.value}
                        </Text>
                      )}
                      <Text color="whiteAlpha.600" fontSize="xs">
                        {stat.label}
                      </Text>
                    </VStack>
                  ))}
                </SimpleGrid>
              </MotionBox>
            )}
          </VStack>

          {/* Visual (right side) */}
          {hasVisual && (
            <MotionBox
              flex={1}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              w="full"
              maxW={{ lg: '540px' }}
            >
              {children}
            </MotionBox>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
