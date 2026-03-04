import { lazy, Suspense } from 'react';
import {
  Box, Heading, Text, VStack, UnorderedList, OrderedList,
  ListItem, Alert, AlertIcon, Code, Spinner, Center,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { ContentBlock } from '../../data/trainingBlockTypes';

// Simple blocks (small, always loaded)
import { CalloutBlock } from './blocks/CalloutBlock';
import { AccordionFAQBlock } from './blocks/AccordionFAQBlock';
import { ComparisonTableBlock } from './blocks/ComparisonTableBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { DividerBlock } from './blocks/DividerBlock';

// Heavy blocks (lazy loaded)
const StepByStepBlock = lazy(() => import('./blocks/StepByStepBlock').then(m => ({ default: m.StepByStepBlock })));
const DiagramAnimatedBlock = lazy(() => import('./blocks/DiagramAnimatedBlock').then(m => ({ default: m.DiagramAnimatedBlock })));
const QuizBlock = lazy(() => import('./blocks/QuizBlock').then(m => ({ default: m.QuizBlock })));
const MockUIBlock = lazy(() => import('./blocks/MockUIBlock').then(m => ({ default: m.MockUIBlock })));
const SandboxBlock = lazy(() => import('./blocks/SandboxBlock').then(m => ({ default: m.SandboxBlock })));
const InteractiveDemoBlock = lazy(() => import('./blocks/InteractiveDemoBlock').then(m => ({ default: m.InteractiveDemoBlock })));

interface LessonContentProps {
  contentKey: string;
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
  contentBlocks?: ContentBlock[];
}

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Center py={8}><Spinner size="md" color="purple.500" /></Center>}>
      {children}
    </Suspense>
  );
}

function renderBlock(block: ContentBlock, i: number, context?: { courseSlug?: string; moduleSlug?: string; lessonSlug?: string }) {
  switch (block.type) {
    case 'heading':
      return (
        <Heading key={i} as={block.level || 'h3'} size="sm" fontWeight="700" mt={i > 0 ? 2 : 0}>
          {block.text}
        </Heading>
      );
    case 'paragraph':
      return (
        <Text key={i} color="gray.700" fontSize="sm" lineHeight="tall">
          {block.text}
        </Text>
      );
    case 'list': {
      const ListComp = block.ordered ? OrderedList : UnorderedList;
      return (
        <ListComp key={i} spacing={1} pl={4}>
          {block.items?.map((item, j) => (
            <ListItem key={j} fontSize="sm" color="gray.700">{item}</ListItem>
          ))}
        </ListComp>
      );
    }
    case 'alert':
      return (
        <Alert key={i} status={block.alertStatus || 'info'} borderRadius="lg" fontSize="sm">
          <AlertIcon />
          {block.text}
        </Alert>
      );
    case 'code':
      return (
        <Box key={i} w="full" p={4} bg="gray.800" borderRadius="lg" overflowX="auto">
          <Code colorScheme="gray" bg="transparent" color="green.300" fontSize="xs" whiteSpace="pre">
            {block.text}
          </Code>
        </Box>
      );
    case 'callout':
      return <CalloutBlock key={i} block={block} />;
    case 'accordion-faq':
      return <AccordionFAQBlock key={i} block={block} />;
    case 'comparison-table':
      return <ComparisonTableBlock key={i} block={block} />;
    case 'video':
      return <VideoBlock key={i} block={block} />;
    case 'image':
      return <ImageBlock key={i} block={block} />;
    case 'divider':
      return <DividerBlock key={i} block={block} />;
    case 'step-by-step':
      return <LazyWrapper key={i}><StepByStepBlock block={block} /></LazyWrapper>;
    case 'diagram-animated':
      return <LazyWrapper key={i}><DiagramAnimatedBlock block={block} /></LazyWrapper>;
    case 'quiz':
      return (
        <LazyWrapper key={i}>
          <QuizBlock
            block={block}
            courseSlug={context?.courseSlug}
            moduleSlug={context?.moduleSlug}
            lessonSlug={context?.lessonSlug}
          />
        </LazyWrapper>
      );
    case 'mockui':
      return <LazyWrapper key={i}><MockUIBlock block={block} /></LazyWrapper>;
    case 'sandbox':
      return <LazyWrapper key={i}><SandboxBlock block={block} /></LazyWrapper>;
    case 'interactive-demo':
      return <LazyWrapper key={i}><InteractiveDemoBlock block={block} /></LazyWrapper>;
    default:
      return null;
  }
}

export function LessonContent({ contentKey, courseSlug, moduleSlug, lessonSlug, contentBlocks }: LessonContentProps) {
  const { t } = useTranslation('training');

  // Use contentBlocks from props (TypeScript data) or fall back to i18n JSON
  const blocks: ContentBlock[] = contentBlocks
    || (t(contentKey, { returnObjects: true }) as ContentBlock[]);

  if (!Array.isArray(blocks)) {
    return (
      <Text color="gray.600" fontSize="sm" lineHeight="tall">
        {String(blocks)}
      </Text>
    );
  }

  const context = { courseSlug, moduleSlug, lessonSlug };

  return (
    <VStack align="flex-start" spacing={4} w="full">
      {blocks.map((block, i) => renderBlock(block, i, context))}
    </VStack>
  );
}
