import { VStack, Heading, Text, HStack, Box } from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { MotionBox, fadeInUp } from '../motion';
import { GradientText } from './GradientText';

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: IconType;
  heading: string;
  headingGradient?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  dark?: boolean;
  gradient?: string;
}

export function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  heading,
  headingGradient,
  subtitle,
  align = 'center',
  dark = false,
  gradient,
}: SectionHeaderProps) {
  return (
    <MotionBox {...fadeInUp}>
      <VStack
        spacing={4}
        textAlign={align}
        align={align === 'left' ? 'flex-start' : 'center'}
        mb={{ base: 10, md: 14 }}
      >
        {badge && (
          <HStack
            bg={dark ? 'whiteAlpha.100' : 'brand.50'}
            px={4}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor={dark ? 'whiteAlpha.200' : 'brand.100'}
            spacing={2}
          >
            {BadgeIcon && <Box as={BadgeIcon} color={dark ? 'brand.300' : 'brand.500'} boxSize={4} />}
            <Text
              color={dark ? 'brand.300' : 'brand.500'}
              fontSize="sm"
              fontWeight="600"
            >
              {badge}
            </Text>
          </HStack>
        )}

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color={dark ? 'white' : undefined}
          lineHeight="1.2"
        >
          {heading}{' '}
          {headingGradient && (
            <GradientText
              gradient={gradient || 'linear(to-r, brand.400, brand.500, catalisa.accent)'}
              fontSize="inherit"
              fontWeight="inherit"
            >
              {headingGradient}
            </GradientText>
          )}
        </Heading>

        {subtitle && (
          <Text
            color={dark ? 'whiteAlpha.600' : 'gray.500'}
            fontSize={{ base: 'md', md: 'lg' }}
            maxW="600px"
            lineHeight="1.7"
          >
            {subtitle}
          </Text>
        )}
      </VStack>
    </MotionBox>
  );
}
