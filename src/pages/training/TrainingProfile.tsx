import {
  Box, Container, Heading, Text, SimpleGrid, VStack, HStack,
  Badge, Flex, Icon, Avatar, Divider, Progress,
} from '@chakra-ui/react';
import {
  FiStar, FiCompass, FiUsers, FiCpu, FiGitBranch, FiGlobe,
  FiLayers, FiMessageCircle, FiZap, FiAward, FiCheckCircle,
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { MotionBox, fadeInUp, staggerContainer, staggerItem } from '../../components/motion';
import { ProtectedRoute } from '../../components/training/ProtectedRoute';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useTrainingGamification } from '../../hooks/useTrainingGamification';
import { badges as allBadgeDefs } from '../../data/trainingGamification';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

const badgeIcons: Record<string, React.ComponentType> = {
  star: FiStar, compass: FiCompass, users: FiUsers, cpu: FiCpu,
  'git-branch': FiGitBranch, globe: FiGlobe, layers: FiLayers,
  'message-circle': FiMessageCircle, zap: FiZap, award: FiAward,
  'check-circle': FiCheckCircle, trophy: FiAward,
};

export function TrainingProfile() {
  const { user } = useSupabaseAuth();
  const { totalXP, badges: earnedBadges, certificates } = useTrainingGamification();
  const lp = useLocalizedPath();

  // XP level calculation
  const level = Math.floor(totalXP / 200) + 1;
  const xpInLevel = totalXP % 200;
  const xpForNext = 200;

  return (
    <ProtectedRoute>
      <Box bg="gray.50" minH="100vh" py={8}>
        <Container maxW="4xl">
          {/* Profile Header */}
          <MotionBox {...fadeInUp}>
            <Flex
              bg="white"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              align="center"
              gap={4}
              mb={6}
            >
              <Avatar size="lg" name={user?.email} bg="purple.500" />
              <Box flex={1}>
                <Heading size="md" color="gray.800">{user?.email}</Heading>
                <HStack spacing={3} mt={1}>
                  <Badge colorScheme="purple" fontSize="sm" px={2}>Nivel {level}</Badge>
                  <Badge colorScheme="yellow" fontSize="sm" px={2}>{totalXP} XP</Badge>
                  <Badge colorScheme="green" fontSize="sm" px={2}>{earnedBadges.length} badges</Badge>
                </HStack>
                <Box mt={2}>
                  <Flex justify="space-between" fontSize="xs" color="gray.500" mb={1}>
                    <Text>Nivel {level}</Text>
                    <Text>{xpInLevel}/{xpForNext} XP</Text>
                  </Flex>
                  <Progress value={(xpInLevel / xpForNext) * 100} size="sm" borderRadius="full" colorScheme="purple" />
                </Box>
              </Box>
            </Flex>
          </MotionBox>

          {/* Badges Section */}
          <Box mb={6}>
            <Heading size="sm" color="gray.800" mb={4}>Badges Conquistados</Heading>
            <MotionBox {...staggerContainer}>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                {allBadgeDefs.map((badgeDef) => {
                  const earned = earnedBadges.find(b => b.slug === badgeDef.slug);
                  const BadgeIcon = badgeIcons[badgeDef.icon] || FiStar;

                  return (
                    <MotionBox key={badgeDef.slug} {...staggerItem}>
                      <Box
                        bg={earned ? 'white' : 'gray.100'}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor={earned ? `${badgeDef.color}.200` : 'gray.200'}
                        p={4}
                        textAlign="center"
                        opacity={earned ? 1 : 0.5}
                        transition="all 0.2s"
                        position="relative"
                      >
                        <Flex
                          w="40px"
                          h="40px"
                          borderRadius="full"
                          bg={earned ? `${badgeDef.color}.100` : 'gray.200'}
                          align="center"
                          justify="center"
                          mx="auto"
                          mb={2}
                        >
                          <Icon
                            as={BadgeIcon}
                            boxSize={5}
                            color={earned ? `${badgeDef.color}.500` : 'gray.400'}
                          />
                        </Flex>
                        <Text fontSize="xs" fontWeight="700" color={earned ? 'gray.800' : 'gray.500'}>
                          {badgeDef.name}
                        </Text>
                        <Text fontSize="2xs" color="gray.500" mt={0.5}>
                          {badgeDef.description}
                        </Text>
                        {earned && (
                          <Badge colorScheme="green" fontSize="2xs" mt={2}>
                            Conquistado
                          </Badge>
                        )}
                      </Box>
                    </MotionBox>
                  );
                })}
              </SimpleGrid>
            </MotionBox>
          </Box>

          <Divider mb={6} />

          {/* Certificates */}
          <Box>
            <Heading size="sm" color="gray.800" mb={4}>Certificados</Heading>
            {certificates.length === 0 ? (
              <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" p={6} textAlign="center">
                <Icon as={FiAward} boxSize={8} color="gray.300" mb={2} />
                <Text fontSize="sm" color="gray.500">
                  Complete uma trilha para ganhar seu certificado
                </Text>
              </Box>
            ) : (
              <VStack spacing={3} align="stretch">
                {certificates.map(cert => (
                  <Box
                    key={cert.slug}
                    as={RouterLink}
                    to={lp(`/treinamento/certificado/${cert.certNumber}`)}
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="yellow.200"
                    p={4}
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                    display="block"
                  >
                    <Flex align="center" gap={3}>
                      <Icon as={FiAward} color="yellow.500" boxSize={6} />
                      <Box flex={1}>
                        <Text fontSize="sm" fontWeight="700" color="gray.800">
                          {cert.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Certificado #{cert.certNumber}
                        </Text>
                      </Box>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
