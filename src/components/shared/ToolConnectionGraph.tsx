import { useState } from 'react';
import { Box, Text, VStack, SimpleGrid, HStack, Icon, Flex } from '@chakra-ui/react';
import { FiCheck, FiDatabase, FiCalendar, FiDollarSign, FiMail, FiCode, FiPackage, FiPlus } from 'react-icons/fi';
import {
  SiSalesforce, SiHubspot, SiZoho,
  SiSap, SiTotvs, SiShopify,
  SiGooglecalendar, SiCalendly, SiGooglemeet,
  SiStripe, SiMercadopago, SiPaypal,
  SiGmail, SiMailchimp, SiSendgrid,
  SiZapier, SiMake, SiN8N,
} from 'react-icons/si';
import { AnimatePresence } from 'framer-motion';
import { MotionBox } from '../motion';
import type { IconType } from 'react-icons';

interface ToolData {
  name: string;
  actions: string[];
}

interface ToolConnectionGraphProps {
  tools: ToolData[];
  moreLabel?: string;
}

interface Brand {
  name: string;
  icon: IconType;
  color: string;
}

const toolCategoryIcons: Record<string, IconType> = {
  CRM: FiDatabase,
  ERP: FiPackage,
  'Calendário': FiCalendar,
  Calendar: FiCalendar,
  Pagamentos: FiDollarSign,
  Payments: FiDollarSign,
  'E-mail': FiMail,
  Email: FiMail,
  'APIs Custom': FiCode,
  'Custom APIs': FiCode,
};

const categoryBrands: Record<string, Brand[]> = {
  CRM: [
    { name: 'Salesforce', icon: SiSalesforce, color: '#00A1E0' },
    { name: 'HubSpot', icon: SiHubspot, color: '#FF7A59' },
    { name: 'Zoho', icon: SiZoho, color: '#E42527' },
  ],
  ERP: [
    { name: 'SAP', icon: SiSap, color: '#0FAAFF' },
    { name: 'TOTVS', icon: SiTotvs, color: '#00A5E3' },
    { name: 'Shopify', icon: SiShopify, color: '#96BF48' },
  ],
  'Calendário': [
    { name: 'Google Calendar', icon: SiGooglecalendar, color: '#4285F4' },
    { name: 'Calendly', icon: SiCalendly, color: '#006BFF' },
    { name: 'Google Meet', icon: SiGooglemeet, color: '#00897B' },
  ],
  Calendar: [
    { name: 'Google Calendar', icon: SiGooglecalendar, color: '#4285F4' },
    { name: 'Calendly', icon: SiCalendly, color: '#006BFF' },
    { name: 'Google Meet', icon: SiGooglemeet, color: '#00897B' },
  ],
  Pagamentos: [
    { name: 'Stripe', icon: SiStripe, color: '#635BFF' },
    { name: 'Mercado Pago', icon: SiMercadopago, color: '#00B1EA' },
    { name: 'PayPal', icon: SiPaypal, color: '#003087' },
  ],
  Payments: [
    { name: 'Stripe', icon: SiStripe, color: '#635BFF' },
    { name: 'PayPal', icon: SiPaypal, color: '#003087' },
    { name: 'Mercado Pago', icon: SiMercadopago, color: '#00B1EA' },
  ],
  'E-mail': [
    { name: 'Gmail', icon: SiGmail, color: '#EA4335' },
    { name: 'Mailchimp', icon: SiMailchimp, color: '#FFE01B' },
    { name: 'SendGrid', icon: SiSendgrid, color: '#1A82E2' },
  ],
  Email: [
    { name: 'Gmail', icon: SiGmail, color: '#EA4335' },
    { name: 'Mailchimp', icon: SiMailchimp, color: '#FFE01B' },
    { name: 'SendGrid', icon: SiSendgrid, color: '#1A82E2' },
  ],
  'APIs Custom': [
    { name: 'Zapier', icon: SiZapier, color: '#FF4A00' },
    { name: 'Make', icon: SiMake, color: '#6D00CC' },
    { name: 'n8n', icon: SiN8N, color: '#EA4B71' },
  ],
  'Custom APIs': [
    { name: 'Zapier', icon: SiZapier, color: '#FF4A00' },
    { name: 'Make', icon: SiMake, color: '#6D00CC' },
    { name: 'n8n', icon: SiN8N, color: '#EA4B71' },
  ],
};

const categoryAccentColors: Record<string, string> = {
  CRM: '#00A1E0',
  ERP: '#0FAAFF',
  'Calendário': '#4285F4',
  Calendar: '#4285F4',
  Pagamentos: '#635BFF',
  Payments: '#635BFF',
  'E-mail': '#EA4335',
  Email: '#EA4335',
  'APIs Custom': '#FF4A00',
  'Custom APIs': '#FF4A00',
};

export function ToolConnectionGraph({ tools, moreLabel = 'e mais...' }: ToolConnectionGraphProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = tools[selectedIndex];
  const brands = categoryBrands[selected.name] || [];
  const accentColor = categoryAccentColors[selected.name] || '#734B9C';

  return (
    <VStack spacing={8} w="full">
      {/* Category selector pills */}
      <Flex gap={2} flexWrap="wrap" justify="center">
        {tools.map((tool, i) => {
          const CategoryIcon = toolCategoryIcons[tool.name] || FiCode;
          const isActive = i === selectedIndex;
          const accent = categoryAccentColors[tool.name] || '#734B9C';

          return (
            <Box
              key={tool.name}
              as="button"
              onClick={() => setSelectedIndex(i)}
              px={4}
              py={2}
              borderRadius="full"
              bg={isActive ? accent : 'gray.100'}
              color={isActive ? 'white' : 'gray.600'}
              fontWeight={isActive ? '600' : '500'}
              fontSize="sm"
              transition="all 0.2s"
              _hover={{
                bg: isActive ? accent : 'gray.200',
                transform: 'translateY(-1px)',
              }}
              display="flex"
              alignItems="center"
              gap={2}
              whiteSpace="nowrap"
            >
              <Icon as={CategoryIcon} boxSize={4} />
              {tool.name}
            </Box>
          );
        })}
      </Flex>

      {/* Brand logos + Actions */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={selected.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          w="full"
        >
          {/* Brand logos grid */}
          <SimpleGrid
            columns={{ base: 2, sm: 4 }}
            spacing={4}
            mb={8}
            maxW="560px"
            mx="auto"
          >
            {brands.map((brand) => (
              <VStack
                key={brand.name}
                spacing={3}
                py={5}
                px={3}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.100"
                shadow="sm"
                transition="all 0.2s"
                cursor="default"
                _hover={{
                  borderColor: brand.color,
                  transform: 'translateY(-3px)',
                  shadow: 'lg',
                }}
              >
                <Box
                  p={3}
                  borderRadius="xl"
                  bg={`${brand.color}14`}
                >
                  <Icon as={brand.icon} boxSize={8} color={brand.color} />
                </Box>
                <Text fontSize="xs" fontWeight="600" color="gray.700" textAlign="center" lineHeight="1.2">
                  {brand.name}
                </Text>
              </VStack>
            ))}

            {/* "+ more" card */}
            <VStack
              spacing={3}
              py={5}
              px={3}
              borderRadius="xl"
              border="2px dashed"
              borderColor="gray.200"
              justify="center"
              cursor="default"
              transition="all 0.2s"
              _hover={{
                borderColor: 'gray.300',
              }}
            >
              <Box p={3} borderRadius="xl" bg="gray.50">
                <Icon as={FiPlus} boxSize={8} color="gray.400" />
              </Box>
              <Text fontSize="xs" fontWeight="600" color="gray.400" textAlign="center">
                {moreLabel}
              </Text>
            </VStack>
          </SimpleGrid>

          {/* Actions panel */}
          <Box
            p={6}
            borderRadius="2xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {selected.actions.map((action, i) => (
                <HStack key={i} spacing={2}>
                  <Box as={FiCheck} color={accentColor} boxSize={4} flexShrink={0} />
                  <Text fontSize="sm" color="gray.600">
                    {action}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        </MotionBox>
      </AnimatePresence>
    </VStack>
  );
}
