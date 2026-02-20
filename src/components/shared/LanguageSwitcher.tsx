import { HStack, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAlternatePath } from '../../i18n/useAlternatePath';

interface LanguageSwitcherProps {
  isDark?: boolean;
}

export function LanguageSwitcher({ isDark = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const alternate = useAlternatePath();

  const currentLabel = i18n.language === 'en-US' ? 'EN' : 'PT';

  const handleSwitch = () => {
    navigate(alternate.path);
  };

  const activeColor = isDark ? 'white' : 'gray.800';
  const inactiveColor = isDark ? 'whiteAlpha.600' : 'gray.400';
  const activeBg = isDark ? 'whiteAlpha.200' : 'gray.100';
  const hoverBg = isDark ? 'whiteAlpha.100' : 'gray.50';

  return (
    <HStack
      spacing={0}
      border="1px solid"
      borderColor={isDark ? 'whiteAlpha.300' : 'gray.200'}
      borderRadius="md"
      overflow="hidden"
    >
      <Button
        size="sm"
        variant="ghost"
        px={3}
        minW="auto"
        h="28px"
        borderRadius={0}
        fontWeight={currentLabel === 'PT' ? '700' : '400'}
        fontSize="xs"
        color={currentLabel === 'PT' ? activeColor : inactiveColor}
        bg={currentLabel === 'PT' ? activeBg : 'transparent'}
        _hover={{ bg: currentLabel === 'PT' ? activeBg : hoverBg, color: activeColor }}
        isDisabled={currentLabel === 'PT'}
        onClick={currentLabel !== 'PT' ? handleSwitch : undefined}
      >
        PT
      </Button>
      <Text fontSize="xs" color={isDark ? 'whiteAlpha.300' : 'gray.200'} userSelect="none">
        |
      </Text>
      <Button
        size="sm"
        variant="ghost"
        px={3}
        minW="auto"
        h="28px"
        borderRadius={0}
        fontWeight={currentLabel === 'EN' ? '700' : '400'}
        fontSize="xs"
        color={currentLabel === 'EN' ? activeColor : inactiveColor}
        bg={currentLabel === 'EN' ? activeBg : 'transparent'}
        _hover={{ bg: currentLabel === 'EN' ? activeBg : hoverBg, color: activeColor }}
        isDisabled={currentLabel === 'EN'}
        onClick={currentLabel !== 'EN' ? handleSwitch : undefined}
      >
        EN
      </Button>
    </HStack>
  );
}
