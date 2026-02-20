import { Flex, type FlexProps } from '@chakra-ui/react';
import { usePresentationColors } from './PresentationThemeContext';

interface SlideProps extends FlexProps {
  bgGradient?: string;
  bgImage?: string;
}

export function Slide({ children, bg, bgGradient, bgImage, color, ...props }: SlideProps) {
  const c = usePresentationColors();

  return (
    <Flex
      w="100vw"
      h="100vh"
      position="relative"
      direction="column"
      align="center"
      justify="center"
      overflow="hidden"
      color={color ?? c.textPrimary}
      bg={bg}
      bgGradient={bgGradient}
      bgImage={bgImage}
      bgSize="cover"
      bgPosition="center"
      px={{ base: 6, md: 10, lg: 16 }}
      py={{ base: 6, md: 8 }}
      transition="background-color 0.3s ease, color 0.3s ease"
      {...props}
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        maxW="1200px"
        w="full"
        h="full"
        position="relative"
        zIndex={1}
      >
        {children}
      </Flex>
    </Flex>
  );
}
