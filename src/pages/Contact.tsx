import {
  Box, Heading, Text, VStack, HStack, Button, Icon, SimpleGrid, Divider,
  FormControl, FormLabel, Input, Textarea, Checkbox, Link as ChakraLink, useToast,
} from '@chakra-ui/react';
import { FiMessageCircle, FiPlay, FiClock, FiHeart, FiMonitor, FiSend, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../components/motion';
import { PageHero } from '../components/shared/PageHero';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { WhatsAppChatPreview } from '../components/shared/WhatsAppChatPreview';
import type { ChatMessage } from '../components/shared/WhatsAppChatPreview';
import { BehindTheScenesModal, useBehindTheScenes } from '../components/shared/BehindTheScenesModal';
import { useLocalizedPath } from '../i18n/useLocalizedPath';

export function Contact() {
  const { t } = useTranslation('contact');
  const { t: tc } = useTranslation('common');
  const lp = useLocalizedPath();
  const behindTheScenes = useBehindTheScenes();
  const toast = useToast();
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const contactMessages: ChatMessage[] = [
    { text: t('chat.messages.0'), sent: false, delay: 0.3 },
    { text: t('chat.messages.1'), sent: true, delay: 1.0 },
    { text: t('chat.messages.2'), sent: false, delay: 1.8 },
    { text: t('chat.messages.3'), sent: true, delay: 2.6 },
  ];

  const differentials = [
    { icon: FiClock, title: t('differentials.0.title'), description: t('differentials.0.description') },
    { icon: FiHeart, title: t('differentials.1.title'), description: t('differentials.1.description') },
    { icon: FiMonitor, title: t('differentials.2.title'), description: t('differentials.2.description') },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: t('form.success'),
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      {/* Hero with WhatsApp Chat Preview */}
      <PageHero
        badge={t('hero.badge')}
        heading={t('hero.heading')}
        headingGradient={t('hero.headingGradient')}
        subtitle={t('hero.subtitle')}
        primaryCTA={{ label: t('hero.ctaWhatsApp') }}
      >
        <Box display={{ base: 'none', lg: 'block' }}>
          <WhatsAppChatPreview
            messages={contactMessages}
            title={t('chat.title')}
            triggerMode="auto"
          />
        </Box>
      </PageHero>

      {/* Contact Form Section */}
      <SectionWrapper>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 16 }}>
          {/* Form */}
          <VStack align="stretch" spacing={6}>
            <VStack align="flex-start" spacing={2}>
              <HStack spacing={2}>
                <Icon as={FiMail} color="brand.500" />
                <Heading as="h2" size="lg" fontWeight="700">{t('form.heading')}</Heading>
              </HStack>
              <Text color="gray.500" fontSize="sm">{t('form.subtitle')}</Text>
            </VStack>

            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600">{t('form.name')}</FormLabel>
                    <Input name="name" placeholder={t('form.name')} size="md" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600">{t('form.email')}</FormLabel>
                    <Input name="email" type="email" placeholder={t('form.email')} size="md" />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600">{t('form.company')}</FormLabel>
                    <Input name="company" placeholder={t('form.company')} size="md" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600">{t('form.role')}</FormLabel>
                    <Input name="role" placeholder={t('form.role')} size="md" />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600">{t('form.phone')}</FormLabel>
                  <Input name="phone" type="tel" placeholder={t('form.phone')} size="md" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">{t('form.message')}</FormLabel>
                  <Textarea name="message" placeholder={t('form.message')} size="md" rows={4} resize="vertical" />
                </FormControl>

                <Checkbox
                  isChecked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  size="sm"
                  colorScheme="brand"
                >
                  <Text fontSize="xs" color="gray.600">
                    {t('form.privacy')}{' '}
                    <ChakraLink as={Link} to={lp('/politica-privacidade')} color="brand.500" fontWeight="600">
                      {t('form.privacyLink')}
                    </ChakraLink>
                  </Text>
                </Checkbox>

                <Button
                  type="submit"
                  size="lg"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'brand.600', transform: 'translateY(-2px)' }}
                  leftIcon={<FiSend />}
                  fontWeight="700"
                  isDisabled={!privacyAccepted}
                  transition="all 0.2s"
                >
                  {t('form.submit')}
                </Button>
              </VStack>
            </Box>
          </VStack>

          {/* Right side: WhatsApp alternative + differentials */}
          <VStack spacing={8} align="stretch">
            <Box bg="whatsapp.50" border="1px solid" borderColor="whatsapp.200" borderRadius="xl" p={6}>
              <VStack spacing={3} align="flex-start">
                <Text fontWeight="700" fontSize="md">{t('form.whatsappAlternative')}</Text>
                <Button
                  as="a"
                  href="https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa."
                  target="_blank"
                  rel="noopener noreferrer"
                  size="md"
                  bg="whatsapp.500"
                  color="white"
                  _hover={{ bg: 'whatsapp.600' }}
                  leftIcon={<FiMessageCircle />}
                  fontWeight="600"
                >
                  {t('form.whatsappCta')}
                </Button>
                <Text fontSize="xs" color="gray.500">{t('form.responseTime')}</Text>
              </VStack>
            </Box>

            <Divider />

            {differentials.map((diff, i) => (
              <MotionBox
                key={diff.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <HStack
                  spacing={4}
                  p={5}
                  bg="gray.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  _hover={{ borderColor: 'brand.200', boxShadow: 'sm', transform: 'translateY(-4px)' }}
                  transition="all 0.2s"
                >
                  <Box p={3} borderRadius="xl" bg="brand.50" flexShrink={0}>
                    <Icon as={diff.icon} boxSize={5} color="brand.500" />
                  </Box>
                  <VStack align="flex-start" spacing={1}>
                    <Text fontWeight="700" fontSize="sm">{diff.title}</Text>
                    <Text color="gray.500" fontSize="sm" lineHeight="1.6">{diff.description}</Text>
                  </VStack>
                </HStack>
              </MotionBox>
            ))}

            {/* Behind the scenes hint */}
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <HStack
                as="button"
                onClick={behindTheScenes.onOpen}
                spacing={3}
                px={4}
                py={2.5}
                bg="brand.50"
                border="1px solid"
                borderColor="brand.100"
                borderRadius="xl"
                cursor="pointer"
                _hover={{ bg: 'brand.100', borderColor: 'brand.300' }}
                transition="all 0.2s"
                w="full"
              >
                <Box as={FiPlay} color="brand.500" boxSize={4} />
                <Text color="brand.600" fontSize="sm" fontWeight="600">
                  {tc('behindTheScenes.hint')}
                </Text>
              </HStack>
            </MotionBox>
          </VStack>
        </SimpleGrid>
      </SectionWrapper>

      <BehindTheScenesModal isOpen={behindTheScenes.isOpen} onClose={behindTheScenes.onClose} />
    </>
  );
}
