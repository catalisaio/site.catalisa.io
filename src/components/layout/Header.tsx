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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiChevronDown, FiMessageCircle, FiExternalLink, FiPlay } from 'react-icons/fi';
import { config } from '../../config';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

const navItems = [
  { label: 'Studio', path: '/studio' },
  { label: 'AI Agents', path: '/ai-agents' },
  { label: 'Building Blocks', path: '/building-blocks' },
  { label: 'Workflows', path: '/workflows' },
  { label: 'Casos de Uso', path: '/use-cases' },
];

const verticalItems = [
  { label: 'Fintech', path: '/fintech' },
  { label: 'Bancario', path: '/bancario' },
  { label: 'Seguros', path: '/seguros' },
  { label: 'Varejo', path: '/varejo' },
  { label: 'Startups', path: '/startups' },
];

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDarkHero = isHome || location.pathname === '/studio' || location.pathname === '/contato' || location.pathname === '/demo';
  const isVerticalPage = verticalItems.some((v) => v.path === location.pathname);

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
          <Link to="/">
            <Flex align="center" fontWeight="800" fontSize="4xl">
              <Box as="span" color={isDarkHero ? 'white' : 'brand.500'}>Catalisa</Box>
              <Box as="span" color="#ECC94B">.</Box>
            </Flex>
          </Link>

          {/* Desktop nav */}
          <HStack spacing={1} display={{ base: 'none', lg: 'flex' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                as={Link}
                to={item.path}
                variant="ghost"
                size="sm"
                color={isDarkHero ? 'whiteAlpha.800' : 'gray.600'}
                fontWeight={location.pathname === item.path ? '600' : '400'}
                _hover={{
                  color: isDarkHero ? 'white' : 'brand.500',
                  bg: isDarkHero ? 'whiteAlpha.100' : 'brand.50',
                }}
              >
                {item.label}
              </Button>
            ))}

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
              Developers
            </Button>

            {/* Verticais dropdown */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                color={isDarkHero ? 'whiteAlpha.800' : 'gray.600'}
                fontWeight={isVerticalPage ? '600' : '400'}
                rightIcon={<FiChevronDown />}
                _hover={{
                  color: isDarkHero ? 'white' : 'brand.500',
                  bg: isDarkHero ? 'whiteAlpha.100' : 'brand.50',
                }}
              >
                Verticais
              </MenuButton>
              <MenuList
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                boxShadow="lg"
                minW="180px"
              >
                {verticalItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    as={Link}
                    to={item.path}
                    fontSize="sm"
                    fontWeight={location.pathname === item.path ? '600' : '400'}
                    color={location.pathname === item.path ? 'brand.500' : 'gray.700'}
                    _hover={{ bg: 'brand.50', color: 'brand.500' }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </HStack>

          <HStack spacing={3}>
            <Button
              as={Link}
              to="/demo"
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
              Ver Demo Real
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
              Vamos conversar
            </Button>
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
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={12}>
            <VStack spacing={2} align="stretch">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  as={Link}
                  to={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  fontWeight={location.pathname === item.path ? '600' : '400'}
                  onClick={onClose}
                >
                  {item.label}
                </Button>
              ))}

              {/* Verticais section in mobile */}
              <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase" pt={3} px={4}>
                Verticais
              </Text>
              {verticalItems.map((item) => (
                <Button
                  key={item.path}
                  as={Link}
                  to={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  fontWeight={location.pathname === item.path ? '600' : '400'}
                  onClick={onClose}
                  pl={6}
                >
                  {item.label}
                </Button>
              ))}

              <Box pt={4}>
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
                  Developers
                </Button>
              </Box>

              <Box>
                <Button
                  as={Link}
                  to="/demo"
                  w="full"
                  leftIcon={<FiPlay />}
                  bgGradient="linear(to-r, green.500, green.400)"
                  color="white"
                  _hover={{ bgGradient: 'linear(to-r, green.600, green.500)' }}
                  borderRadius="lg"
                  onClick={onClose}
                >
                  Ver Demo Real
                </Button>
              </Box>

              <Box>
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
                  Vamos conversar
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
