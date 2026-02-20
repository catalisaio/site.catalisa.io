import { Heading, Text, VStack, Box, Flex, HStack, Icon, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiCpu, FiMessageCircle, FiCalendar, FiGlobe, FiUsers, FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { SectionWrapper } from '../shared/SectionWrapper';
import { MotionBox } from '../motion';

const orbitTools = [
  { icon: FiMessageCircle, label: 'WhatsApp', color: 'whatsapp.500' },
  { icon: FiUsers, label: 'CRM', color: 'orange.500' },
  { icon: FiCalendar, label: 'Calendario', color: 'blue.500' },
  { icon: FiGlobe, label: 'APIs', color: 'cyan.500' },
];

export function AIAgentsTeaser() {
  const { t } = useTranslation('home');
  const lp = useLocalizedPath();
  return (
    <SectionWrapper bg="gray.900">
      <Flex direction={{ base: 'column', lg: 'row' }} gap={12} align="center">
        {/* Left - Visual */}
        <Box flex={1} display="flex" justifyContent="center">
          <Box position="relative" w="280px" h="280px">
            {/* Center brain */}
            <MotionBox
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <Box
                p={6}
                borderRadius="2xl"
                bg="brand.500"
                boxShadow="0 0 60px rgba(115, 75, 156, 0.5)"
              >
                <Icon as={FiCpu} boxSize={10} color="white" />
              </Box>
            </MotionBox>

            {/* Orbiting tools */}
            {orbitTools.map((tool, i) => {
              const angle = (i * 90) * (Math.PI / 180);
              const radius = 110;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <MotionBox
                  key={tool.label}
                  position="absolute"
                  top="50%"
                  left="50%"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4, type: 'spring' }}
                  style={{ marginLeft: x - 24, marginTop: y - 24 }}
                >
                  <VStack spacing={1}>
                    <Box
                      p={3}
                      borderRadius="xl"
                      bg="whiteAlpha.100"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    >
                      <Icon as={tool.icon} boxSize={5} color={tool.color} />
                    </Box>
                    <Text fontSize="2xs" color="whiteAlpha.600">{tool.label}</Text>
                  </VStack>
                </MotionBox>
              );
            })}

            {/* Connection lines (decorative) */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="220px"
              h="220px"
              borderRadius="full"
              border="1px dashed"
              borderColor="whiteAlpha.100"
              pointerEvents="none"
            />
          </Box>
        </Box>

        {/* Right - Content */}
        <VStack align="flex-start" spacing={6} flex={1}>
          <Heading as="h2" size="xl" fontWeight="800" color="white">
            {t('aiAgentsTeaser.heading')}{' '}
            <Text as="span" color="brand.300">{t('aiAgentsTeaser.headingHighlight')}</Text>
          </Heading>

          <Text color="whiteAlpha.700" fontSize="lg" lineHeight="1.7">
            {t('aiAgentsTeaser.description')}
          </Text>

          {/* Before/After */}
          <HStack spacing={6} flexWrap="wrap">
            <Box bg="whiteAlpha.50" p={5} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.100" flex={1} minW="200px">
              <Text fontSize="xs" color="red.300" fontWeight="600" mb={2}>{t('aiAgentsTeaser.before.label')}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">{t('aiAgentsTeaser.before.items.0')}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">{t('aiAgentsTeaser.before.items.1')}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">{t('aiAgentsTeaser.before.items.2')}</Text>
            </Box>
            <Box bg="whiteAlpha.50" p={5} borderRadius="xl" border="1px solid" borderColor="brand.500" flex={1} minW="200px">
              <Text fontSize="xs" color="whatsapp.400" fontWeight="600" mb={2}>{t('aiAgentsTeaser.after.label')}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">{t('aiAgentsTeaser.after.items.0')}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">{t('aiAgentsTeaser.after.items.1')}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">{t('aiAgentsTeaser.after.items.2')}</Text>
            </Box>
          </HStack>

          <Button
            as={Link}
            to={lp('/ai-agents')}
            size="lg"
            bg="brand.500"
            color="white"
            _hover={{ bg: 'brand.400' }}
            rightIcon={<FiArrowRight />}
          >
            {t('cta.knowAIAgents', { ns: 'common' })}
          </Button>
        </VStack>
      </Flex>
    </SectionWrapper>
  );
}
