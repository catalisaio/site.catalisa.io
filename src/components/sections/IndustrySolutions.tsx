import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiDollarSign, FiShield, FiShoppingBag, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { SectionWrapper } from '../shared/SectionWrapper';
import { GradientText } from '../shared/GradientText';
import { MotionBox, staggerContainer, staggerItem } from '../motion';
import type { IconType } from 'react-icons';

interface IndustryData {
  name: string;
  scenario: string;
  stats: string[];
}

const industryIcons: IconType[] = [FiTrendingUp, FiDollarSign, FiShield, FiShoppingBag, FiZap];
const industryColors = ['blue.400', 'green.400', 'orange.400', 'purple.400', 'cyan.400'];
const industryPaths = ['/verticais/fintech', '/verticais/bancario', '/verticais/seguros', '/verticais/varejo', '/verticais/startups'];

export function IndustrySolutions() {
  const { t } = useTranslation('home');
  const lp = useLocalizedPath();
  const industries = t('industrySolutions.industries', { returnObjects: true }) as IndustryData[];

  return (
    <SectionWrapper bg="gray.50" id="industries">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="white"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="gray.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('industrySolutions.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
        >
          {t('industrySolutions.heading')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('industrySolutions.headingGradient')}
          </GradientText>
        </Heading>
      </VStack>

      <MotionBox {...staggerContainer}>
        <Flex
          gap={4}
          justify={{ base: 'flex-start', lg: 'center' }}
          overflowX={{ base: 'auto', lg: 'visible' }}
          pb={4}
          px={2}
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {industries.map((industry, i) => (
            <MotionBox key={industry.name} {...staggerItem}>
              <Box
                as={Link}
                to={lp(industryPaths[i])}
                w={{ base: '220px', md: '210px' }}
                p={5}
                borderRadius="2xl"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  borderColor: industryColors[i],
                }}
                display="block"
                textDecoration="none"
                flexShrink={0}
              >
                <VStack align="flex-start" spacing={4}>
                  <Box
                    p={3}
                    borderRadius="xl"
                    bg={`${industryColors[i].replace('.400', '.50')}`}
                  >
                    <Icon as={industryIcons[i]} boxSize={6} color={industryColors[i]} />
                  </Box>

                  <VStack align="flex-start" spacing={1}>
                    <Text fontSize="md" fontWeight="700" color="gray.800">
                      {industry.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500" lineHeight="1.5">
                      {industry.scenario}
                    </Text>
                  </VStack>

                  <VStack align="flex-start" spacing={1} w="full">
                    {industry.stats.map((stat) => (
                      <HStack key={stat} spacing={1.5}>
                        <Box w="4px" h="4px" borderRadius="full" bg={industryColors[i]} />
                        <Text fontSize="2xs" color="gray.400" fontWeight="600">
                          {stat}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Text fontSize="xs" color="brand.500" fontWeight="600">
                    {t('industrySolutions.learnMore')} &rarr;
                  </Text>
                </VStack>
              </Box>
            </MotionBox>
          ))}
        </Flex>
      </MotionBox>
    </SectionWrapper>
  );
}
