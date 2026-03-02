import { useRef, useState } from 'react';
import {
  Box, Heading, Text, VStack, SimpleGrid, HStack, Icon, Button,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  UnorderedList, ListItem, Divider,
} from '@chakra-ui/react';
import {
  FiShield, FiDatabase, FiTarget, FiToggleRight, FiShare2, FiLock,
  FiUserCheck, FiMail, FiChevronDown, FiMaximize2, FiMinimize2,
  FiFileText,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { PageHero } from '../components/shared/PageHero';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { SectionHeader } from '../components/shared/SectionHeader';
import { PageCTA } from '../components/shared/PageCTA';
import { MotionBox } from '../components/motion';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20privacidade%20de%20dados.';

const iconMap: Record<string, IconType> = {
  FiDatabase,
  FiTarget,
  FiToggleRight,
  FiShare2,
  FiLock,
  FiUserCheck,
};

interface SummaryCard {
  icon: string;
  title: string;
  description: string;
  linkText: string;
  anchor: number;
}

interface PolicySection {
  title: string;
  content: string;
  items?: string[];
}

export function PrivacyPolicy() {
  const { t } = useTranslation('privacy');
  const accordionRef = useRef<HTMLDivElement>(null);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const cards = t('summary.cards', { returnObjects: true }) as SummaryCard[];
  const sections = t('sections', { returnObjects: true }) as PolicySection[];

  const allIndices = sections.map((_, i) => i);

  const handleExpandAll = () => setExpandedIndices(allIndices);
  const handleCollapseAll = () => setExpandedIndices([]);

  const scrollToSection = (sectionIndex: number) => {
    setExpandedIndices((prev) =>
      prev.includes(sectionIndex) ? prev : [...prev, sectionIndex]
    );
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`policy-section-${sectionIndex}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    });
  };

  return (
    <>
      <PageHero
        badge={t('hero.badge')}
        badgeIcon={FiShield}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        accentColor="brand"
        gradient="linear(to-r, brand.300, brand.400, catalisa.accent)"
      />

      {/* Summary Cards */}
      <SectionWrapper>
        <SectionHeader
          heading={t('summary.title')}
          subtitle={t('summary.subtitle')}
        />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {cards.map((card, i) => {
            const CardIcon = iconMap[card.icon] || FiShield;
            return (
              <MotionBox
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <VStack
                  align="flex-start"
                  spacing={4}
                  p={6}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  _hover={{ borderColor: 'brand.300', boxShadow: 'md', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                  h="full"
                >
                  <Box p={3} borderRadius="lg" bg="brand.50">
                    <Icon as={CardIcon} boxSize={6} color="brand.500" />
                  </Box>
                  <Heading as="h3" size="sm" fontWeight="700">
                    {card.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall" flex={1}>
                    {card.description}
                  </Text>
                  <Button
                    variant="link"
                    color="brand.500"
                    fontWeight="600"
                    fontSize="sm"
                    rightIcon={<FiChevronDown />}
                    onClick={() => scrollToSection(card.anchor)}
                    _hover={{ color: 'brand.600' }}
                  >
                    {card.linkText}
                  </Button>
                </VStack>
              </MotionBox>
            );
          })}
        </SimpleGrid>
      </SectionWrapper>

      {/* Divider + Full Policy Header */}
      <SectionWrapper bg="gray.50" id="politica-completa">
        <SectionHeader
          badge={t('fullPolicy.title')}
          badgeIcon={FiFileText}
          heading={t('fullPolicy.title')}
          subtitle={t('fullPolicy.subtitle')}
        />

        {/* Expand/Collapse controls */}
        <HStack justify="center" spacing={4} mb={8}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FiMaximize2 />}
            onClick={handleExpandAll}
            borderColor="gray.300"
            color="gray.600"
            _hover={{ bg: 'white' }}
          >
            {t('controls.expandAll')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FiMinimize2 />}
            onClick={handleCollapseAll}
            borderColor="gray.300"
            color="gray.600"
            _hover={{ bg: 'white' }}
          >
            {t('controls.collapseAll')}
          </Button>
        </HStack>

        {/* Last updated */}
        <Text color="gray.400" fontSize="xs" textAlign="center" mb={6}>
          {t('lastUpdated')}
        </Text>

        {/* Accordion */}
        <Box maxW="900px" mx="auto" ref={accordionRef}>
          <Accordion
            allowMultiple
            index={expandedIndices}
            onChange={(indices) => setExpandedIndices(indices as number[])}
          >
            {sections.map((section, i) => (
              <AccordionItem
                key={i}
                id={`policy-section-${i}`}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                mb={3}
                bg="white"
                overflow="hidden"
              >
                <AccordionButton
                  py={4}
                  px={6}
                  _hover={{ bg: 'gray.50' }}
                  _expanded={{ bg: 'brand.50', borderBottomColor: 'gray.200' }}
                >
                  <HStack flex={1} spacing={3}>
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="brand.500"
                      bg="brand.50"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      minW="28px"
                      textAlign="center"
                    >
                      {i + 1}
                    </Text>
                    <Heading as="h3" size="sm" fontWeight="600" textAlign="left">
                      {section.title}
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={6} py={5}>
                  <Divider mb={4} />
                  <Text color="gray.600" fontSize="sm" lineHeight="tall" whiteSpace="pre-line">
                    {section.content}
                  </Text>
                  {section.items && (
                    <UnorderedList spacing={2} pl={4} mt={4}>
                      {section.items.map((item, j) => (
                        <ListItem key={j} color="gray.600" fontSize="sm" lineHeight="tall">
                          {item}
                        </ListItem>
                      ))}
                    </UnorderedList>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </SectionWrapper>

      <PageCTA
        heading={t('cta.heading')}
        subtitle={t('cta.subtitle')}
        primaryCTA={{
          label: t('cta.primaryLabel'),
          href: 'mailto:privacidade@catalisa.io',
          icon: FiMail,
        }}
        secondaryCTA={{
          label: t('cta.secondaryLabel'),
          to: WHATSAPP_URL,
        }}
      />
    </>
  );
}
