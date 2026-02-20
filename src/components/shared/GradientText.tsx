import { Text, type TextProps } from '@chakra-ui/react';

interface GradientTextProps extends TextProps {
  gradient?: string;
}

export function GradientText({
  gradient = 'linear(to-r, brand.400, brand.500, catalisa.accent)',
  children,
  ...props
}: GradientTextProps) {
  return (
    <Text
      as="span"
      bgGradient={gradient}
      bgClip="text"
      {...props}
    >
      {children}
    </Text>
  );
}
