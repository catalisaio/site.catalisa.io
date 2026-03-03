import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#F5F0F9',
    100: '#E6D9F0',
    200: '#D1B8E3',
    300: '#B794D4',
    400: '#9B7BC0',
    500: '#734B9C',
    600: '#5E3D80',
    700: '#4A3066',
    800: '#36234C',
    900: '#231733',
  },
  whatsapp: {
    50: '#E8F8EE',
    100: '#C5EDD3',
    200: '#9FE2B6',
    300: '#75D697',
    400: '#4ECB7A',
    500: '#25D366',
    600: '#1FAF54',
    700: '#198C43',
    800: '#136832',
    900: '#0D4522',
  },
  hero: {
    bg: '#0A0F14',
    surface: '#111820',
  },
  catalisa: {
    primary: '#734B9C',
    secondary: '#FDC234',
    accent: '#FE8342',
    info: '#5B9BD5',
    success: '#28A745',
    warning: '#FE8342',
    danger: '#DC3545',
  },
};

const semanticTokens = {
  colors: {
    'bg-page': { default: '#FAFAFA', _dark: '#0A0F14' },
    'bg-card': { default: '#FFFFFF', _dark: '#151C24' },
    'bg-accent': { default: '#F0EDF4', _dark: '#1A2230' },
    'bg-warm': { default: '#FFF9F0', _dark: '#1C1810' },
    'bg-section-alt': { default: '#F7F5FA', _dark: '#12171E' },
    'border-default': { default: '#E8E8EC', _dark: 'rgba(255,255,255,0.10)' },
    'text-primary': { default: 'gray.900', _dark: 'whiteAlpha.900' },
    'text-secondary': { default: 'gray.600', _dark: 'gray.400' },
    'text-muted': { default: '#71717A', _dark: '#A1A1AA' },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: 'lg',
    },
    variants: {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(115, 75, 156, 0.35)',
        },
        _active: { bg: 'brand.700', transform: 'translateY(0)' },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: { bg: 'brand.50', transform: 'translateY(-1px)' },
      },
      whatsapp: {
        bg: 'whatsapp.500',
        color: 'white',
        _hover: {
          bg: 'whatsapp.600',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.35)',
        },
      },
      ghost: {
        border: '1px solid',
        borderColor: 'gray.200',
        _hover: {
          bg: 'blackAlpha.50',
          borderColor: 'gray.300',
        },
      },
    },
    defaultProps: {
      variant: 'primary',
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: '700',
    },
  },
};

const styles = {
  global: {
    body: {
      bg: 'bg-page',
      color: 'text-primary',
    },
    '*:focus-visible': {
      outline: '2px solid',
      outlineColor: 'brand.400',
      outlineOffset: '2px',
      borderRadius: 'sm',
    },
  },
};

export const theme = extendTheme({
  config,
  colors,
  fonts: {
    heading: `'Sora', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    mono: `'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace`,
  },
  semanticTokens,
  components,
  styles,
});

export default theme;
