import { Box, Heading, HStack, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  articleLocale,
  isPublishedChannelUrl,
  type ChannelCitation,
  type ChannelVoice,
} from '../../data/channelArticles';

function formatPostedAt(postedAt: string, language: string): string {
  const date = new Date(postedAt.length <= 10 ? `${postedAt}T12:00:00-03:00` : postedAt);
  if (Number.isNaN(date.getTime())) return postedAt;
  return new Intl.DateTimeFormat(language === 'en-US' ? 'en-US' : 'pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
}

function voiceLabel(voice: ChannelVoice, t: (key: string) => string): string {
  if (voice === 'klederson') return t('article.voiceKlederson');
  return t('article.voiceCatalisa');
}

/**
 * Footer block listing only real https channel URLs.
 * Empty when every citation fails the published-URL check.
 */
export function ChannelCitations({ channels }: { channels: ChannelCitation[] }) {
  const { t, i18n } = useTranslation('articles');
  const locale = articleLocale(i18n.language);
  const visible = channels.filter((channel) => isPublishedChannelUrl(channel.url));

  if (visible.length === 0) return null;

  return (
    <Box
      as="section"
      aria-labelledby="channel-citations-title"
      bg="gray.50"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      p={{ base: 5, md: 6 }}
    >
      <Heading as="h2" id="channel-citations-title" size="sm" fontWeight="700" color="gray.800" mb={2}>
        {t('article.channelsTitle')}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={5} lineHeight="1.6">
        {t('article.channelsLead')}
      </Text>
      <VStack as="ul" spacing={4} align="stretch" listStyleType="none" m={0} p={0}>
        {visible.map((channel) => {
          const voice = voiceLabel(channel.voice, t);
          const posted = formatPostedAt(channel.postedAt, i18n.language);
          return (
            <Box as="li" key={`${channel.voice}-${channel.url}`}>
              <Link
                href={channel.url}
                isExternal
                rel="noopener noreferrer"
                color="brand.700"
                _hover={{ color: 'brand.500' }}
                display="block"
              >
                <HStack spacing={2} align="baseline" flexWrap="wrap">
                  <Text as="span" fontWeight="700" fontSize="sm" color="gray.900">
                    {channel.label}
                  </Text>
                  <Text as="span" fontSize="sm" color="gray.500">
                    · {voice}
                  </Text>
                  <Text as="span" fontSize="sm" color="gray.500">
                    · {posted}
                  </Text>
                  <Icon as={FiExternalLink} aria-hidden boxSize={3.5} color="brand.500" />
                </HStack>
                <Text as="span" display="block" mt={1} fontSize="xs" fontFamily="mono" color="brand.600" wordBreak="break-all">
                  {channel.url}
                </Text>
              </Link>
              <Text srOnly>
                {locale === 'en'
                  ? `${channel.label}, ${voice}, published ${posted}`
                  : `${channel.label}, ${voice}, publicado em ${posted}`}
              </Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
