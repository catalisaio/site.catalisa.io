import { useState, useCallback } from 'react';
import {
  Box, Container, Heading, Text, VStack, SimpleGrid, HStack, Image,
  Button, Flex, List, ListItem, ListIcon, useColorModeValue, Icon,
  Menu, MenuButton, MenuList, MenuItem,
} from '@chakra-ui/react';
import { FiDownload, FiCheck, FiX, FiCopy, FiMail, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const BRAND_COLORS = [
  { key: 'primary', hex: '#734B9C' },
  { key: 'secondary', hex: '#FDC234' },
  { key: 'dark', hex: '#1A1D23' },
  { key: 'white', hex: '#FFFFFF' },
] as const;

type DownloadOption = { label: string; href: string };

const LOGO_VARIANTS = [
  { key: 'color', file: 'logo-full-color.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/logo-full-color.svg' },
    { label: 'PNG 200h', href: '/brand/logos/color/logo-color-200h.png' },
    { label: 'PNG 400h', href: '/brand/logos/color/logo-color-400h.png' },
    { label: 'PNG 800h', href: '/brand/logos/color/logo-color-800h.png' },
  ] },
  { key: 'white', file: 'logo-full-white.svg', bg: 'gray.800', downloads: [
    { label: 'SVG', href: '/brand/logo-full-white.svg' },
    { label: 'PNG 200h', href: '/brand/logos/white/logo-white-200h.png' },
    { label: 'PNG 400h', href: '/brand/logos/white/logo-white-400h.png' },
    { label: 'PNG 800h', href: '/brand/logos/white/logo-white-800h.png' },
  ] },
  { key: 'dark', file: 'logo-full-dark.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/logo-full-dark.svg' },
    { label: 'PNG 200h', href: '/brand/logos/dark/logo-dark-200h.png' },
    { label: 'PNG 400h', href: '/brand/logos/dark/logo-dark-400h.png' },
    { label: 'PNG 800h', href: '/brand/logos/dark/logo-dark-800h.png' },
  ] },
] as const;

const ICON_VARIANTS = [
  { key: 'color', file: 'icon-color.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/icon-color.svg' },
    { label: 'PNG 64x64', href: '/brand/icons/icon-64x64.png' },
    { label: 'PNG 128x128', href: '/brand/icons/icon-128x128.png' },
    { label: 'PNG 256x256', href: '/brand/icons/icon-256x256.png' },
    { label: 'PNG 512x512', href: '/brand/icons/icon-512x512.png' },
    { label: 'PNG 1024x1024', href: '/brand/icons/icon-1024x1024.png' },
  ] },
  { key: 'onWhite', file: 'icon-on-white.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/icon-on-white.svg' },
    { label: 'PNG 64x64', href: '/brand/icons/on-white/icon-on-white-64x64.png' },
    { label: 'PNG 128x128', href: '/brand/icons/on-white/icon-on-white-128x128.png' },
    { label: 'PNG 256x256', href: '/brand/icons/on-white/icon-on-white-256x256.png' },
    { label: 'PNG 512x512', href: '/brand/icons/on-white/icon-on-white-512x512.png' },
    { label: 'PNG 1024x1024', href: '/brand/icons/on-white/icon-on-white-1024x1024.png' },
  ] },
  { key: 'transparent', file: 'icon-transparent.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/icon-transparent.svg' },
    { label: 'PNG 64x64', href: '/brand/icons/transparent/icon-transparent-64x64.png' },
    { label: 'PNG 128x128', href: '/brand/icons/transparent/icon-transparent-128x128.png' },
    { label: 'PNG 256x256', href: '/brand/icons/transparent/icon-transparent-256x256.png' },
    { label: 'PNG 512x512', href: '/brand/icons/transparent/icon-transparent-512x512.png' },
    { label: 'PNG 1024x1024', href: '/brand/icons/transparent/icon-transparent-1024x1024.png' },
  ] },
  { key: 'monoWhite', file: 'icon-mono-white.svg', bg: 'gray.800', downloads: [
    { label: 'SVG', href: '/brand/icon-mono-white.svg' },
    { label: 'PNG 64x64', href: '/brand/icons/mono-white/icon-mono-white-64x64.png' },
    { label: 'PNG 128x128', href: '/brand/icons/mono-white/icon-mono-white-128x128.png' },
    { label: 'PNG 256x256', href: '/brand/icons/mono-white/icon-mono-white-256x256.png' },
    { label: 'PNG 512x512', href: '/brand/icons/mono-white/icon-mono-white-512x512.png' },
    { label: 'PNG 1024x1024', href: '/brand/icons/mono-white/icon-mono-white-1024x1024.png' },
  ] },
  { key: 'monoDark', file: 'icon-mono-dark.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/icon-mono-dark.svg' },
    { label: 'PNG 64x64', href: '/brand/icons/mono-dark/icon-mono-dark-64x64.png' },
    { label: 'PNG 128x128', href: '/brand/icons/mono-dark/icon-mono-dark-128x128.png' },
    { label: 'PNG 256x256', href: '/brand/icons/mono-dark/icon-mono-dark-256x256.png' },
    { label: 'PNG 512x512', href: '/brand/icons/mono-dark/icon-mono-dark-512x512.png' },
    { label: 'PNG 1024x1024', href: '/brand/icons/mono-dark/icon-mono-dark-1024x1024.png' },
  ] },
  { key: 'monoPurple', file: 'icon-mono-purple.svg', bg: 'gray.50', downloads: [
    { label: 'SVG', href: '/brand/icon-mono-purple.svg' },
    { label: 'PNG 64x64', href: '/brand/icons/mono-purple/icon-mono-purple-64x64.png' },
    { label: 'PNG 128x128', href: '/brand/icons/mono-purple/icon-mono-purple-128x128.png' },
    { label: 'PNG 256x256', href: '/brand/icons/mono-purple/icon-mono-purple-256x256.png' },
    { label: 'PNG 512x512', href: '/brand/icons/mono-purple/icon-mono-purple-512x512.png' },
    { label: 'PNG 1024x1024', href: '/brand/icons/mono-purple/icon-mono-purple-1024x1024.png' },
  ] },
] as const;

const TYPOGRAPHY_WEIGHTS = [400, 500, 600, 700, 800] as const;

function ColorSwatch({ hex, name, usage, copiedText }: { hex: string; name: string; usage: string; copiedText: string }) {
  const [copied, setCopied] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [hex]);

  return (
    <Box
      onClick={handleCopy}
      cursor="pointer"
      borderRadius="xl"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
    >
      <Box
        h="80px"
        bg={hex}
        border={hex === '#FFFFFF' ? '1px solid' : 'none'}
        borderColor="gray.200"
      />
      <Box p={3}>
        <HStack justify="space-between">
          <Text fontWeight="700" fontSize="sm">{name}</Text>
          <Text fontFamily="mono" fontSize="xs" color="gray.500">
            {copied ? copiedText : hex}
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.500" mt={1}>{usage}</Text>
      </Box>
    </Box>
  );
}

function AssetCard({ src, label, bg, downloads }: { src: string; label: string; bg: string; downloads: readonly DownloadOption[] }) {
  return (
    <VStack
      spacing={3}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      transition="all 0.2s"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
    >
      <Flex
        bg={bg}
        w="full"
        h="120px"
        align="center"
        justify="center"
        p={4}
        borderTopRadius="xl"
        sx={bg === 'gray.800' ? {
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        } : {
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      >
        <Image src={src} alt={label} maxH="80px" maxW="160px" objectFit="contain" />
      </Flex>
      <VStack spacing={1} px={3} pb={3} w="full">
        <Text fontSize="xs" fontWeight="600" textAlign="center">{label}</Text>
        {downloads.length === 1 ? (
          <Button
            as="a"
            href={downloads[0].href}
            download
            size="xs"
            variant="ghost"
            colorScheme="purple"
            leftIcon={<FiDownload />}
          >
            {downloads[0].label}
          </Button>
        ) : (
          <Menu strategy="fixed" placement="bottom">
            <MenuButton
              as={Button}
              size="xs"
              variant="ghost"
              colorScheme="purple"
              leftIcon={<FiDownload />}
              rightIcon={<FiChevronDown />}
            >
              Download
            </MenuButton>
            <MenuList minW="160px" fontSize="xs" zIndex="popover">
              {downloads.map((dl) => (
                <MenuItem
                  key={dl.label}
                  as="a"
                  href={dl.href}
                  download
                  fontSize="xs"
                  icon={<FiDownload />}
                >
                  {dl.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </VStack>
    </VStack>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <VStack align="flex-start" spacing={2} w="full">
      <Heading as="h2" size="lg" fontWeight="700">
        {title}
      </Heading>
      {description && (
        <Text color="gray.600" fontSize="sm">{description}</Text>
      )}
    </VStack>
  );
}

function CopyableBlock({ text, copiedLabel }: { text: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Box
      position="relative"
      bg="gray.50"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={6}
      cursor="pointer"
      onClick={handleCopy}
      transition="all 0.2s"
      _hover={{ shadow: 'sm', borderColor: 'gray.300' }}
    >
      <Text fontSize="sm" lineHeight="1.7" color="gray.700">
        {text}
      </Text>
      <HStack
        position="absolute"
        top={3}
        right={3}
        spacing={1}
        color={copied ? 'green.500' : 'gray.400'}
        fontSize="xs"
      >
        <Icon as={copied ? FiCheck : FiCopy} />
        <Text>{copied ? copiedLabel : ''}</Text>
      </HStack>
    </Box>
  );
}

export function PressKit() {
  const { t } = useTranslation('press-kit');

  return (
    <Box pt={24} pb={16}>
      <Container maxW="1080px">
        <VStack spacing={16} align="flex-start">
          {/* Hero */}
          <VStack align="flex-start" spacing={3}>
            <Heading as="h1" size="2xl" fontWeight="800">
              {t('hero.title')}
            </Heading>
            <Text color="gray.600" fontSize="lg" maxW="600px">
              {t('hero.subtitle')}
            </Text>
          </VStack>

          {/* Boilerplate */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('boilerplate.title')}
              description={t('boilerplate.description')}
            />
            <CopyableBlock
              text={t('boilerplate.text')}
              copiedLabel={t('boilerplate.copied')}
            />
          </VStack>

          {/* Key Facts */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('keyFacts.title')}
              description={t('keyFacts.description')}
            />
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
              {(t('keyFacts.items', { returnObjects: true }) as { label: string; value: string }[]).map((fact) => (
                <Box
                  key={fact.label}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  p={5}
                  textAlign="center"
                >
                  <Text fontSize="2xl" fontWeight="800" color="brand.500">
                    {fact.value}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1} fontWeight="500">
                    {fact.label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Colors */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('colors.title')}
              description={t('colors.description')}
            />
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
              {BRAND_COLORS.map((color) => (
                <ColorSwatch
                  key={color.key}
                  hex={color.hex}
                  name={t(`colors.${color.key}.name`)}
                  usage={t(`colors.${color.key}.usage`)}
                  copiedText={t('colors.copied')}
                />
              ))}
            </SimpleGrid>
          </VStack>

          {/* Typography */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('typography.title')}
              description={t('typography.description')}
            />
            <Box
              w="full"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
            >
              <Box bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.200">
                <HStack justify="space-between" align="center">
                  <Heading as="h3" size="md" fontWeight="700">
                    {t('typography.fontName')}
                  </Heading>
                  <Text fontSize="xs" color="gray.500">
                    Google Fonts — Open Source (OFL)
                  </Text>
                </HStack>
              </Box>
              <VStack spacing={0} divider={<Box borderBottom="1px solid" borderColor="gray.100" w="full" />}>
                {TYPOGRAPHY_WEIGHTS.map((weight) => {
                  const weightData = (t('typography.weights', { returnObjects: true }) as { name: string; weight: number }[])
                    .find(w => w.weight === weight);
                  return (
                    <HStack key={weight} px={6} py={4} w="full" justify="space-between">
                      <Text
                        fontFamily="'Inter', sans-serif"
                        fontWeight={weight}
                        fontSize="lg"
                      >
                        {t('typography.sample')}
                      </Text>
                      <Text fontSize="xs" color="gray.500" flexShrink={0} ml={4}>
                        {weightData?.name} ({weight})
                      </Text>
                    </HStack>
                  );
                })}
              </VStack>
            </Box>
          </VStack>

          {/* Logos */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('logos.title')}
              description={t('logos.description')}
            />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
              {LOGO_VARIANTS.map((logo) => (
                <AssetCard
                  key={logo.key}
                  src={`/brand/${logo.file}`}
                  label={t(`logos.${logo.key}`)}
                  bg={logo.bg}
                  downloads={logo.downloads}
                />
              ))}
            </SimpleGrid>
          </VStack>

          {/* Icons */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('icons.title')}
              description={t('icons.description')}
            />
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} w="full">
              {ICON_VARIANTS.map((icon) => (
                <AssetCard
                  key={icon.key}
                  src={`/brand/${icon.file}`}
                  label={t(`icons.${icon.key}`)}
                  bg={icon.bg}
                  downloads={icon.downloads}
                />
              ))}
            </SimpleGrid>
          </VStack>

          {/* Guidelines */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('guidelines.title')}
              description={t('guidelines.description')}
            />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
              {/* Do */}
              <Box borderRadius="xl" border="1px solid" borderColor="green.200" p={6} bg="green.50">
                <Heading as="h3" size="sm" color="green.700" mb={4}>
                  {t('guidelines.do.title')}
                </Heading>
                <List spacing={3}>
                  {(t('guidelines.do.items', { returnObjects: true }) as string[]).map((item) => (
                    <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="green.800">
                      <ListIcon as={FiCheck} color="green.500" mt={1} />
                      {item}
                    </ListItem>
                  ))}
                </List>
              </Box>
              {/* Don't */}
              <Box borderRadius="xl" border="1px solid" borderColor="red.200" p={6} bg="red.50">
                <Heading as="h3" size="sm" color="red.700" mb={4}>
                  {t('guidelines.dont.title')}
                </Heading>
                <List spacing={3}>
                  {(t('guidelines.dont.items', { returnObjects: true }) as string[]).map((item) => (
                    <ListItem key={item} display="flex" alignItems="flex-start" fontSize="sm" color="red.800">
                      <ListIcon as={FiX} color="red.500" mt={1} />
                      {item}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </SimpleGrid>
          </VStack>

          {/* Press Contact */}
          <VStack align="flex-start" spacing={6} w="full">
            <SectionTitle
              title={t('contact.title')}
              description={t('contact.description')}
            />
            <Box
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              p={6}
              w="full"
            >
              <HStack spacing={4} align="center">
                <Flex
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="brand.50"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={FiMail} color="brand.500" boxSize={5} />
                </Flex>
                <VStack align="flex-start" spacing={0}>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    {t('contact.emailLabel')}
                  </Text>
                  <Text
                    as="a"
                    href={`mailto:${t('contact.email')}`}
                    fontSize="md"
                    fontWeight="600"
                    color="brand.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {t('contact.email')}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {t('contact.response')}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>

          {/* Download All */}
          <Flex
            w="full"
            bg="brand.500"
            borderRadius="xl"
            p={8}
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            gap={4}
          >
            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={1}>
              <Heading as="h3" size="md" color="white" fontWeight="700">
                {t('downloadAll.label')}
              </Heading>
              <Text color="whiteAlpha.800" fontSize="sm">
                {t('downloadAll.description')}
              </Text>
            </VStack>
            <Button
              as="a"
              href="/brand/catalisa-brand-assets.zip"
              download
              size="lg"
              bg="white"
              color="brand.500"
              _hover={{ bg: 'gray.100' }}
              leftIcon={<FiDownload />}
              flexShrink={0}
            >
              {t('downloadAll.button')}
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
