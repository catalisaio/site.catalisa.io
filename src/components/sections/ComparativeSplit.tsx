import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Icon, Badge, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiX, FiCheck, FiMessageCircle, FiCpu, FiArrowRight, FiZap, FiRepeat, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

function ComparisonCard({ type }: { type: 'other' | 'catalisa' }) {
  const { t } = useTranslation('determinism');
  const isCatalisa = type === 'catalisa';

  const statusItems = isCatalisa
    ? t('comparison.catalisa.status', { returnObjects: true }) as string[]
    : t('comparison.other.status', { returnObjects: true }) as string[];

  const accent = isCatalisa ? 'whatsapp.400' : 'red.300';
  const title = isCatalisa ? t('comparison.catalisa.title') : t('comparison.other.title');
  const processorLabel = isCatalisa ? 'Building Blocks' : 'AI Generation';
  const outcomeLabel = isCatalisa ? t('comparison.outputSuccess') : t('comparison.outputUncertain');

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      bg="whiteAlpha.60"
      backdropFilter="blur(8px)"
      borderRadius="2xl"
      border="1px solid"
      borderColor={isCatalisa ? 'green.200' : 'whiteAlpha.300'}
      boxShadow={isCatalisa ? '0 22px 56px rgba(37, 211, 102, 0.14)' : '0 18px 46px rgba(0, 0, 0, 0.12)'}
      p={{ base: 5, md: 6 }}
    >
      <HStack mb={5} spacing={3} align="center">
        <Box
          p={2.5}
          borderRadius="lg"
          bg={isCatalisa ? 'green.50' : 'gray.100'}
          border="1px solid"
          borderColor={isCatalisa ? 'green.200' : 'gray.200'}
        >
          <Icon as={isCatalisa ? FiShield : FiRepeat} color={isCatalisa ? 'green.600' : 'gray.600'} boxSize={5} />
        </Box>
        <VStack align="flex-start" spacing={0}>
          <Heading size="md" color="gray.800">{title}</Heading>
          <Text fontSize="xs" color={isCatalisa ? 'green.700' : 'gray.500'} fontWeight="600">
            {isCatalisa ? t('comparison.catalisa.badge') : 'Probabilístico'}
          </Text>
        </VStack>
      </HStack>

      <VStack spacing={4} align="stretch" mb={5}>
        <HStack justify="space-between" spacing={2}>
          <HStack
            px={3}
            py={2}
            borderRadius="lg"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            flex={1}
          >
            <Icon as={FiMessageCircle} color="gray.500" />
            <Text fontSize="sm" color="gray.700">Mensagem recebida</Text>
          </HStack>
          <Icon as={FiArrowRight} color="gray.400" boxSize={4} />
          <HStack
            px={3}
            py={2}
            borderRadius="lg"
            bg="white"
            border="1px solid"
            borderColor={isCatalisa ? 'green.200' : 'gray.200'}
            flex={1}
          >
            <Icon as={isCatalisa ? FiZap : FiCpu} color={isCatalisa ? 'green.600' : 'gray.500'} />
            <Text fontSize="sm" color="gray.700">{processorLabel}</Text>
          </HStack>
        </HStack>

        <HStack
          px={3}
          py={2.5}
          borderRadius="lg"
          bg={isCatalisa ? 'green.50' : 'orange.50'}
          border="1px solid"
          borderColor={isCatalisa ? 'green.200' : 'orange.200'}
          justify="space-between"
        >
          <HStack spacing={2}>
            <Icon as={isCatalisa ? FiCheck : FiX} color={isCatalisa ? 'green.600' : 'orange.600'} />
            <Text fontSize="sm" fontWeight="600" color={isCatalisa ? 'green.700' : 'orange.700'}>
              {outcomeLabel}
            </Text>
          </HStack>
          <Box w="36px" h="2px" bg={accent} borderRadius="full" />
        </HStack>
      </VStack>

      <Divider borderColor="gray.200" mb={3} />

      <VStack align="stretch" spacing={0}>
        {statusItems.map((status, i) => (
          <HStack key={i} py={2.5} borderBottom={i < statusItems.length - 1 ? '1px solid' : 'none'} borderColor="gray.100">
            <Icon as={isCatalisa ? FiCheck : FiX} color={isCatalisa ? 'green.500' : 'red.400'} />
            <Text fontSize="sm" color="gray.600" fontWeight={isCatalisa ? '600' : '500'}>
              {status}
            </Text>
          </HStack>
        ))}
      </VStack>
    </MotionBox>
  );
}

export function ComparativeSplit() {
  const { t } = useTranslation('determinism');

  return (
    <Box
      bg="hero.bg"
      py={{ base: 14, md: 22 }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-10%"
        left="50%"
        transform="translateX(-50%)"
        w="70%"
        h="65%"
        bgGradient="radial(circle, rgba(115, 75, 156, 0.18) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Container maxW="1200px">
        <VStack spacing={4} mb={12} textAlign="center" position="relative" zIndex={1}>
          <Badge bg="whiteAlpha.100" color="brand.300" fontSize="xs" px={4} py={1.5} borderRadius="full" border="1px solid" borderColor="whiteAlpha.300">
            {t('comparison.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800" color="white" maxW="760px" lineHeight="1.2">
            {t('comparison.heading')}
          </Heading>
          <Text color="whiteAlpha.700" maxW="620px" fontSize="lg" lineHeight="1.7">
            {t('comparison.subtitle')}
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={7} maxW="1050px" mx="auto" position="relative" zIndex={1}>
          <ComparisonCard type="other" />
          <ComparisonCard type="catalisa" />
        </SimpleGrid>

        {/* Bottom insight */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          mt={10}
          textAlign="center"
          position="relative"
          zIndex={1}
        >
          <Text color="whiteAlpha.600" fontSize="sm">
            {t('comparison.insight')}
          </Text>
        </MotionBox>
      </Container>
    </Box>
  );
}
