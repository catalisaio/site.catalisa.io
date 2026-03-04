import { Box, Flex, Heading, Text, Icon } from '@chakra-ui/react';
import { FiZap, FiAlertTriangle, FiStar, FiAlertCircle, FiEdit3 } from 'react-icons/fi';
import type { CalloutBlock as CalloutBlockType } from '../../../data/trainingBlockTypes';

const variantConfig = {
  tip: { icon: FiZap, bg: 'blue.50', borderColor: 'blue.400', iconColor: 'blue.500', defaultTitle: 'Dica' },
  warning: { icon: FiAlertTriangle, bg: 'orange.50', borderColor: 'orange.400', iconColor: 'orange.500', defaultTitle: 'Atencao' },
  'pro-tip': { icon: FiStar, bg: 'purple.50', borderColor: 'purple.400', iconColor: 'purple.500', defaultTitle: 'Pro Tip' },
  important: { icon: FiAlertCircle, bg: 'red.50', borderColor: 'red.400', iconColor: 'red.500', defaultTitle: 'Importante' },
  exercise: { icon: FiEdit3, bg: 'green.50', borderColor: 'green.400', iconColor: 'green.500', defaultTitle: 'Exercicio' },
};

interface Props {
  block: CalloutBlockType;
}

export function CalloutBlock({ block }: Props) {
  const config = variantConfig[block.variant];

  return (
    <Box
      w="full"
      p={4}
      bg={config.bg}
      borderLeft="4px solid"
      borderColor={config.borderColor}
      borderRadius="md"
    >
      <Flex align="center" gap={2} mb={block.title ? 2 : 0}>
        <Icon as={config.icon} color={config.iconColor} boxSize={4} />
        {block.title && (
          <Heading as="h4" size="xs" color={config.iconColor}>
            {block.title}
          </Heading>
        )}
        {!block.title && (
          <Heading as="h4" size="xs" color={config.iconColor}>
            {config.defaultTitle}
          </Heading>
        )}
      </Flex>
      <Text fontSize="sm" color="gray.700" lineHeight="tall" ml={6}>
        {block.text}
      </Text>
    </Box>
  );
}
