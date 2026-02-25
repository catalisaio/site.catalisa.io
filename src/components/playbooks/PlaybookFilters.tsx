import { HStack, Button, Select, Input, InputGroup, InputLeftElement, Icon, Flex, Box } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import type { PlaybookCategory, PlaybookIndustry } from '../../data/playbooks';

interface PlaybookFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: PlaybookCategory | 'all';
  onCategoryChange: (cat: PlaybookCategory | 'all') => void;
  industry: PlaybookIndustry | 'all';
  onIndustryChange: (ind: PlaybookIndustry | 'all') => void;
}

const categories: (PlaybookCategory | 'all')[] = [
  'all', 'vendas', 'suporte', 'financeiro', 'onboarding', 'marketing', 'operacoes', 'produtividade',
];

const industries: (PlaybookIndustry | 'all')[] = [
  'all', 'geral', 'fintech', 'banking', 'insurance', 'retail', 'saas', 'saude', 'educacao', 'imobiliario', 'ecommerce',
];

export function PlaybookFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  industry,
  onIndustryChange,
}: PlaybookFiltersProps) {
  const { t } = useTranslation('playbooks');

  return (
    <Box mb={8}>
      {/* Search bar */}
      <InputGroup maxW="480px" mx="auto" mb={6}>
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
      <Flex justify="center" mb={4} flexWrap="wrap" gap={2}>
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
    </Box>
  );
}
