import { useState, useMemo } from 'react';
import {
  Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Flex,
  Badge, Input, InputGroup, InputLeftElement, Icon,
} from '@chakra-ui/react';
import { FiSearch, FiZap, FiCheckCircle, FiSettings } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { GradientText } from '../components/shared/GradientText';
import { PageCTA } from '../components/shared/PageCTA';
import { PlaybookCard } from '../components/playbooks/PlaybookCard';
import { PlaybookFilters } from '../components/playbooks/PlaybookFilters';
import { MotionBox } from '../components/motion';
import { playbooks } from '../data/playbooks';
import type { PlaybookCategory, PlaybookIndustry } from '../data/playbooks';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function Playbooks() {
  const { t } = useTranslation('playbooks');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PlaybookCategory | 'all'>('all');
  const [industry, setIndustry] = useState<PlaybookIndustry | 'all'>('all');

  const featured = useMemo(() => playbooks.filter((tpl) => tpl.featured), []);

  const filtered = useMemo(() => {
    return playbooks.filter((tpl) => {
      if (category !== 'all' && tpl.category !== category) return false;
      if (industry !== 'all' && tpl.industry !== industry) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = t(tpl.nameKey).toLowerCase();
        const desc = t(tpl.descriptionKey).toLowerCase();
        if (!name.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });
  }, [category, industry, search, t]);

  return (
    <>
      {/* Dark Hero */}
      <Box bg="hero.bg" pb={16} position="relative" overflow="hidden" mt="-64px" pt="calc(64px + 7rem)">
        {/* Gradient overlays */}
        <Box
          position="absolute"
          top="-20%"
          left="30%"
          w="60%"
          h="80%"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.2) 0%, transparent 60%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-10%"
          right="10%"
          w="40%"
          h="50%"
          bgGradient="radial(circle, rgba(0, 188, 212, 0.08) 0%, transparent 60%)"
          pointerEvents="none"
        />

        <Container maxW="1280px" position="relative" zIndex={1} textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="800"
              color="white"
              mb={4}
            >
              {t('hero.heading')}{' '}
              <GradientText
                gradient="linear(to-r, cyan.300, brand.400)"
                fontSize="inherit"
                fontWeight="inherit"
              >
                {t('hero.headingGradient')}
              </GradientText>
            </Heading>
            <Text color="whiteAlpha.700" fontSize="lg" maxW="600px" mx="auto" mb={8}>
              {t('hero.subtitle')}
            </Text>

            {/* Stats pills */}
            <HStack justify="center" spacing={3} mb={8} flexWrap="wrap">
              {['playbooks', 'categories', 'industries'].map((key) => (
                <Badge
                  key={key}
                  bg="whiteAlpha.100"
                  color="whiteAlpha.800"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="500"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  {t(`stats.${key}`)}
                </Badge>
              ))}
            </HStack>

            {/* Search bar in hero */}
            <InputGroup maxW="520px" mx="auto">
              <InputLeftElement pointerEvents="none" h="full">
                <Icon as={FiSearch} color="whiteAlpha.500" />
              </InputLeftElement>
              <Input
                placeholder={t('search.placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="lg"
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                color="white"
                _placeholder={{ color: 'whiteAlpha.500' }}
                _focus={{ borderColor: 'brand.400', bg: 'whiteAlpha.150' }}
                borderRadius="xl"
              />
            </InputGroup>
          </MotionBox>
        </Container>
      </Box>

      {/* Featured */}
      <SectionWrapper>
        <VStack spacing={2} mb={8} textAlign="center">
          <Heading as="h2" size="lg" fontWeight="700">
            {t('featured.heading')}
          </Heading>
          <Text color="gray.500">{t('featured.subtitle')}</Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
          {featured.map((tpl, i) => (
            <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
          ))}
        </SimpleGrid>
      </SectionWrapper>

      {/* All Playbooks */}
      <SectionWrapper bg="gray.50" id="all-playbooks">
        <PlaybookFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          industry={industry}
          onIndustryChange={setIndustry}
        />

        {/* Result count */}
        <Text fontSize="sm" color="gray.500" mb={4} textAlign="center">
          {t('showing', { count: filtered.length, total: playbooks.length })}
        </Text>

        {filtered.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            <AnimatePresence mode="popLayout">
              {filtered.map((tpl, i) => (
                <PlaybookCard key={tpl.id} playbook={tpl} index={i} />
              ))}
            </AnimatePresence>
          </SimpleGrid>
        ) : (
          <VStack py={16} spacing={3}>
            <Text fontSize="lg" fontWeight="600" color="gray.600">
              {t('empty.heading')}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {t('empty.subtitle')}
            </Text>
          </VStack>
        )}
      </SectionWrapper>

      {/* Why Playbooks */}
      <SectionWrapper>
        <Heading as="h2" size="lg" fontWeight="700" textAlign="center" mb={10}>
          {t('whyPlaybooks.heading')}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {[
            { icon: FiZap, key: 'speed', color: 'brand' },
            { icon: FiCheckCircle, key: 'proven', color: 'green' },
            { icon: FiSettings, key: 'customizable', color: 'blue' },
          ].map(({ icon: ValIcon, key, color }) => (
            <VStack key={key} align="center" spacing={4} textAlign="center">
              <Flex
                w="56px"
                h="56px"
                borderRadius="xl"
                bg={`${color}.50`}
                align="center"
                justify="center"
              >
                <Box as={ValIcon} color={`${color}.500`} boxSize="24px" />
              </Flex>
              <Text fontWeight="700" fontSize="md">
                {t(`whyPlaybooks.${key}.title`)}
              </Text>
              <Text color="gray.500" fontSize="sm" maxW="280px">
                {t(`whyPlaybooks.${key}.description`)}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
      </SectionWrapper>

      <PageCTA
        heading={t('bottomCTA.heading')}
        subtitle={t('bottomCTA.subtitle')}
        primaryCTA={{ label: tc('cta.letsChat') }}
        secondaryCTA={{ label: tc('cta.seeDemo'), to: lp('/demo') }}
      />
    </>
  );
}
