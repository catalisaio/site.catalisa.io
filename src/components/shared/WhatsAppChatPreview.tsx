import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';

export interface ChatMessage {
  text: string;
  sent: boolean;
  delay: number;
  time?: string;
}

export function useCreditMessages(): ChatMessage[] {
  const { t } = useTranslation('home');
  return t('chatPreview.creditMessages', { returnObjects: true }) as ChatMessage[];
}

export function useInsuranceMessages(): ChatMessage[] {
  const { t } = useTranslation('home');
  return t('chatPreview.insuranceMessages', { returnObjects: true }) as ChatMessage[];
}

export function usePensionMessages(): ChatMessage[] {
  const { t } = useTranslation('home');
  return t('chatPreview.pensionMessages', { returnObjects: true }) as ChatMessage[];
}

interface WhatsAppChatPreviewProps {
  messages: ChatMessage[];
  title?: string;
  triggerMode?: 'inView' | 'auto';
}

export function WhatsAppChatPreview({ messages, title, triggerMode = 'inView' }: WhatsAppChatPreviewProps) {
  const { t } = useTranslation('home');
  const displayTitle = title ?? t('chatPreview.creditTitle');

  return (
    <Box
      maxW="360px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="2xl"
      bg="#0B141A"
    >
      {/* Header */}
      <Flex
        bg="#1F2C34"
        px={4}
        py={3}
        align="center"
        gap={3}
      >
        <Box w={8} h={8} borderRadius="full" bg="brand.500" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontSize="xs" fontWeight="bold">IA</Text>
        </Box>
        <Box>
          <Text color="white" fontSize="sm" fontWeight="600">{displayTitle}</Text>
          <Text color="whiteAlpha.600" fontSize="xs">{t('chatPreview.online')}</Text>
        </Box>
      </Flex>

      {/* Messages */}
      <VStack
        spacing={2}
        p={3}
        minH="280px"
        align="stretch"
        bg="#0B141A"
        sx={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='p' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23p)'/%3E%3C/svg%3E\")" }}
      >
        {messages.map((msg, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            {...(triggerMode === 'auto'
              ? { animate: { opacity: 1, y: 0, scale: 1 } }
              : { whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true } }
            )}
            transition={{ delay: msg.delay, duration: 0.4 }}
            alignSelf={msg.sent ? 'flex-end' : 'flex-start'}
            maxW="85%"
          >
            <Box
              bg={msg.sent ? '#005C4B' : '#1F2C34'}
              color="white"
              px={3}
              py={2}
              borderRadius="lg"
              borderTopRightRadius={msg.sent ? '4px' : 'lg'}
              borderTopLeftRadius={msg.sent ? 'lg' : '4px'}
              fontSize="sm"
              whiteSpace="pre-line"
              lineHeight="1.5"
            >
              {msg.text}
              <Text as="span" fontSize="2xs" color="whiteAlpha.500" ml={2} float="right" mt={1}>
                {msg.time || `${9 + Math.floor(i / 2)}:${(10 + i * 3).toString().padStart(2, '0')}`}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </VStack>
    </Box>
  );
}
