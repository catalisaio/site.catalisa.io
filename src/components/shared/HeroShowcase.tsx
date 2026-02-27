import { useMemo, lazy, Suspense } from 'react';
import { Box, Flex, HStack, Text, Skeleton } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageCircle, FiGitBranch, FiCpu, FiShield, FiLayers, FiUsers, FiServer, FiKey } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useCreditMessages, useInsuranceMessages } from './WhatsAppChatPreview';
import type { APIMessage } from './APIPreview';

const WhatsAppChatPreview = lazy(() => import('./WhatsAppChatPreview').then(m => ({ default: m.WhatsAppChatPreview })));
const APIPreview = lazy(() => import('./APIPreview').then(m => ({ default: m.APIPreview })));
const WorkflowPreviewHero = lazy(() => import('../workflow-preview/WorkflowPreviewHero').then(m => ({ default: m.WorkflowPreviewHero })));
const AIAgentPreview = lazy(() => import('./AIAgentPreview').then(m => ({ default: m.AIAgentPreview })));
const StudioBuilderPreview = lazy(() => import('./StudioBuilderPreview').then(m => ({ default: m.StudioBuilderPreview })));
const TeamGridVisual = lazy(() => import('./TeamGridVisual').then(m => ({ default: m.TeamGridVisual })));

export interface HeroShowcaseTab {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  dwellTime: number;
}

const heroTabDefs = [
  { id: 'team', labelKey: 'heroShowcase.tabs.team', icon: FiUsers, color: 'whatsapp.400', dwellTime: 7000 },
  { id: 'studio', labelKey: 'heroShowcase.tabs.studio', icon: FiLayers, color: 'brand.400', dwellTime: 7000 },
  { id: 'credito', labelKey: 'heroShowcase.tabs.credito', icon: FiMessageCircle, color: 'whatsapp.500', dwellTime: 8000 },
  { id: 'workflows', labelKey: 'heroShowcase.tabs.workflows', icon: FiGitBranch, color: 'blue.500', dwellTime: 8000 },
  { id: 'seguros', labelKey: 'heroShowcase.tabs.seguros', icon: FiShield, color: 'orange.400', dwellTime: 8000 },
  { id: 'agents', labelKey: 'heroShowcase.tabs.agents', icon: FiCpu, color: 'brand.500', dwellTime: 6000 },
  { id: 'appCredito', labelKey: 'heroShowcase.tabs.appCredito', icon: FiServer, color: 'orange.400', dwellTime: 8000 },
  { id: 'appKyc', labelKey: 'heroShowcase.tabs.appKyc', icon: FiKey, color: 'orange.500', dwellTime: 8000 },
] as const;

export function useHeroTabs(): HeroShowcaseTab[] {
  const { t } = useTranslation('home');
  return useMemo(
    () =>
      heroTabDefs.map((def) => ({
        id: def.id,
        label: t(def.labelKey),
        icon: def.icon,
        color: def.color,
        dwellTime: def.dwellTime,
      })),
    [t],
  );
}

/** @deprecated Use useHeroTabs() hook instead */
export const heroTabs: HeroShowcaseTab[] = heroTabDefs.map((def) => ({
  id: def.id,
  label: def.id, // Fallback — callers should migrate to useHeroTabs()
  icon: def.icon,
  color: def.color,
  dwellTime: def.dwellTime,
}));

interface HeroShowcaseProps {
  activeIndex: number;
  onTabChange: (index: number) => void;
  paused: boolean;
}

const panelVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

function useAppCreditMessages(): APIMessage[] {
  const { t } = useTranslation('home');
  return useMemo(() => t('heroShowcase.appCreditMessages', { returnObjects: true }) as APIMessage[], [t]);
}

function useAppKycMessages(): APIMessage[] {
  const { t } = useTranslation('home');
  return useMemo(() => t('heroShowcase.appKycMessages', { returnObjects: true }) as APIMessage[], [t]);
}

const PanelSkeleton = () => (
  <Skeleton h="400px" w="100%" borderRadius="xl" startColor="whiteAlpha.100" endColor="whiteAlpha.200" />
);

function PanelContent({ index }: { index: number }) {
  const { t } = useTranslation('home');
  const creditMessages = useCreditMessages();
  const insuranceMessages = useInsuranceMessages();
  const appCreditMessages = useAppCreditMessages();
  const appKycMessages = useAppKycMessages();

  let content: React.ReactNode;
  switch (index) {
    case 0:
      content = <TeamGridVisual />;
      break;
    case 1:
      content = <StudioBuilderPreview />;
      break;
    case 2:
      content = <WhatsAppChatPreview triggerMode="auto" title={t('chatPreview.creditTitle')} messages={creditMessages} />;
      break;
    case 3:
      content = <WorkflowPreviewHero />;
      break;
    case 4:
      content = <WhatsAppChatPreview triggerMode="auto" title={t('chatPreview.insuranceTitle')} messages={insuranceMessages} />;
      break;
    case 5:
      content = <AIAgentPreview />;
      break;
    case 6:
      content = <APIPreview triggerMode="auto" title={t('heroShowcase.appCreditTitle')} messages={appCreditMessages} />;
      break;
    case 7:
      content = <APIPreview triggerMode="auto" title={t('heroShowcase.appKycTitle')} messages={appKycMessages} />;
      break;
    default:
      return null;
  }

  return <Suspense fallback={<PanelSkeleton />}>{content}</Suspense>;
}

export function HeroShowcase({ activeIndex, onTabChange, paused }: HeroShowcaseProps) {
  const tabs = useHeroTabs();
  const activeTab = tabs[activeIndex];

  return (
    <Flex direction="column" gap={4} w="full">
      {/* Panel content */}
      <Box
        h={{ base: '460px', xl: '480px' }}
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        overflow="hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <PanelContent index={activeIndex} />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Tab indicators */}
      <HStack spacing={1} justify="center" flexWrap="wrap" rowGap={1.5}>
        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          const TabIcon = tab.icon;
          return (
            <Box
              key={tab.id}
              as="button"
              onClick={() => onTabChange(i)}
              px={2.5}
              py={1.5}
              borderRadius="full"
              bg={isActive ? 'whiteAlpha.150' : 'whiteAlpha.50'}
              border="1px solid"
              borderColor={isActive ? 'whiteAlpha.200' : 'transparent'}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ bg: 'whiteAlpha.150' }}
              position="relative"
              overflow="hidden"
            >
              <HStack spacing={1}>
                <Box as={TabIcon} color={isActive ? tab.color : 'whiteAlpha.500'} boxSize="12px" />
                <Text
                  color={isActive ? 'white' : 'whiteAlpha.500'}
                  fontSize="2xs"
                  fontWeight={isActive ? '600' : '400'}
                >
                  {tab.label}
                </Text>
              </HStack>

              {/* Progress bar */}
              {isActive && (
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  h="2px"
                  bg={tab.color}
                  as={motion.div}
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? undefined : '100%' }}
                  transition={{ duration: tab.dwellTime / 1000, ease: 'linear' } as any}
                />
              )}
            </Box>
          );
        })}
      </HStack>
    </Flex>
  );
}
