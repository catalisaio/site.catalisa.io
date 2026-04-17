import { useState } from 'react';
import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Icon, Badge, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  FiMessageCircle, FiCpu, FiTrendingUp, 
  FiFolder, FiBell, FiShield,
  FiMail, FiPhone, FiImage, FiFilter, FiDatabase, FiLink, FiServer,
  FiDollarSign, FiPieChart,
  FiKey, FiRefreshCw, FiBookOpen, FiPercent
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

interface BlockCategory {
  name: string;
  nameKey: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  blocks: { name: string; nameKey: string; icon: React.ElementType; tested?: boolean }[];
}

const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    name: 'Comunicação',
    nameKey: 'buildingBlocks.categories.communication',
    icon: FiMessageCircle,
    color: '#734B9C',
    bgColor: 'purple.50',
    blocks: [
      { name: 'WhatsApp', nameKey: 'buildingBlocks.blocks.whatsapp', icon: FiMessageCircle, tested: true },
      { name: 'E-mail', nameKey: 'buildingBlocks.blocks.email', icon: FiMail },
      { name: 'SMS', nameKey: 'buildingBlocks.blocks.sms', icon: FiPhone },
      { name: 'Notificações Push', nameKey: 'buildingBlocks.blocks.push', icon: FiBell },
    ]
  },
  {
    name: 'Inteligência',
    nameKey: 'buildingBlocks.categories.intelligence',
    icon: FiCpu,
    color: '#25D366',
    bgColor: 'green.50',
    blocks: [
      { name: 'Agente IA', nameKey: 'buildingBlocks.blocks.aiAgent', icon: FiCpu, tested: true },
      { name: 'Análise Sentimento', nameKey: 'buildingBlocks.blocks.sentiment', icon: FiTrendingUp },
      { name: 'OCR', nameKey: 'buildingBlocks.blocks.ocr', icon: FiImage },
      { name: 'Classificação IA', nameKey: 'buildingBlocks.blocks.classification', icon: FiFilter },
    ]
  },
  {
    name: 'Dados',
    nameKey: 'buildingBlocks.categories.data',
    icon: FiDatabase,
    color: '#5B9BD5',
    bgColor: 'blue.50',
    blocks: [
      { name: 'CRM', nameKey: 'buildingBlocks.blocks.crm', icon: FiDatabase },
      { name: 'Webhook', nameKey: 'buildingBlocks.blocks.webhook', icon: FiLink },
      { name: 'API REST', nameKey: 'buildingBlocks.blocks.api', icon: FiServer },
      { name: 'Arquivos', nameKey: 'buildingBlocks.blocks.files', icon: FiFolder },
    ]
  },
  {
    name: 'Financeiro',
    nameKey: 'buildingBlocks.categories.financial',
    icon: FiDollarSign,
    color: '#FDC234',
    bgColor: 'yellow.50',
    blocks: [
      { name: 'PIX Cobrança', nameKey: 'buildingBlocks.blocks.pixCharge', icon: FiDollarSign, tested: true },
      { name: 'PIX Transfer', nameKey: 'buildingBlocks.blocks.pixTransfer', icon: FiRefreshCw, tested: true },
      { name: 'Boleto', nameKey: 'buildingBlocks.blocks.boleto', icon: FiBookOpen, tested: true },
      { name: 'Split Payment', nameKey: 'buildingBlocks.blocks.split', icon: FiPieChart },
    ]
  },
  {
    name: 'Enterprise',
    nameKey: 'buildingBlocks.categories.enterprise',
    icon: FiShield,
    color: '#E53E3E',
    bgColor: 'red.50',
    blocks: [
      { name: 'Decision Engine', nameKey: 'buildingBlocks.blocks.decisionEngine', icon: FiLink, tested: true },
      { name: 'BaaS Orchestration', nameKey: 'buildingBlocks.blocks.baas', icon: FiServer, tested: true },
      { name: 'Open Finance', nameKey: 'buildingBlocks.blocks.openFinance', icon: FiLink, tested: true },
      { name: 'RBAC', nameKey: 'buildingBlocks.blocks.rbac', icon: FiKey, tested: true },
    ]
  },
  {
    name: 'Calculadoras',
    nameKey: 'buildingBlocks.categories.calculators',
    icon: FiPercent,
    color: '#38A169',
    bgColor: 'green.50',
    blocks: [
      { name: 'Juros Compostos', nameKey: 'buildingBlocks.blocks.compoundInterest', icon: FiPercent, tested: true },
      { name: 'CET/TAEG', nameKey: 'buildingBlocks.blocks.cet', icon: FiCalculator, tested: true },
      { name: 'Amortização', nameKey: 'buildingBlocks.blocks.amortization', icon: FiPieChart, tested: true },
      { name: 'Limite Crédito', nameKey: 'buildingBlocks.blocks.creditLimit', icon: FiShield, tested: true },
    ]
  },
];

function FiCalculator(props: any) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V9h2v4zm4 4h-2v-6h2v6zm0-8h-2V7h2v2zm-8 8H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2z"/>
    </Icon>
  );
}

function BlockItem({ nameKey, icon, color, bgColor, delay }: {
  nameKey: string; 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
  delay: number;
}) {
  const { t } = useTranslation('determinism');

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      cursor="pointer"
    >
      <Box
        bg="white"
        p={4}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        _hover={{
          borderColor: color,
          boxShadow: `0 8px 24px ${color}15`,
          transform: 'translateY(-2px)'
        }}
        transition="all 0.2s"
        position="relative"
      >
        <VStack spacing={3} align="center">
          <Box
            p={3}
            borderRadius="lg"
            bg={bgColor}
          >
            <Icon as={icon} boxSize={6} color={color} />
          </Box>
          <Text fontSize="xs" fontWeight="600" color="gray.700" textAlign="center" lineHeight="1.3">
            {t(nameKey)}
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
}

export function BuildingBlocksShowcase() {
  const { t } = useTranslation('determinism');
  const [activeCategory, setActiveCategory] = useState(0);

  const allBlocks = BLOCK_CATEGORIES.flatMap((cat, catIdx) => 
    cat.blocks.map((block, blockIdx) => ({
      ...block,
      color: cat.color,
      bgColor: cat.bgColor,
      delay: (catIdx * 4 + blockIdx) * 0.03
    }))
  );

  return (
    <Box bg="gray.50" py={{ base: 16, md: 24 }} id="details">
      <Container maxW="1200px">
        <VStack spacing={4} mb={12} textAlign="center">
          <Badge 
            colorScheme="brand" 
            fontSize="xs" 
            px={4} 
            py={1.5} 
            borderRadius="full"
            fontWeight="600"
          >
            {t('buildingBlocks.badge')}
          </Badge>
          <Heading 
            as="h2" 
            size="xl" 
            fontWeight="800"
            color="gray.800"
            maxW="700px"
            lineHeight="1.2"
          >
            {t('buildingBlocks.heading')}
          </Heading>
          <Text color="gray.500" maxW="600px" fontSize="lg" lineHeight="1.6">
            {t('buildingBlocks.subtitle')}
          </Text>
        </VStack>

        {/* Category tabs - horizontal scroll on mobile */}
        <Box 
          overflowX="auto" 
          pb={4} 
          mb={8}
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          <HStack 
            spacing={2} 
            justify="center" 
            minW="max-content"
            px={4}
          >
            {BLOCK_CATEGORIES.map((cat, i) => (
              <Box
                key={i}
                as="button"
                onClick={() => setActiveCategory(i)}
                px={5}
                py={2.5}
                borderRadius="full"
                bg={activeCategory === i ? cat.color : 'white'}
                border="1px solid"
                borderColor={activeCategory === i ? cat.color : 'gray.200'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ 
                  transform: 'scale(1.02)',
                  borderColor: cat.color,
                  boxShadow: `0 4px 12px ${cat.color}20`
                }}
              >
                <HStack spacing={2}>
                  <Icon 
                    as={cat.icon} 
                    color={activeCategory === i ? 'white' : cat.color} 
                    boxSize={4}
                  />
                  <Text 
                    fontSize="sm" 
                    fontWeight="600" 
                    color={activeCategory === i ? 'white' : 'gray.700'}
                  >
                    {t(cat.nameKey)}
                  </Text>
                </HStack>
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Blocks grid */}
        <Box 
          bg="white"
          p={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="sm"
        >
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
            {(activeCategory === 0 
              ? allBlocks 
              : BLOCK_CATEGORIES[activeCategory].blocks.map((b, i) => ({ 
                  ...b, 
                  color: BLOCK_CATEGORIES[activeCategory].color,
                  bgColor: BLOCK_CATEGORIES[activeCategory].bgColor,
                  delay: i * 0.05 
                }))
            ).map((block, i) => (
              <BlockItem
                key={`${block.nameKey}-${i}`}
                nameKey={block.nameKey}
                icon={block.icon}
                color={block.color}
                bgColor={block.bgColor}
                delay={block.delay}
              />
            ))}
          </SimpleGrid>
        </Box>

        {/* Bottom note */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          mt={10}
          textAlign="center"
        >
          <Flex justify="center" align="center" gap={3} flexWrap="wrap">
            <Box 
              w={8} 
              h={1} 
              bg="gray.300" 
              borderRadius="full"
            />
            <Text color="gray.500" fontSize="sm" fontWeight="500">
              {t('buildingBlocks.note')}
            </Text>
          </Flex>
          <Text color="gray.400" fontSize="xs" mt={3}>
            {t('buildingBlocks.enterpriseNote')}
          </Text>
        </MotionBox>
      </Container>
    </Box>
  );
}
