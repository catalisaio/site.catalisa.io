export interface PresentationColors {
  // Backgrounds
  containerBg: string;
  surfaceBg: string;
  surfaceBorder: string;
  surfaceShadow: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  textGhost: string;

  // Navigation
  navBg: string;
  navColor: string;
  navHoverBg: string;
  navHoverColor: string;
  progressBg: string;

  // UI elements
  iconContainerBg: string;
  tagBg: string;
  tagColor: string;
  pillBg: string;
  pillBorder: string;

  // Outline / ghost buttons
  outlineBorder: string;
  outlineColor: string;
  outlineHoverBg: string;

  // Problem / danger
  problemBg: string;
  problemBorder: string;
  problemAccent: string;
  problemIconBg: string;

  // Success
  successBg: string;
  successBorder: string;
  successAccent: string;

  // Glows
  glowPurple: string;
  glowGreen: string;
  glowGold: string;
  glowGoldBlock: number;
  glowGoldStep: number;
}

const dark: PresentationColors = {
  containerBg: '#0A0F14',
  surfaceBg: 'whiteAlpha.50',
  surfaceBorder: 'whiteAlpha.100',
  surfaceShadow: 'none',

  textPrimary: 'white',
  textSecondary: 'whiteAlpha.800',
  textMuted: 'whiteAlpha.600',
  textSubtle: 'whiteAlpha.500',
  textGhost: 'whiteAlpha.400',

  navBg: 'whiteAlpha.100',
  navColor: 'whiteAlpha.400',
  navHoverBg: 'whiteAlpha.200',
  navHoverColor: 'white',
  progressBg: 'whiteAlpha.100',

  iconContainerBg: 'whiteAlpha.100',
  tagBg: 'whiteAlpha.100',
  tagColor: 'whiteAlpha.800',
  pillBg: 'whiteAlpha.100',
  pillBorder: 'whiteAlpha.200',

  outlineBorder: 'whiteAlpha.300',
  outlineColor: 'white',
  outlineHoverBg: 'whiteAlpha.100',

  problemBg: 'rgba(220,53,69,0.08)',
  problemBorder: 'red.800',
  problemAccent: 'red.300',
  problemIconBg: 'red.900',

  successBg: 'rgba(37,211,102,0.08)',
  successBorder: 'green.800',
  successAccent: 'whatsapp.400',

  glowPurple: 'rgba(115,75,156,0.2)',
  glowGreen: 'rgba(37,211,102,0.05)',
  glowGold: 'rgba(253,194,52,0.12)',
  glowGoldBlock: 0.1,
  glowGoldStep: 0.05,
};

const light: PresentationColors = {
  containerBg: '#F5F7FA',
  surfaceBg: 'white',
  surfaceBorder: 'gray.200',
  surfaceShadow: 'sm',

  textPrimary: 'gray.800',
  textSecondary: 'gray.700',
  textMuted: 'gray.500',
  textSubtle: 'gray.400',
  textGhost: 'gray.400',

  navBg: 'blackAlpha.50',
  navColor: 'gray.500',
  navHoverBg: 'blackAlpha.100',
  navHoverColor: 'gray.800',
  progressBg: 'gray.200',

  iconContainerBg: 'gray.100',
  tagBg: 'gray.100',
  tagColor: 'gray.700',
  pillBg: 'gray.100',
  pillBorder: 'gray.200',

  outlineBorder: 'gray.300',
  outlineColor: 'gray.800',
  outlineHoverBg: 'gray.100',

  problemBg: 'red.50',
  problemBorder: 'red.200',
  problemAccent: 'red.600',
  problemIconBg: 'red.50',

  successBg: 'green.50',
  successBorder: 'green.200',
  successAccent: 'green.600',

  glowPurple: 'rgba(115,75,156,0.08)',
  glowGreen: 'rgba(37,211,102,0.03)',
  glowGold: 'rgba(253,194,52,0.06)',
  glowGoldBlock: 0.06,
  glowGoldStep: 0.03,
};

export const presentationThemes = { dark, light } as const;

export function getPresentationColors(isDark: boolean): PresentationColors {
  return isDark ? dark : light;
}
