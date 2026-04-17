import { Box, Container, Heading, Text, Button, HStack, Flex, VStack, Badge, SimpleGrid, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiArrowDown, FiCheck, FiShield, FiZap, FiLayers } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { GradientText } from '../shared/GradientText';

const MotionBox = motion(Box);

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

const BLOCK_COLORS = ['#734B9C', '#25D366', '#FDC234', '#5B9BD5', '#FE8342', '#28A745'];

function FloatingBlock({ delay, color, x, y }: { delay: number; color: string; x: number; y: number }) {
  return (
    <MotionBox
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ 
        opacity: [0.3, 0.7, 0.3], 
        scale: [1, 1.1, 1],
        y: [0, -10, 0]
      }}
      transition={{ 
        duration: 4, 
        delay, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Box
        w={{ base: '40px', md: '60px' }}
        h={{ base: '40px', md: '60px' }}
        bg={color}
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow={`0 4px 20px ${color}40`}
      >
        <Icon as={FiLayers} color="white" boxSize={{ base: 4, md: 6 }} />
      </Box>
    </MotionBox>
  );
}

function ConnectedBlocksAnimation() {
  return (
    <Box position="relative" w="100%" h={{ base: '200px', md: '300px' }}>
      {/* Floating blocks */}
      <FloatingBlock delay={0} color={BLOCK_COLORS[0]} x={10} y={10} />
      <FloatingBlock delay={0.5} color={BLOCK_COLORS[1]} x={30} y={20} />
      <FloatingBlock delay={1} color={BLOCK_COLORS[2]} x={50} y={10} />
      <FloatingBlock delay={1.5} color={BLOCK_COLORS[3]} x={70} y={25} />
      <FloatingBlock delay={2} color={BLOCK_COLORS[4]} x={85} y={15} />
      <FloatingBlock delay={0.3} color={BLOCK_COLORS[5]} x={20} y={50} />
      <FloatingBlock delay={0.8} color={BLOCK_COLORS[0]} x={60} y={55} />
      <FloatingBlock delay={1.3} color={BLOCK_COLORS[1]} x={80} y={50} />
      
      {/* Connection lines - animated */}
      <MotionBox
        position="absolute"
        top="50%"
        left="10%"
        w="80%"
        h="2px"
        bg="linear-gradient(90deg, transparent, brand.400, whatsapp.500, brand.400, transparent)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        style={{ originX: 0 }}
      />
      
      <MotionBox
        position="absolute"
        top="30%"
        left="25%"
        w="50%"
        h="2px"
        bg="linear-gradient(90deg, transparent, brand.400, transparent)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
        style={{ originX: 0 }}
      />
    </Box>
  );
}

export function DeterminismHero() {
  const { t } = useTranslation('determinism');

  return (
    <Box
      position="relative"
      bg="hero.bg"
      overflow="hidden"
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Radial gradients */}
      <Box
        position="absolute"
        top="-20%"
        left="50%"
        transform="translateX(-50%)"
        w="120%"
        h="120%"
        bgGradient="radial(circle at 30% 40%, rgba(115, 75, 156, 0.3) 0%, rgba(115, 75, 156, 0.05) 40%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(37, 211, 102, 0.15) 0%, transparent 60%)"
        pointerEvents="none"
      />

      <Container maxW="1280px" position="relative" zIndex={1} flex={1} display="flex" flexDirection="column" py={{ base: 8, md: 16 }}>
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 10, lg: 16 }}
          flex={1}
        >
          {/* Left content */}
          <VStack align="flex-start" spacing={6} maxW="600px" flex={1}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                bg="whiteAlpha.100"
                color="whatsapp.400"
                px={4}
                py={1.5}
                borderRadius="full"
                fontSize="sm"
                fontWeight="600"
              >
                {t('hero.badge')}
              </Badge>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="800"
                color="white"
                lineHeight="1.1"
              >
                {t('hero.headline')}{' '}
                <GradientText
                  gradient="linear(to-r, brand.300, whatsapp.400)"
                  fontSize="inherit"
                  fontWeight="inherit"
                >
                  {t('hero.headlineHighlight')}
                </GradientText>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="520px">
                {t('hero.subtitle')}
              </Text>
            </MotionBox>

            {/* Value props inline */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} w="100%">
                <HStack spacing={2}>
                  <Icon as={FiCheck} color="whatsapp.400" />
                  <Text color="whiteAlpha.800" fontSize="sm">{t('hero.benefits.0')}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiShield} color="whatsapp.400" />
                  <Text color="whiteAlpha.800" fontSize="sm">{t('hero.benefits.1')}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiZap} color="whatsapp.400" />
                  <Text color="whiteAlpha.800" fontSize="sm">{t('hero.benefits.2')}</Text>
                </HStack>
              </SimpleGrid>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  bg="whatsapp.600"
                  color="white"
                  _hover={{ bg: 'whatsapp.700', transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
                  leftIcon={<FiMessageCircle />}
                >
                  {t('hero.cta.whatsapp')}
                </Button>
                <Button
                  as="a"
                  href="#details"
                  size="lg"
                  variant="ghost"
                  color="whiteAlpha.800"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  rightIcon={<FiArrowDown />}
                >
                  {t('hero.cta.details')}
                </Button>
              </HStack>
            </MotionBox>
          </VStack>

          {/* Right visual - Connected Blocks */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            maxW="500px"
            flex={1}
            w="100%"
            display={{ base: 'none', md: 'block' }}
          >
            <ConnectedBlocksAnimation />
          </MotionBox>
        </Flex>

        {/* Stats row */}
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          mt={{ base: 10, md: 16 }}
        >
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 8 }}>
            {[
              { value: '60+', label: t('hero.stats.0.label') },
              { value: '100%', label: t('hero.stats.1.label') },
              { value: '0ms', label: t('hero.stats.2.label') },
              { value: '24/7', label: t('hero.stats.3.label') },
            ].map((stat, i) => (
              <VStack key={i} spacing={1}>
                <Text fontSize={{ base: '2xl', md: '4xl' }} fontWeight="800" color="white">
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="whiteAlpha.600" textAlign="center">
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
}
