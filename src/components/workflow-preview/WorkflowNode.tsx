import { Box, Text, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { categoryBadges } from '../../data/capabilityClusters';
import type { WorkflowNode as NodeType, WorkflowTheme } from './types';

interface Props {
  node: NodeType;
  isActive: boolean;
  theme: WorkflowTheme;
  index: number;
  entered: boolean;
}

const categoryColors: Record<string, string> = {
  Trigger: '#718096',
  IA: '#9F7AEA',
  WhatsApp: '#25D366',
  CRM: '#ED8936',
  Financeiro: '#ECC94B',
  Seguranca: '#FC8181',
  Integracao: '#0BC5EA',
  Logica: '#4299E1',
  Dados: '#38B2AC',
  Documentos: '#ED64A6',
  Agenda: '#0077B5',
  Workflow: '#4299E1',
};

function getCategoryColor(category: string): string {
  return categoryColors[category] || '#A0AEC0';
}

export function WorkflowNodeComponent({ node, isActive, theme, index, entered }: Props) {
  const catColor = getCategoryColor(node.category);
  const badge = categoryBadges[node.category];
  const isTrigger = node.category === 'Trigger';

  return (
    <Box
      position="absolute"
      left={`${node.x}%`}
      top={`${node.y}%`}
      transform="translate(-50%, -50%)"
      zIndex={2}
      pointerEvents="none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={entered ? {
          opacity: 1,
          scale: isActive ? 1.06 : 1,
          transition: { duration: 0.3 },
        } : {
          opacity: 0,
          scale: 0.8,
        }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
      >
        <HStack
          spacing={0}
          bg={theme.nodeBg}
          border="1px solid"
          borderColor={isActive ? catColor : theme.nodeBorder}
          borderRadius="lg"
          overflow="hidden"
          boxShadow={isActive ? `0 0 20px ${catColor}40, 0 0 40px ${catColor}20` : 'sm'}
          transition="box-shadow 0.3s, border-color 0.3s"
          minW={isTrigger ? '130px' : '110px'}
        >
          {/* Category color bar */}
          <Box
            w="4px"
            alignSelf="stretch"
            bg={catColor}
            opacity={isActive ? 1 : 0.6}
            transition="opacity 0.3s"
          />
          <Box px={3} py={2}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color={theme.nodeText}
              whiteSpace="nowrap"
              lineHeight="1.2"
            >
              {node.label}
            </Text>
            {badge && (
              <Text
                fontSize="2xs"
                color={catColor}
                fontWeight="500"
                opacity={0.8}
                mt={0.5}
              >
                {badge.label}
              </Text>
            )}
          </Box>
        </HStack>
      </motion.div>
    </Box>
  );
}
