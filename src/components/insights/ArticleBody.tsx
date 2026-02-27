import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Flex,
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiZap, FiTarget, FiArrowRight, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import { MotionBox, fadeInUp } from '../motion';
import type { Article, ArticleSection as SectionType } from '../../data/articles';

interface ArticleBodyProps {
  article: Article;
}

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

/** Renders a blockquote-style callout for important quotes/data */
function DataCallout({ text }: { text: string }) {
  return (
    <Box
      borderLeft="4px solid"
      borderColor="brand.400"
      bg="brand.50"
      px={6}
      py={5}
      borderRadius="0 xl xl 0"
      my={6}
    >
      <Text
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="600"
        color="gray.700"
        lineHeight="1.6"
        fontStyle="italic"
      >
        {text}
      </Text>
    </Box>
  );
}

/** Inline CTA banner that appears mid-article */
function InlineCTA({ t, lp }: { t: (k: string) => string; lp: (p: string) => string }) {
  return (
    <MotionBox {...fadeInUp}>
      <Box
        bgGradient="linear(to-r, gray.900, gray.800)"
        borderRadius="2xl"
        p={{ base: 6, md: 8 }}
        my={10}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-50%"
          right="-20%"
          w="300px"
          h="300px"
          bgGradient="radial(circle, rgba(115, 75, 156, 0.2) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={4}
          position="relative"
          zIndex={1}
        >
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={1}>
            <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
              {t('article.inlineCta.heading')}
            </Text>
            <Text color="whiteAlpha.700" fontSize="sm">
              {t('article.inlineCta.subtitle')}
            </Text>
          </VStack>
          <HStack spacing={3} flexShrink={0}>
            <Button
              as="a"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              bg="whatsapp.500"
              color="white"
              _hover={{ bg: 'whatsapp.600', transform: 'translateY(-1px)' }}
              leftIcon={<FiMessageCircle />}
              transition="all 0.2s"
              fontWeight="600"
            >
              WhatsApp
            </Button>
            <Button
              as={Link}
              to={lp('/demo')}
              size="sm"
              variant="outline"
              color="white"
              borderColor="whiteAlpha.300"
              _hover={{ bg: 'whiteAlpha.100' }}
              rightIcon={<FiArrowRight />}
            >
              Demo
            </Button>
          </HStack>
        </Flex>
      </Box>
    </MotionBox>
  );
}

/** Metric highlight cards shown inline within article body */
function InlineMetrics({ article, t }: { article: Article; t: (k: string) => string }) {
  if (article.metrics.length === 0) return null;

  const icons = [FiTrendingUp, FiZap, FiTarget];

  return (
    <SimpleGrid columns={{ base: 1, sm: Math.min(article.metrics.length, 3) }} spacing={4} my={8}>
      {article.metrics.slice(0, 3).map((metric, i) => (
        <MotionBox
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <HStack
            bg="white"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="xl"
            p={4}
            spacing={4}
            _hover={{ borderColor: 'brand.200', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <Flex
              w={10}
              h={10}
              borderRadius="lg"
              bg="brand.50"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={icons[i % icons.length]} color="brand.500" boxSize={5} />
            </Flex>
            <VStack spacing={0} align="flex-start">
              <Text
                fontSize="xl"
                fontWeight="800"
                bgGradient="linear(to-r, brand.600, brand.400)"
                bgClip="text"
                lineHeight="1.2"
              >
                {t(metric.valueKey.replace('insights.', ''))}
              </Text>
              <Text fontSize="xs" color="gray.500" lineHeight="1.3">
                {t(metric.labelKey.replace('insights.', ''))}
              </Text>
            </VStack>
          </HStack>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
}

/** Detects lines that start with "- **" as bold list items */
function renderParagraph(text: string, idx: number) {
  // Check for markdown-like bold list items
  if (text.startsWith('- **') || text.startsWith('* **')) {
    const items = text.split('\n').filter(Boolean);
    return (
      <VStack key={idx} spacing={2} align="stretch" mb={4} pl={2}>
        {items.map((item, i) => {
          const cleaned = item.replace(/^[-*]\s*/, '');
          // Split on **text** patterns
          const parts = cleaned.split(/\*\*(.*?)\*\*/);
          return (
            <HStack key={i} spacing={3} align="flex-start">
              <Box w={1.5} h={1.5} borderRadius="full" bg="brand.400" mt={2.5} flexShrink={0} />
              <Text fontSize="md" color="gray.600" lineHeight="1.8">
                {parts.map((part, pi) =>
                  pi % 2 === 1 ? (
                    <Text as="span" key={pi} fontWeight="700" color="gray.800">
                      {part}
                    </Text>
                  ) : (
                    <Text as="span" key={pi}>{part}</Text>
                  )
                )}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    );
  }

  // Check for a numbered list (lines starting with "1. ", "2. ", etc.)
  if (/^\d+\.\s/.test(text)) {
    const items = text.split('\n').filter(Boolean);
    return (
      <VStack key={idx} spacing={3} align="stretch" mb={4}>
        {items.map((item, i) => {
          const cleaned = item.replace(/^\d+\.\s*/, '');
          const parts = cleaned.split(/\*\*(.*?)\*\*/);
          return (
            <HStack key={i} spacing={3} align="flex-start">
              <Flex
                w={6}
                h={6}
                borderRadius="full"
                bg="brand.50"
                align="center"
                justify="center"
                flexShrink={0}
                mt={0.5}
              >
                <Text fontSize="xs" fontWeight="700" color="brand.600">
                  {i + 1}
                </Text>
              </Flex>
              <Text fontSize="md" color="gray.600" lineHeight="1.8">
                {parts.map((part, pi) =>
                  pi % 2 === 1 ? (
                    <Text as="span" key={pi} fontWeight="700" color="gray.800">
                      {part}
                    </Text>
                  ) : (
                    <Text as="span" key={pi}>{part}</Text>
                  )
                )}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    );
  }

  // Regular paragraph with bold support
  const parts = text.split(/\*\*(.*?)\*\*/);
  return (
    <Text key={idx} fontSize="md" color="gray.600" lineHeight="1.8" mb={4}>
      {parts.map((part, pi) =>
        pi % 2 === 1 ? (
          <Text as="span" key={pi} fontWeight="700" color="gray.800">
            {part}
          </Text>
        ) : (
          <Text as="span" key={pi}>{part}</Text>
        )
      )}
    </Text>
  );
}

/** Decides which visual treatment a section gets based on type and position */
function renderSection(
  section: SectionType,
  index: number,
  article: Article,
  t: (k: string) => string,
) {
  const content = t(section.contentKey.replace('insights.', ''));
  const paragraphs = content.split('\n\n');

  // Intro — larger text with a vertical accent bar
  if (section.type === 'intro') {
    return (
      <MotionBox key={index} {...fadeInUp} mb={8}>
        <Box borderLeft="3px solid" borderColor="brand.300" pl={6}>
          {paragraphs.map((p, pi) => (
            <Text
              key={pi}
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.700"
              lineHeight="1.8"
              mb={pi < paragraphs.length - 1 ? 4 : 0}
              fontWeight={pi === 0 ? '500' : '400'}
            >
              {p}
            </Text>
          ))}
        </Box>

        {/* Show metrics inline right after intro */}
        <InlineMetrics article={article} t={t} />
      </MotionBox>
    );
  }

  // Challenge — with a subtle warning-style background
  if (section.type === 'challenge') {
    return (
      <MotionBox key={index} {...fadeInUp} transition={{ duration: 0.5, delay: 0.05 }} mb={10}>
        {section.headingKey && (
          <Heading as="h2" size="md" fontWeight="700" mb={4} color="gray.800">
            {t(section.headingKey.replace('insights.', ''))}
          </Heading>
        )}
        <Box bg="orange.50" borderRadius="xl" p={{ base: 5, md: 6 }} border="1px solid" borderColor="orange.100">
          {paragraphs.map((p, pi) => renderParagraph(p, pi))}
        </Box>
      </MotionBox>
    );
  }

  // Results — with data callout for the first paragraph
  if (section.type === 'results') {
    return (
      <MotionBox key={index} {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }} mb={10}>
        {section.headingKey && (
          <Heading as="h2" size="md" fontWeight="700" mb={4} color="gray.800">
            {t(section.headingKey.replace('insights.', ''))}
          </Heading>
        )}
        {paragraphs.length > 0 && <DataCallout text={paragraphs[0]} />}
        {paragraphs.slice(1).map((p, pi) => renderParagraph(p, pi))}
      </MotionBox>
    );
  }

  // Analysis sections (thematic articles) — alternate visual treatments
  if (section.type === 'analysis') {
    const isEven = index % 2 === 0;
    return (
      <MotionBox key={index} {...fadeInUp} transition={{ duration: 0.5, delay: 0.05 }} mb={10}>
        {section.headingKey && (
          <Heading as="h2" size="md" fontWeight="700" mb={4} color="gray.800">
            {t(section.headingKey.replace('insights.', ''))}
          </Heading>
        )}
        <Box
          bg={isEven ? 'gray.50' : 'white'}
          borderRadius="xl"
          p={isEven ? { base: 5, md: 6 } : 0}
          border={isEven ? '1px solid' : 'none'}
          borderColor="gray.100"
        >
          {paragraphs.map((p, pi) => renderParagraph(p, pi))}
        </Box>
      </MotionBox>
    );
  }

  // Default (solution, etc.)
  return (
    <MotionBox key={index} {...fadeInUp} transition={{ duration: 0.5, delay: 0.05 }} mb={10}>
      {section.headingKey && (
        <Heading as="h2" size="md" fontWeight="700" mb={4} color="gray.800">
          {t(section.headingKey.replace('insights.', ''))}
        </Heading>
      )}
      {paragraphs.map((p, pi) => renderParagraph(p, pi))}
    </MotionBox>
  );
}

export function ArticleBody({ article }: ArticleBodyProps) {
  const { t } = useTranslation('insights');
  const lp = useLocalizedPath();

  const bodySections = article.sections.filter((s) => s.type !== 'catalisa');

  // Insert inline CTA after ~60% of sections
  const ctaInsertIndex = Math.floor(bodySections.length * 0.6);

  return (
    <Box py={{ base: 8, md: 12 }}>
      <Container maxW="780px">
        {bodySections.map((section, i) => (
          <Box key={i}>
            {renderSection(section, i, article, t)}
            {i === ctaInsertIndex && <InlineCTA t={t} lp={lp} />}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
