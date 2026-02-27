import { Box, Container, Flex, HStack, VStack, Text, Link as ChakraLink, SimpleGrid } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { config } from '../../config';

type FooterLink = { label: string; to?: string; href?: string };

export function Footer() {
  const { t } = useTranslation('common');
  const lp = useLocalizedPath();

  const footerSections: { title: string; links: FooterLink[] }[] = [
    {
      title: t('footer.sections.platform'),
      links: [
        { label: t('megaMenu.platform.studio.label'), to: lp('/studio') },
        { label: t('megaMenu.platform.aiAgents.label'), to: lp('/ai-agents') },
        { label: t('footer.links.apps'), to: lp('/apps') },
        { label: t('megaMenu.platform.blocks.label'), to: lp('/building-blocks') },
        { label: t('megaMenu.platform.workflows.label'), to: lp('/workflows') },
      ],
    },
    {
      title: t('footer.sections.industries'),
      links: [
        { label: t('megaMenu.industries.fintech.label'), to: lp('/fintech') },
        { label: t('megaMenu.industries.banking.label'), to: lp('/bancario') },
        { label: t('megaMenu.industries.insurance.label'), to: lp('/seguros') },
        { label: t('megaMenu.industries.retail.label'), to: lp('/varejo') },
        { label: t('megaMenu.industries.startups.label'), to: lp('/startups') },
      ],
    },
    {
      title: t('footer.sections.developer'),
      links: [
        { label: t('footer.links.documentation'), href: config.docsUrl },
        { label: t('footer.links.apiReference'), href: config.apiReferenceUrl },
      ],
    },
    {
      title: t('footer.sections.company'),
      links: [
        { label: t('footer.links.useCases'), to: lp('/casos-de-uso') },
        { label: t('footer.links.insights'), to: lp('/insights') },
        { label: t('footer.links.howItWorks'), to: lp('/como-funciona') },
        { label: t('footer.links.whatsappIntegration'), to: lp('/integracoes/whatsapp') },
        { label: t('footer.links.demo'), to: lp('/demo') },
        { label: t('footer.links.contact'), to: lp('/contato') },
        { label: t('footer.links.privacyPolicy'), to: lp('/politica-privacidade') },
        { label: t('footer.links.termsOfUse'), to: lp('/termos') },
        { label: t('footer.links.security'), to: lp('/seguranca') },
        { label: t('footer.links.pressKit'), to: lp('/press-kit') },
      ],
    },
  ];

  return (
    <Box bg="gray.900" color="whiteAlpha.800" pt={16} pb={8}>
      <Container maxW="1280px">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={10} mb={12}>
          {/* Brand column */}
          <VStack align="flex-start" spacing={4}>
            <Flex align="center" fontWeight="800" fontSize="xl">
              <Box as="span" color="white">Catalisa</Box>
              <Box as="span" color="#ECC94B">.</Box>
            </Flex>
            <Text fontSize="sm" color="whiteAlpha.700" lineHeight="tall">
              {t('footer.description')}
            </Text>
            <HStack spacing={3}>
              <ChakraLink href="https://wa.me/5511977303414" aria-label="WhatsApp" _hover={{ color: 'whatsapp.400' }} isExternal>
                <FiMessageCircle size={18} />
              </ChakraLink>
            </HStack>
          </VStack>

          {/* Link columns */}
          {footerSections.map((section) => (
            <VStack key={section.title} align="flex-start" spacing={3}>
              <Text fontWeight="600" color="white" fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                {section.title}
              </Text>
              {section.links.map((link) =>
                link.to ? (
                  <ChakraLink
                    key={link.label}
                    as={Link}
                    to={link.to}
                    fontSize="sm"
                    color="whiteAlpha.700"
                    _hover={{ color: 'white' }}
                  >
                    {link.label}
                  </ChakraLink>
                ) : (
                  <ChakraLink
                    key={link.label}
                    href={link.href}
                    fontSize="sm"
                    color="whiteAlpha.700"
                    _hover={{ color: 'white' }}
                    isExternal
                  >
                    {link.label}
                  </ChakraLink>
                )
              )}
            </VStack>
          ))}
        </SimpleGrid>

        <Box borderTop="1px solid" borderColor="whiteAlpha.100" pt={6}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="xs" color="whiteAlpha.500">
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </Text>
            <HStack spacing={4} fontSize="xs" color="whiteAlpha.500">
              <Text>{t('badges.lgpd')}</Text>
              <Text>{t('badges.metaWhatsApp')}</Text>
              <Text>{t('badges.dataBrazil')}</Text>
            </HStack>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
