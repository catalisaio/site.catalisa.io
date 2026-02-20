import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageCircle, FiGitBranch, FiCpu, FiShield, FiTrendingUp, FiLayers } from 'react-icons/fi';
import { WhatsAppChatPreview, insuranceMessages, pensionMessages } from './WhatsAppChatPreview';
import { WorkflowPreviewHero } from '../workflow-preview/WorkflowPreviewHero';
import { AIAgentPreview } from './AIAgentPreview';
import { StudioBuilderPreview } from './StudioBuilderPreview';

export interface HeroShowcaseTab {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  dwellTime: number;
}

export const heroTabs: HeroShowcaseTab[] = [
  { id: 'studio', label: 'Studio', icon: FiLayers, color: 'brand.400', dwellTime: 7000 },
  { id: 'credito', label: 'Credito', icon: FiMessageCircle, color: 'whatsapp.500', dwellTime: 8000 },
  { id: 'workflows', label: 'Automacoes', icon: FiGitBranch, color: 'blue.500', dwellTime: 8000 },
  { id: 'seguros', label: 'Seguros', icon: FiShield, color: 'orange.400', dwellTime: 8000 },
  { id: 'agents', label: 'Agentes IA', icon: FiCpu, color: 'brand.500', dwellTime: 6000 },
  { id: 'previdencia', label: 'Previdencia', icon: FiTrendingUp, color: 'cyan.400', dwellTime: 8000 },
];

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

function PanelContent({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <StudioBuilderPreview />;
    case 1:
      return <WhatsAppChatPreview triggerMode="auto" title="Agente IA - Credito" />;
    case 2:
      return <WorkflowPreviewHero />;
    case 3:
      return <WhatsAppChatPreview triggerMode="auto" title="Agente IA - Seguros" messages={insuranceMessages} />;
    case 4:
      return <AIAgentPreview />;
    case 5:
      return <WhatsAppChatPreview triggerMode="auto" title="Agente IA - Previdencia" messages={pensionMessages} />;
    default:
      return null;
  }
}

export function HeroShowcase({ activeIndex, onTabChange, paused }: HeroShowcaseProps) {
  const activeTab = heroTabs[activeIndex];

  return (
    <Flex direction="column" gap={4} maxW="580px" w="full">
      {/* Panel content */}
      <Box
        minH={{ base: '340px', xl: '420px' }}
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
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
      <HStack spacing={1.5} justify="center" flexWrap="wrap">
        {heroTabs.map((tab, i) => {
          const isActive = i === activeIndex;
          const TabIcon = tab.icon;
          return (
            <Box
              key={tab.id}
              as="button"
              onClick={() => onTabChange(i)}
              px={3}
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
              <HStack spacing={1.5}>
                <Box as={TabIcon} color={isActive ? tab.color : 'whiteAlpha.500'} boxSize="13px" />
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
