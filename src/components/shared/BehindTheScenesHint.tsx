import { HStack, Text } from '@chakra-ui/react';
import { FiPlay } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface BehindTheScenesHintProps {
  onOpen: () => void;
  variant?: 'dark' | 'light';
}

export function BehindTheScenesHint({ onOpen, variant = 'dark' }: BehindTheScenesHintProps) {
  const { t } = useTranslation('common');

  const isDark = variant === 'dark';

  return (
    <HStack
      as="button"
      onClick={onOpen}
      spacing={1.5}
      fontSize="xs"
      color={isDark ? 'whiteAlpha.500' : 'whiteAlpha.700'}
      cursor="pointer"
      _hover={{
        color: isDark ? 'whiteAlpha.700' : 'white',
        textDecoration: 'underline',
      }}
      transition="all 0.2s"
    >
      <FiPlay size={10} />
      <Text>{t('behindTheScenes.hint')}</Text>
    </HStack>
  );
}
