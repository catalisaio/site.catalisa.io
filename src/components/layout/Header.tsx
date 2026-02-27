import { useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure,
  Container,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiChevronDown,
  FiExternalLink,
  FiPlay,
  FiLayout,
  FiCpu,
  FiBox,
  FiGitBranch,
  FiFileText,
  FiMessageSquare,
  FiSend,
  FiLayers,
  FiHeadphones,
  FiShuffle,
  FiBarChart2,
  FiGrid,
  FiTarget,
  FiRepeat,
  FiSettings,
  FiDollarSign,
  FiHome,
  FiShield,
  FiShoppingCart,
  FiZap,
  FiMessageCircle,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { config } from '../../config';

type MegaMenuItem = {
  icon: IconType;
  labelKey: string;
  descKey: string;
  path: string;
};

type MegaMenuColumn = {
  titleKey: string;
  items: MegaMenuItem[];
};

type IndustryItem = {
  icon: IconType;
  labelKey: string;
  descKey: string;
  path: string;
};

// --- Mega-menu item component ---
function MegaMenuItemLink({
  item,
  t,
  onClose,
}: {
  item: MegaMenuItem;
  t: (key: string) => string;
  onClose: () => void;
}) {
  return (
    <Flex
      as={Link}
      to={item.path}
      gap={3}
      p={2}
      borderRadius="md"
      _hover={{ bg: 'brand.50' }}
      align="flex-start"
      onClick={onClose}
      role="group"
      transition="all 0.15s"
    >
      <Icon
        as={item.icon}
        boxSize={5}
        mt="2px"
        color="brand.500"
        _groupHover={{ color: 'brand.600' }}
      />
      <Box>
        <Text fontSize="sm" fontWeight="600" color="gray.800" _groupHover={{ color: 'brand.600' }}>
          {t(item.labelKey)}
        </Text>
        <Text fontSize="xs" color="gray.500" lineHeight="1.3">
          {t(item.descKey)}
        </Text>
      </Box>
    </Flex>
  );
}

// --- Compact menu item (icon + label only, no description) ---
function CompactMenuItemLink({
  item,
  t,
  onClose,
}: {
  item: MegaMenuItem;
  t: (key: string) => string;
  onClose: () => void;
}) {
  return (
    <Flex
      as={Link}
      to={item.path}
      gap={2}
      p={2}
      borderRadius="md"
      _hover={{ bg: 'brand.50' }}
      align="center"
      onClick={onClose}
      role="group"
      transition="all 0.15s"
    >
      <Icon
        as={item.icon}
        boxSize={4}
        color="brand.500"
        _groupHover={{ color: 'brand.600' }}
      />
      <Text fontSize="sm" fontWeight="500" color="gray.700" _groupHover={{ color: 'brand.600' }}>
        {t(item.labelKey)}
      </Text>
    </Flex>
  );
}

// --- Mega-menu popover wrapper with hover ---
function MegaMenuPopover({
  triggerLabel,
  isActive,
  isDarkHero,
  minW = '600px',
  maxW = '720px',
  bodyP = 5,
  onOpenCallback,
  children,
}: {
  triggerLabel: string;
  isActive: boolean;
  isDarkHero: boolean;
  minW?: string;
  maxW?: string;
  bodyP?: number;
  onOpenCallback?: () => void;
  children: (onClose: () => void) => React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
    onOpenCallback?.();
  }, [onOpen, onOpenCallback]);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(onClose, 200);
  }, [onClose]);

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      isLazy
      lazyBehavior="keepMounted"
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="sm"
          color={isDarkHero ? 'whiteAlpha.800' : 'gray.600'}
          fontWeight={isActive ? '600' : '400'}
          rightIcon={<FiChevronDown />}
          _hover={{
            color: isDarkHero ? 'white' : 'brand.500',
            bg: isDarkHero ? 'whiteAlpha.100' : 'brand.50',
          }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={() => { onOpen(); onOpenCallback?.(); }}
        >
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="auto"
        minW={minW}
        maxW={maxW}
        border="1px solid"
        borderColor="gray.100"
        boxShadow="xl"
        borderRadius="xl"
        bg="white"
        p={0}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        _focus={{ outline: 'none' }}
      >
        <PopoverBody p={bodyP}>{children(onClose)}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const { t } = useTranslation('common');
  const lp = useLocalizedPath();

  const pathname = location.pathname;
  const isHome = pathname === '/' || pathname === '/en';
  const isDarkHero =
    isHome ||
    ['/studio', '/contato', '/demo', '/apps', '/casos-de-uso', '/agentes-ia-whatsapp', '/en/studio', '/en/contact', '/en/demo', '/en/apps', '/en/use-cases', '/en/ai-agents-whatsapp'].includes(pathname);

  // --- Platform mega-menu data ---
  const platformColumns: MegaMenuColumn[] = [
    {
      titleKey: 'megaMenu.platform.products',
      items: [
        { icon: FiLayout, labelKey: 'megaMenu.platform.studio.label', descKey: 'megaMenu.platform.studio.desc', path: lp('/studio') },
        { icon: FiCpu, labelKey: 'megaMenu.platform.aiAgents.label', descKey: 'megaMenu.platform.aiAgents.desc', path: lp('/ai-agents') },
        { icon: FiGrid, labelKey: 'megaMenu.platform.apps.label', descKey: 'megaMenu.platform.apps.desc', path: lp('/apps') },
      ],
    },
    {
      titleKey: 'megaMenu.platform.infrastructure',
      items: [
        { icon: FiBox, labelKey: 'megaMenu.platform.blocks.label', descKey: 'megaMenu.platform.blocks.desc', path: lp('/building-blocks') },
        { icon: FiGitBranch, labelKey: 'megaMenu.platform.workflows.label', descKey: 'megaMenu.platform.workflows.desc', path: lp('/workflows') },
      ],
    },
    {
      titleKey: 'megaMenu.platform.resources',
      items: [
        { icon: FiFileText, labelKey: 'megaMenu.platform.useCases.label', descKey: 'megaMenu.platform.useCases.desc', path: lp('/casos-de-uso') },
        { icon: FiPlay, labelKey: 'megaMenu.platform.demo.label', descKey: 'megaMenu.platform.demo.desc', path: lp('/demo') },
      ],
    },
  ];

  // --- Solutions mega-menu data ---
  const solutionsColumns: MegaMenuColumn[] = [
    {
      titleKey: 'megaMenu.solutions.whatsapp.title',
      items: [
        { icon: FiMessageSquare, labelKey: 'megaMenu.solutions.whatsapp.support247.label', descKey: 'megaMenu.solutions.whatsapp.support247.desc', path: lp('/ai-agents') },
        { icon: FiSend, labelKey: 'megaMenu.solutions.whatsapp.campaigns.label', descKey: 'megaMenu.solutions.whatsapp.campaigns.desc', path: lp('/workflows') },
        { icon: FiLayers, labelKey: 'megaMenu.solutions.whatsapp.multichannel.label', descKey: 'megaMenu.solutions.whatsapp.multichannel.desc', path: lp('/building-blocks') },
        { icon: FiMessageCircle, labelKey: 'megaMenu.solutions.whatsapp.integration.label', descKey: 'megaMenu.solutions.whatsapp.integration.desc', path: lp('/integracoes/whatsapp') },
        { icon: FiCpu, labelKey: 'megaMenu.solutions.whatsapp.aiAgentsWhatsApp.label', descKey: 'megaMenu.solutions.whatsapp.aiAgentsWhatsApp.desc', path: lp('/agentes-ia-whatsapp') },
      ],
    },
    {
      titleKey: 'megaMenu.solutions.support.title',
      items: [
        { icon: FiHeadphones, labelKey: 'megaMenu.solutions.support.chatbots.label', descKey: 'megaMenu.solutions.support.chatbots.desc', path: lp('/ai-agents') },
        { icon: FiShuffle, labelKey: 'megaMenu.solutions.support.routing.label', descKey: 'megaMenu.solutions.support.routing.desc', path: lp('/workflows') },
        { icon: FiBarChart2, labelKey: 'megaMenu.solutions.support.dashboards.label', descKey: 'megaMenu.solutions.support.dashboards.desc', path: lp('/studio') },
      ],
    },
    {
      titleKey: 'megaMenu.solutions.sales.title',
      items: [
        { icon: FiTarget, labelKey: 'megaMenu.solutions.sales.qualification.label', descKey: 'megaMenu.solutions.sales.qualification.desc', path: lp('/casos-de-uso') },
        { icon: FiRepeat, labelKey: 'megaMenu.solutions.sales.followup.label', descKey: 'megaMenu.solutions.sales.followup.desc', path: lp('/workflows') },
        { icon: FiSettings, labelKey: 'megaMenu.solutions.sales.customWorkflows.label', descKey: 'megaMenu.solutions.sales.customWorkflows.desc', path: lp('/workflows') },
      ],
    },
  ];

  // --- Solutions featured items (shown prominently at top) ---
  const solutionsFeatured: MegaMenuItem[] = [
    { icon: FiCpu, labelKey: 'megaMenu.solutions.whatsapp.aiAgentsWhatsApp.label', descKey: 'megaMenu.solutions.whatsapp.aiAgentsWhatsApp.desc', path: lp('/agentes-ia-whatsapp') },
    { icon: FiGrid, labelKey: 'megaMenu.solutions.apps.label', descKey: 'megaMenu.solutions.apps.desc', path: lp('/apps') },
  ];

  // --- Industries data ---
  const industries: IndustryItem[] = [
    { icon: FiDollarSign, labelKey: 'megaMenu.industries.fintech.label', descKey: 'megaMenu.industries.fintech.desc', path: lp('/fintech') },
    { icon: FiHome, labelKey: 'megaMenu.industries.banking.label', descKey: 'megaMenu.industries.banking.desc', path: lp('/bancario') },
    { icon: FiShield, labelKey: 'megaMenu.industries.insurance.label', descKey: 'megaMenu.industries.insurance.desc', path: lp('/seguros') },
    { icon: FiShoppingCart, labelKey: 'megaMenu.industries.retail.label', descKey: 'megaMenu.industries.retail.desc', path: lp('/varejo') },
    { icon: FiZap, labelKey: 'megaMenu.industries.startups.label', descKey: 'megaMenu.industries.startups.desc', path: lp('/startups') },
  ];

  const allPlatformPaths = platformColumns.flatMap((c) => c.items.map((i) => i.path));
  const allIndustryPaths = industries.map((i) => i.path);
  const isPlatformActive = allPlatformPaths.includes(pathname);
  const isIndustryActive = allIndustryPaths.includes(pathname);

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={100}
      bg={isDarkHero ? 'rgba(10, 15, 20, 0.85)' : 'rgba(255,255,255,0.9)'}
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor={isDarkHero ? 'whiteAlpha.100' : 'gray.100'}
      transition="background 0.3s"
    >
      <Container maxW="1280px">
        <Flex h="64px" align="center" justify="space-between">
          {/* Logo */}
          <Link to={lp('/')}>
            <Flex align="center" fontWeight="800" fontSize="4xl">
              <Box as="span" color={isDarkHero ? 'white' : 'brand.500'}>
                Catalisa
              </Box>
              <Box as="span" color="#ECC94B">
                .
              </Box>
            </Flex>
          </Link>

          {/* Desktop nav */}
          <HStack as="nav" aria-label="Main Navigation" spacing={1} display={{ base: 'none', lg: 'flex' }}>
            {/* Plataforma mega-menu */}
            <MegaMenuPopover
              triggerLabel={t('megaMenu.platform.label')}
              isActive={isPlatformActive}
              isDarkHero={isDarkHero}
              minW="560px"
              maxW="680px"
              bodyP={6}
            >
              {(closeMega) => (
                <Flex gap={6}>
                  {/* Products & Infrastructure columns */}
                  {platformColumns.slice(0, 2).map((col) => (
                    <Box key={col.titleKey} flex="1" bg="gray.50" borderRadius="lg" p={4}>
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color="gray.400"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        mb={3}
                      >
                        {t(col.titleKey)}
                      </Text>
                      <VStack spacing={1} align="stretch">
                        {col.items.map((item) => (
                          <MegaMenuItemLink
                            key={item.labelKey}
                            item={item}
                            t={t}
                            onClose={closeMega}
                          />
                        ))}
                      </VStack>
                    </Box>
                  ))}

                  {/* Vertical divider */}
                  <Box w="1px" bg="gray.100" alignSelf="stretch" />

                  {/* Resources column — compact links */}
                  <Box minW="140px">
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="gray.400"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={3}
                    >
                      {t(platformColumns[2].titleKey)}
                    </Text>
                    <VStack spacing={1} align="stretch">
                      {platformColumns[2].items.map((item) => (
                        <CompactMenuItemLink
                          key={item.labelKey}
                          item={item}
                          t={t}
                          onClose={closeMega}
                        />
                      ))}
                    </VStack>
                  </Box>
                </Flex>
              )}
            </MegaMenuPopover>

            {/* Solucoes mega-menu — featured + open categories */}
            <MegaMenuPopover
              triggerLabel={t('megaMenu.solutions.label')}
              isActive={false}
              isDarkHero={isDarkHero}
              minW="640px"
              maxW="740px"
              bodyP={6}
            >
              {(closeMega) => (
                <Box>
                  {/* Featured items row */}
                  <Flex gap={4} mb={5}>
                    {solutionsFeatured.map((item) => (
                      <Flex
                        key={item.labelKey}
                        as={Link}
                        to={item.path}
                        flex="1"
                        gap={3}
                        p={4}
                        borderRadius="lg"
                        bg="gray.50"
                        _hover={{ bg: 'brand.50', borderColor: 'brand.200' }}
                        align="flex-start"
                        onClick={closeMega}
                        role="group"
                        transition="all 0.15s"
                        border="1px solid"
                        borderColor="gray.100"
                      >
                        <Flex
                          align="center"
                          justify="center"
                          w="36px"
                          h="36px"
                          borderRadius="lg"
                          bg="brand.100"
                          flexShrink={0}
                        >
                          <Icon
                            as={item.icon}
                            boxSize={5}
                            color="brand.600"
                            _groupHover={{ color: 'brand.700' }}
                          />
                        </Flex>
                        <Box>
                          <Text fontSize="sm" fontWeight="600" color="gray.800" _groupHover={{ color: 'brand.600' }}>
                            {t(item.labelKey)}
                          </Text>
                          <Text fontSize="xs" color="gray.500" lineHeight="1.3">
                            {t(item.descKey)}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </Flex>

                  {/* Divider */}
                  <Box h="1px" bg="gray.100" mb={4} />

                  {/* All categories open — compact items */}
                  <Flex gap={6}>
                    {solutionsColumns.map((col, colIdx) => {
                      const categoryColors = ['green.500', 'blue.400', 'orange.400'];
                      return (
                        <Box key={col.titleKey} flex="1">
                          <Flex align="center" gap={2} mb={2}>
                            <Box w="3px" h="14px" borderRadius="full" bg={categoryColors[colIdx]} />
                            <Text
                              fontSize="xs"
                              fontWeight="700"
                              color="gray.500"
                              textTransform="uppercase"
                              letterSpacing="wider"
                            >
                              {t(col.titleKey)}
                            </Text>
                          </Flex>
                          <VStack spacing={0} align="stretch">
                            {col.items.map((item) => (
                              <CompactMenuItemLink
                                key={item.labelKey}
                                item={item}
                                t={t}
                                onClose={closeMega}
                              />
                            ))}
                          </VStack>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
              )}
            </MegaMenuPopover>

            {/* Industrias mega-menu — compact list */}
            <MegaMenuPopover
              triggerLabel={t('megaMenu.industries.label')}
              isActive={isIndustryActive}
              isDarkHero={isDarkHero}
              minW="380px"
              maxW="440px"
            >
              {(closeMega) => (
                <VStack spacing={1} align="stretch">
                  {industries.map((item) => (
                    <Flex
                      key={item.labelKey}
                      as={Link}
                      to={item.path}
                      gap={3}
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: 'brand.50' }}
                      align="center"
                      onClick={closeMega}
                      role="group"
                      transition="all 0.15s"
                    >
                      <Flex
                        align="center"
                        justify="center"
                        w="32px"
                        h="32px"
                        borderRadius="md"
                        bg="brand.50"
                        flexShrink={0}
                      >
                        <Icon
                          as={item.icon}
                          boxSize={4}
                          color="brand.500"
                          _groupHover={{ color: 'brand.600' }}
                        />
                      </Flex>
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.800"
                          _groupHover={{ color: 'brand.600' }}
                        >
                          {t(item.labelKey)}
                        </Text>
                        <Text fontSize="xs" color="gray.500" lineHeight="1.3">
                          {t(item.descKey)}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              )}
            </MegaMenuPopover>

            {/* Casos de Uso — top-level link */}
            <Button
              as={Link}
              to={lp('/casos-de-uso')}
              variant="ghost"
              size="sm"
              color={isDarkHero ? 'whiteAlpha.800' : 'gray.600'}
              fontWeight={pathname === lp('/casos-de-uso') ? '600' : '400'}
              _hover={{
                color: isDarkHero ? 'white' : 'brand.500',
                bg: isDarkHero ? 'whiteAlpha.100' : 'brand.50',
              }}
            >
              {t('nav.useCases')}
            </Button>

            {/* Insights — top-level link */}
            <Button
              as={Link}
              to={lp('/insights')}
              variant="ghost"
              size="sm"
              color={isDarkHero ? 'whiteAlpha.800' : 'gray.600'}
              fontWeight={pathname.startsWith(lp('/insights')) ? '600' : '400'}
              _hover={{
                color: isDarkHero ? 'white' : 'brand.500',
                bg: isDarkHero ? 'whiteAlpha.100' : 'brand.50',
              }}
            >
              {t('nav.insights')}
            </Button>

            {/* Developers link */}
            <Button
              as="a"
              href={config.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="sm"
              color={isDarkHero ? 'whiteAlpha.800' : 'gray.600'}
              fontWeight="400"
              rightIcon={<FiExternalLink size={12} />}
              _hover={{
                color: isDarkHero ? 'white' : 'brand.500',
                bg: isDarkHero ? 'whiteAlpha.100' : 'brand.50',
              }}
            >
              {t('nav.developers')}
            </Button>
          </HStack>

          {/* Right CTA area */}
          <HStack spacing={3}>
            <Button
              as={Link}
              to={lp('/demo')}
              size="sm"
              leftIcon={<FiPlay />}
              bgGradient="linear(to-r, green.500, green.400)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, green.600, green.500)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px -2px rgba(37, 211, 102, 0.4)',
              }}
              transition="all 0.2s"
              borderRadius="lg"
              display={{ base: 'none', md: 'inline-flex' }}
            >
              {t('cta.seeDemo')}
            </Button>
            <Box display={{ base: 'none', md: 'inline-flex' }}>
              <LanguageSwitcher isDark={isDarkHero} />
            </Box>
            <IconButton
              aria-label="Menu"
              icon={<FiMenu />}
              variant="ghost"
              color={isDarkHero ? 'white' : 'gray.700'}
              display={{ base: 'flex', lg: 'none' }}
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Container>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={12}>
            <VStack spacing={4} align="stretch">
              {/* Language switcher — top, prominent */}
              <Box pb={2}>
                <LanguageSwitcher isDark={false} />
              </Box>

              <Accordion allowMultiple>
                {/* Plataforma */}
                <AccordionItem border="none">
                  <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                    <Text flex="1" textAlign="left" fontWeight="600" fontSize="md">
                      {t('megaMenu.platform.label')}
                    </Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={2}>
                    <VStack spacing={0} align="stretch">
                      {platformColumns.flatMap((col) =>
                        col.items.map((item) => (
                          <Button
                            key={item.labelKey}
                            as={Link}
                            to={item.path}
                            variant="ghost"
                            justifyContent="flex-start"
                            fontWeight={pathname === item.path ? '600' : '400'}
                            size="sm"
                            pl={4}
                            onClick={onClose}
                            leftIcon={<Icon as={item.icon} color="brand.500" />}
                          >
                            {t(item.labelKey)}
                          </Button>
                        ))
                      )}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Solucoes */}
                <AccordionItem border="none">
                  <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                    <Text flex="1" textAlign="left" fontWeight="600" fontSize="md">
                      {t('megaMenu.solutions.label')}
                    </Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={2}>
                    <VStack spacing={3} align="stretch">
                      {/* Featured solutions */}
                      {solutionsFeatured.map((item) => (
                        <Button
                          key={item.labelKey}
                          as={Link}
                          to={item.path}
                          variant="ghost"
                          justifyContent="flex-start"
                          fontWeight={pathname === item.path ? '600' : '400'}
                          size="sm"
                          pl={4}
                          onClick={onClose}
                          leftIcon={<Icon as={item.icon} color="brand.600" />}
                        >
                          {t(item.labelKey)}
                        </Button>
                      ))}
                      {solutionsColumns.map((col) => (
                        <Box key={col.titleKey}>
                          <Text
                            fontSize="xs"
                            fontWeight="700"
                            color="gray.400"
                            textTransform="uppercase"
                            px={4}
                            mb={1}
                          >
                            {t(col.titleKey)}
                          </Text>
                          {col.items.map((item) => (
                            <Button
                              key={item.labelKey}
                              as={Link}
                              to={item.path}
                              variant="ghost"
                              justifyContent="flex-start"
                              fontWeight={pathname === item.path ? '600' : '400'}
                              size="sm"
                              pl={6}
                              onClick={onClose}
                              leftIcon={<Icon as={item.icon} color="brand.500" />}
                            >
                              {t(item.labelKey)}
                            </Button>
                          ))}
                        </Box>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Industrias */}
                <AccordionItem border="none">
                  <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                    <Text flex="1" textAlign="left" fontWeight="600" fontSize="md">
                      {t('megaMenu.industries.label')}
                    </Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={0} pb={2}>
                    <VStack spacing={0} align="stretch">
                      {industries.map((item) => (
                        <Button
                          key={item.labelKey}
                          as={Link}
                          to={item.path}
                          variant="ghost"
                          justifyContent="flex-start"
                          fontWeight={pathname === item.path ? '600' : '400'}
                          size="sm"
                          pl={4}
                          onClick={onClose}
                          leftIcon={<Icon as={item.icon} color="brand.500" />}
                        >
                          {t(item.labelKey)}
                        </Button>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              {/* Casos de Uso */}
              <Button
                as={Link}
                to={lp('/casos-de-uso')}
                variant="ghost"
                justifyContent="flex-start"
                fontWeight={pathname === lp('/casos-de-uso') ? '600' : '400'}
                onClick={onClose}
              >
                {t('nav.useCases')}
              </Button>

              {/* Insights */}
              <Button
                as={Link}
                to={lp('/insights')}
                variant="ghost"
                justifyContent="flex-start"
                fontWeight={pathname.startsWith(lp('/insights')) ? '600' : '400'}
                onClick={onClose}
              >
                {t('nav.insights')}
              </Button>

              {/* Developers */}
              <Button
                as="a"
                href={config.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                justifyContent="flex-start"
                fontWeight="400"
                rightIcon={<FiExternalLink size={12} />}
                onClick={onClose}
              >
                {t('nav.developers')}
              </Button>

              {/* CTAs */}
              <Box pt={2}>
                <VStack spacing={3}>
                  <Button
                    as={Link}
                    to={lp('/demo')}
                    w="full"
                    leftIcon={<FiPlay />}
                    bgGradient="linear(to-r, green.500, green.400)"
                    color="white"
                    _hover={{ bgGradient: 'linear(to-r, green.600, green.500)' }}
                    borderRadius="lg"
                    onClick={onClose}
                  >
                    {t('cta.seeDemo')}
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
