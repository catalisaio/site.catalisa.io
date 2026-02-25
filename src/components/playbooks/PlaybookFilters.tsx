import { HStack, Button, Select, Input, InputGroup, InputLeftElement, Icon, Flex, Box, Text, VStack } from '@chakra-ui/react';
import { FiSearch, FiCpu, FiServer, FiGrid } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { PlaybookCategory, PlaybookIndustry, PlaybookType } from '../../data/playbooks';

interface PlaybookFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: PlaybookCategory | 'all';
  onCategoryChange: (cat: PlaybookCategory | 'all') => void;
  industry: PlaybookIndustry | 'all';
  onIndustryChange: (ind: PlaybookIndustry | 'all') => void;
  type: PlaybookType | 'all';
  onTypeChange: (type: PlaybookType | 'all') => void;
}

const categories: (PlaybookCategory | 'all')[] = [
  'all', 'vendas', 'suporte', 'financeiro', 'onboarding', 'marketing', 'operacoes', 'produtividade',
];

const industries: (PlaybookIndustry | 'all')[] = [
  'all', 'geral', 'fintech', 'banking', 'insurance', 'retail', 'saas', 'saude', 'educacao', 'imobiliario', 'ecommerce',
];

const typeConfig = [
  { key: 'all' as const, icon: FiGrid, color: 'brand', gradient: 'linear(to-r, brand.400, orange.400)' },
  { key: 'agent' as const, icon: FiCpu, color: 'brand', gradient: 'linear(to-r, brand.400, brand.500)' },
  { key: 'app' as const, icon: FiServer, color: 'orange', gradient: 'linear(to-r, orange.400, orange.500)' },
];

export function PlaybookFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  industry,
  onIndustryChange,
  type,
  onTypeChange,
}: PlaybookFiltersProps) {
  const { t } = useTranslation('playbooks');

  return (
    <VStack spacing={6} mb={8}>
      {/* Type toggle — prominent */}
      <Flex
        justify="center"
        gap={3}
        flexWrap="wrap"
      >
        {typeConfig.map(({ key, icon: TypeIcon, color, gradient }) => {
          const isActive = type === key;
          return (
            <Box
              key={key}
              as="button"
              onClick={() => onTypeChange(key)}
              display="flex"
              alignItems="center"
              gap={2.5}
              px={5}
              py={3}
              borderRadius="xl"
              bg={isActive ? `${color}.50` : 'white'}
              border="2px solid"
              borderColor={isActive ? `${color}.400` : 'gray.200'}
              color={isActive ? `${color}.700` : 'gray.500'}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: `${color}.300`,
                bg: `${color}.50`,
                transform: 'translateY(-1px)',
                boxShadow: 'md',
              }}
              position="relative"
              overflow="hidden"
            >
              {isActive && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="3px"
                  bgGradient={gradient}
                />
              )}
              <Box
                p={1.5}
                borderRadius="lg"
                bg={isActive ? `${color}.100` : 'gray.100'}
              >
                <Icon as={TypeIcon} boxSize={4} color={isActive ? `${color}.500` : 'gray.400'} />
              </Box>
              <Text
                fontWeight={isActive ? '700' : '500'}
                fontSize="sm"
              >
                {t(`types.${key}`)}
              </Text>
            </Box>
          );
        })}
      </Flex>

      {/* Search bar */}
      <InputGroup maxW="480px" mx="auto">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder={t('search.placeholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          focusBorderColor="brand.500"
          bg="white"
          borderRadius="lg"
        />
      </InputGroup>

      {/* Category pills */}
      <Flex justify="center" flexWrap="wrap" gap={2}>
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            borderRadius="full"
            px={4}
            bg={category === cat ? 'brand.500' : 'gray.100'}
            color={category === cat ? 'white' : 'gray.600'}
            _hover={{
              bg: category === cat ? 'brand.600' : 'gray.200',
            }}
            fontWeight={category === cat ? '600' : '400'}
            onClick={() => onCategoryChange(cat)}
          >
            {t(`categories.${cat}`)}
          </Button>
        ))}
      </Flex>

      {/* Industry dropdown */}
      <HStack justify="center">
        <Select
          size="sm"
          maxW="220px"
          borderRadius="lg"
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value as PlaybookIndustry | 'all')}
          focusBorderColor="brand.500"
          bg="white"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {t(`industries.${ind}`)}
            </option>
          ))}
        </Select>
      </HStack>
    </VStack>
  );
}
