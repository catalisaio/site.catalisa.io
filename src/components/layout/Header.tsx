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
  SimpleGrid,
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
  FiMessageCircle,
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
  FiTarget,
  FiRepeat,
  FiSettings,
  FiDollarSign,
  FiHome,
  FiShield,
  FiShoppingCart,
  FiZap,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { config } from '../../config';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

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
        <Text fontSize="xs" color="gray.500" lineHeight="short">
          {t(item.descKey)}
        </Text>
      </Box>
    </Flex>
  );
}

// --- Mega-menu popover wrapper with hover ---
function MegaMenuPopover({
  triggerLabel,
  isActive,
  isDarkHero,
  children,
}: {
  triggerLabel: string;
  isActive: boolean;
  isDarkHero: boolean;
  children: (onClose: () => void) => React.ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  }, [onOpen]);

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
          onClick={onOpen}
        >
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="auto"
        minW="600px"
        maxW="720px"
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
        <PopoverBody p={5}>{children(onClose)}</PopoverBody>
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
    ['/studio', '/contato', '/demo', '/en/studio', '/en/contact', '/en/demo'].includes(pathname);

  // --- Platform mega-menu data ---
  const platformColumns: MegaMenuColumn[] = [
    {
      titleKey: 'megaMenu.platform.products',
      items: [
        { icon: FiLayout, labelKey: 'megaMenu.platform.studio.label', descKey: 'megaMenu.platform.studio.desc', path: lp('/studio') },
        { icon: FiCpu, labelKey: 'megaMenu.platform.aiAgents.label', descKey: 'megaMenu.platform.aiAgents.desc', path: lp('/ai-agents') },
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
        { icon: FiFileText, labelKey: 'megaMenu.platform.useCases.label', descKey: 'megaMenu.platform.useCases.desc', path: lp('/use-cases') },
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
        { icon: FiTarget, labelKey: 'megaMenu.solutions.sales.qualification.label', descKey: 'megaMenu.solutions.sales.qualification.desc', path: lp('/use-cases') },
        { icon: FiRepeat, labelKey: 'megaMenu.solutions.sales.followup.label', descKey: 'megaMenu.solutions.sales.followup.desc', path: lp('/workflows') },
        { icon: FiSettings, labelKey: 'megaMenu.solutions.sales.customWorkflows.label', descKey: 'megaMenu.solutions.sales.customWorkflows.desc', path: lp('/workflows') },
      ],
    },
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
          <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
            {/* Plataforma mega-menu */}
            <MegaMenuPopover
              triggerLabel={t('megaMenu.platform.label')}
              isActive={isPlatformActive}
              isDarkHero={isDarkHero}
            >
              {(closeMega) => (
                <SimpleGrid columns={3} spacing={4}>
                  {platformColumns.map((col) => (
                    <Box key={col.titleKey}>
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
                </SimpleGrid>
              )}
            </MegaMenuPopover>

            {/* Solucoes mega-menu */}
            <MegaMenuPopover
              triggerLabel={t('megaMenu.solutions.label')}
              isActive={false}
              isDarkHero={isDarkHero}
            >
              {(closeMega) => (
                <SimpleGrid columns={3} spacing={4}>
                  {solutionsColumns.map((col) => (
                    <Box key={col.titleKey}>
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
                </SimpleGrid>
              )}
            </MegaMenuPopover>

            {/* Industrias mega-menu */}
            <MegaMenuPopover
              triggerLabel={t('megaMenu.industries.label')}
              isActive={isIndustryActive}
              isDarkHero={isDarkHero}
            >
              {(closeMega) => (
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                  {industries.map((item) => (
                    <Flex
                      key={item.labelKey}
                      as={Link}
                      to={item.path}
                      gap={3}
                      p={3}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="gray.100"
                      _hover={{ borderColor: 'brand.200', bg: 'brand.50' }}
                      align="flex-start"
                      onClick={closeMega}
                      role="group"
                    >
                      <Icon
                        as={item.icon}
                        boxSize={5}
                        mt="2px"
                        color="brand.500"
                        _groupHover={{ color: 'brand.600' }}
                      />
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.800"
                          _groupHover={{ color: 'brand.600' }}
                        >
                          {t(item.labelKey)}
                        </Text>
                        <Text fontSize="xs" color="gray.500" lineHeight="short">
                          {t(item.descKey)}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              )}
            </MegaMenuPopover>

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
            <Button
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              size="sm"
              bg="whatsapp.500"
              color="white"
              _hover={{ bg: 'whatsapp.600' }}
              leftIcon={<FiMessageCircle />}
              display={{ base: 'none', md: 'inline-flex' }}
            >
              {t('cta.letsChat')}
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
                  <Button
                    as="a"
                    href={WHATSAPP_URL}
                    target="_blank"
                    w="full"
                    bg="whatsapp.500"
                    color="white"
                    _hover={{ bg: 'whatsapp.600' }}
                    leftIcon={<FiMessageCircle />}
                  >
                    {t('cta.letsChat')}
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
