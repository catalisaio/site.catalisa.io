import { lazy, Suspense, useMemo } from 'react';
import {
  Box, Heading, Text, VStack, UnorderedList, OrderedList,
  ListItem, Alert, AlertIcon, Code, Spinner, Center, Flex,
  HStack, Button, Icon,
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiInfo, FiCheckCircle, FiArrowRight, FiHome } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ContentBlock } from '../../data/trainingBlockTypes';
import { useSlideNavigation } from '../../hooks/useSlideNavigation';

// Simple blocks (small, always loaded)
import { CalloutBlock } from './blocks/CalloutBlock';
import { AccordionFAQBlock } from './blocks/AccordionFAQBlock';
import { ComparisonTableBlock } from './blocks/ComparisonTableBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { ImageBlock } from './blocks/ImageBlock';

// Heavy blocks (lazy loaded)
const StepByStepBlock = lazy(() => import('./blocks/StepByStepBlock').then(m => ({ default: m.StepByStepBlock })));
const DiagramAnimatedBlock = lazy(() => import('./blocks/DiagramAnimatedBlock').then(m => ({ default: m.DiagramAnimatedBlock })));
const QuizBlock = lazy(() => import('./blocks/QuizBlock').then(m => ({ default: m.QuizBlock })));
const MockUIBlock = lazy(() => import('./blocks/MockUIBlock').then(m => ({ default: m.MockUIBlock })));
const SandboxBlock = lazy(() => import('./blocks/SandboxBlock').then(m => ({ default: m.SandboxBlock })));
const InteractiveDemoBlock = lazy(() => import('./blocks/InteractiveDemoBlock').then(m => ({ default: m.InteractiveDemoBlock })));

const MotionBox = motion(Box);

// ─── Block Classification ─────────────────────────────────────────

const PRIMARY_TYPES = new Set([
  'mockui', 'sandbox', 'quiz', 'interactive-demo', 'diagram-animated',
  'step-by-step', 'comparison-table', 'accordion-faq', 'video', 'image',
]);

const CONTEXT_TYPES = new Set([
  'heading', 'paragraph', 'list', 'alert', 'callout', 'code',
]);

const SECTION_LABELS: Record<string, string> = {
  'mockui': 'Explore',
  'sandbox': 'Pratique',
  'quiz': 'Teste seu conhecimento',
  'interactive-demo': 'Explore',
  'step-by-step': 'Passo a passo',
  'diagram-animated': 'Diagrama',
  'comparison-table': 'Compare',
  'accordion-faq': 'Perguntas frequentes',
  'video': 'Assista',
  'image': 'Veja',
};

// ─── Slide Type ───────────────────────────────────────────────────

export interface Slide {
  context: ContentBlock[];
  primaries: ContentBlock[];   // 0 = text-only, 1 = single interactive, 2+ = grouped quizzes
  sectionLabel?: string;
}

// ─── Grouping Algorithm ───────────────────────────────────────────

export function groupIntoSlides(blocks: ContentBlock[]): Slide[] {
  const slides: Slide[] = [];
  let buffer: ContentBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === 'divider') {
      i++;
      continue;
    }

    if (CONTEXT_TYPES.has(block.type)) {
      buffer.push(block);
      // Flush if buffer gets too long without a primary
      if (buffer.length > 2) {
        slides.push({ context: buffer.slice(0, -1), primaries: [] });
        buffer = [buffer[buffer.length - 1]];
      }
      i++;
      continue;
    }

    if (PRIMARY_TYPES.has(block.type)) {
      // Quiz grouping: collect consecutive quizzes into one slide
      if (block.type === 'quiz') {
        const quizzes: ContentBlock[] = [block];
        let j = i + 1;
        while (j < blocks.length && blocks[j].type === 'quiz') {
          quizzes.push(blocks[j]);
          j++;
        }
        slides.push({
          context: buffer,
          primaries: quizzes,
          sectionLabel: SECTION_LABELS['quiz'],
        });
        buffer = [];
        i = j;
        continue;
      }

      // Single primary
      slides.push({
        context: buffer,
        primaries: [block],
        sectionLabel: SECTION_LABELS[block.type],
      });
      buffer = [];
      i++;
      continue;
    }

    // Unknown type — skip
    i++;
  }

  // Remaining context blocks
  if (buffer.length > 0) {
    slides.push({ context: buffer, primaries: [] });
  }

  return slides;
}

// ─── Render Helpers ───────────────────────────────────────────────

interface BlockContext {
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
}

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<Center py={8}><Spinner size="md" color="purple.500" /></Center>}>
      {children}
    </Suspense>
  );
}

function renderBlock(block: ContentBlock, i: number, ctx?: BlockContext) {
  switch (block.type) {
    case 'heading':
      return (
        <Heading key={i} as={block.level || 'h3'} size="sm" fontWeight="700">
          {block.text}
        </Heading>
      );
    case 'paragraph':
      return (
        <Text key={i} color="gray.600" fontSize="sm" lineHeight="tall">
          {block.text}
        </Text>
      );
    case 'list': {
      const ListComp = block.ordered ? OrderedList : UnorderedList;
      return (
        <ListComp key={i} spacing={1} pl={4}>
          {block.items?.map((item, j) => (
            <ListItem key={j} fontSize="sm" color="gray.600">{item}</ListItem>
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
        <Box key={i} w="full" p={3} bg="gray.800" borderRadius="lg" overflowX="auto">
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
    case 'step-by-step':
      return <LazyWrapper key={i}><StepByStepBlock block={block} /></LazyWrapper>;
    case 'diagram-animated':
      return <LazyWrapper key={i}><DiagramAnimatedBlock block={block} /></LazyWrapper>;
    case 'quiz':
      return (
        <LazyWrapper key={i}>
          <QuizBlock
            block={block}
            courseSlug={ctx?.courseSlug}
            moduleSlug={ctx?.moduleSlug}
            lessonSlug={ctx?.lessonSlug}
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

// ─── Slide Sub-Components ─────────────────────────────────────────

/** Info panel that wraps context blocks for interactive slides */
function SlideInfoPanel({ blocks }: { blocks: ContentBlock[] }) {
  if (blocks.length === 0) return null;
  return (
    <Box
      bg="purple.50"
      borderLeft="3px solid"
      borderColor="purple.300"
      borderRadius="md"
      px={4}
      py={3}
      maxW="900px"
      mx="auto"
      w="full"
      flexShrink={0}
    >
      <HStack spacing={2} mb={1.5} align="center">
        <Icon as={FiInfo} color="purple.400" boxSize={3.5} />
        <Text fontSize="2xs" fontWeight="600" color="purple.500" textTransform="uppercase" letterSpacing="wide">
          Contexto
        </Text>
      </HStack>
      <VStack align="stretch" spacing={1.5}>
        {blocks.map((block, i) => renderBlock(block, i))}
      </VStack>
    </Box>
  );
}

function SlideDots({
  total,
  current,
  onGoTo,
}: {
  total: number;
  current: number;
  onGoTo: (i: number) => void;
}) {
  if (total <= 1) return null;
  // For many slides, show a compact version
  const maxVisible = 12;
  const showCompact = total > maxVisible;

  if (showCompact) {
    // Show first few, current area, last few
    const dots: number[] = [];
    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        if (!dots.includes(i)) dots.push(i);
      }
    };
    addRange(0, 1);
    addRange(Math.max(0, current - 1), Math.min(total - 1, current + 1));
    addRange(total - 2, total - 1);
    dots.sort((a, b) => a - b);

    return (
      <HStack spacing={1} justify="center">
        {dots.map((idx, j) => {
          const showGap = j > 0 && dots[j - 1] < idx - 1;
          return (
            <HStack key={idx} spacing={1}>
              {showGap && <Text fontSize="2xs" color="gray.300">...</Text>}
              <Box
                as="button"
                w={current === idx ? '14px' : '6px'}
                h="6px"
                borderRadius="full"
                bg={current === idx ? 'purple.500' : 'gray.300'}
                transition="all 0.2s"
                onClick={() => onGoTo(idx)}
                cursor="pointer"
                _hover={{ bg: current === idx ? 'purple.600' : 'gray.400' }}
              />
            </HStack>
          );
        })}
      </HStack>
    );
  }

  return (
    <HStack spacing={1} justify="center">
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          as="button"
          w={current === i ? '16px' : '7px'}
          h="7px"
          borderRadius="full"
          bg={current === i ? 'purple.500' : 'gray.300'}
          transition="all 0.2s"
          onClick={() => onGoTo(i)}
          cursor="pointer"
          _hover={{ bg: current === i ? 'purple.600' : 'gray.400' }}
        />
      ))}
    </HStack>
  );
}

// ─── Slide Navigation Footer (fixed at bottom) ───────────────────

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext?: () => void;
  onGoTo: (i: number) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
}

function SlideNavigation({
  currentSlide,
  totalSlides,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onGoTo,
  onComplete,
}: SlideNavigationProps) {
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.100"
      py={2}
      px={3}
      zIndex={20}
    >
      <VStack spacing={2} w="full">
        <SlideDots total={totalSlides} current={currentSlide} onGoTo={onGoTo} />
        <Flex w="full" justify="space-between" align="center" maxW="720px" mx="auto">
          <Button
            leftIcon={<FiChevronLeft />}
            variant="ghost"
            size="sm"
            onClick={onPrev}
            isDisabled={isFirst}
            opacity={isFirst ? 0.3 : 1}
            color="gray.500"
            fontWeight="400"
            minW="100px"
          >
            Anterior
          </Button>

          <Text fontSize="xs" color="gray.400">
            {currentSlide + 1} / {totalSlides}
          </Text>

          {onComplete ? (
            <Button
              size="sm"
              colorScheme="green"
              onClick={onComplete}
              rightIcon={<FiChevronRight />}
              minW="100px"
            >
              Concluir
            </Button>
          ) : (
            <Button
              rightIcon={<FiChevronRight />}
              variant="ghost"
              size="sm"
              onClick={onNext}
              isDisabled={isLast}
              opacity={isLast ? 0.3 : 1}
              color="gray.500"
              fontWeight="400"
              minW="100px"
            >
              Proximo
            </Button>
          )}
        </Flex>
      </VStack>
    </Box>
  );
}

// ─── Completion Slide ─────────────────────────────────────────────

interface CompletionSlideProps {
  lessonTitle?: string;
  nextLessonUrl?: string;
  courseUrl?: string;
  catalogUrl?: string;
}

function CompletionSlide({ lessonTitle, nextLessonUrl, courseUrl, catalogUrl }: CompletionSlideProps) {
  return (
    <VStack spacing={5} textAlign="center" maxW="480px" mx="auto">
      <Icon as={FiCheckCircle} boxSize={12} color="green.400" />
      <Heading size="md" color="gray.800">
        Licao concluida!
      </Heading>
      {lessonTitle && (
        <Text fontSize="sm" color="gray.500">
          {lessonTitle}
        </Text>
      )}

      <VStack spacing={3} w="full" pt={2}>
        {nextLessonUrl && (
          <Button
            as={RouterLink}
            to={nextLessonUrl}
            colorScheme="purple"
            size="md"
            w="full"
            rightIcon={<FiArrowRight />}
          >
            Proxima licao
          </Button>
        )}
        {courseUrl && (
          <Button
            as={RouterLink}
            to={courseUrl}
            variant="outline"
            colorScheme="gray"
            size="sm"
            w="full"
            leftIcon={<FiHome />}
          >
            Voltar para o curso
          </Button>
        )}
        {catalogUrl && (
          <Button
            as={RouterLink}
            to={catalogUrl}
            variant="ghost"
            size="sm"
            color="gray.500"
          >
            Ver todos os cursos
          </Button>
        )}
      </VStack>
    </VStack>
  );
}

// ─── Slide Viewer ─────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

interface SlideViewerProps {
  slides: Slide[];
  ctx?: BlockContext;
  onComplete?: () => void;
  isCompleted?: boolean;
  onSlideChange?: (current: number, total: number) => void;
  lessonTitle?: string;
  nextLessonUrl?: string;
  courseUrl?: string;
  catalogUrl?: string;
}

function SlideViewer({
  slides,
  ctx,
  onComplete,
  isCompleted,
  onSlideChange,
  lessonTitle,
  nextLessonUrl,
  courseUrl,
  catalogUrl,
}: SlideViewerProps) {
  // Total includes the completion slide at the end
  const totalWithCompletion = slides.length + 1;
  const nav = useSlideNavigation(totalWithCompletion);

  const isOnCompletionSlide = nav.currentSlide >= slides.length;
  const slide = isOnCompletionSlide ? null : slides[nav.currentSlide];

  // Track direction for animation
  const directionRef = useMemo(() => ({ current: 0 }), []);

  const handleNext = () => {
    directionRef.current = 1;
    nav.next();
  };

  const handlePrev = () => {
    directionRef.current = -1;
    nav.prev();
  };

  const handleGoTo = (i: number) => {
    directionRef.current = i > nav.currentSlide ? 1 : -1;
    nav.goTo(i);
  };

  // "Concluir" = mark complete + advance to completion slide
  const handleComplete = () => {
    onComplete?.();
    directionRef.current = 1;
    nav.goTo(slides.length); // go to completion slide
  };

  // Notify parent of slide changes
  useMemo(() => {
    onSlideChange?.(nav.currentSlide, nav.totalSlides);
  }, [nav.currentSlide, nav.totalSlides, onSlideChange]);

  // Determine slide content
  const hasContext = slide ? slide.context.length > 0 : false;
  const isTextOnly = slide ? slide.primaries.length === 0 : false;
  const isQuizSlide = slide ? slide.primaries.length > 0 && slide.primaries[0].type === 'quiz' : false;

  // The last content slide shows "Concluir", completion slide shows nav buttons only
  const isLastContentSlide = nav.currentSlide === slides.length - 1;

  return (
    <>
      {/* Scrollable content area — fills parent, content scrolls */}
      <Box w="full" h="full" position="relative">
        <AnimatePresence mode="wait" custom={directionRef.current}>
          <MotionBox
            key={nav.currentSlide}
            custom={directionRef.current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            position="absolute"
            inset={0}
            overflow="auto"
            px={4}
            py={3}
          >
            <VStack
              spacing={3}
              minH="full"
              w="full"
              justify="center"
            >
              {isOnCompletionSlide ? (
                <CompletionSlide
                  lessonTitle={lessonTitle}
                  nextLessonUrl={nextLessonUrl}
                  courseUrl={courseUrl}
                  catalogUrl={catalogUrl}
                />
              ) : isTextOnly ? (
                <VStack align="stretch" spacing={3} maxW="720px" mx="auto" w="full">
                  {slide!.context.map((block, i) => renderBlock(block, i, ctx))}
                </VStack>
              ) : isQuizSlide ? (
                <VStack spacing={4} w="full" maxW="900px" mx="auto">
                  {hasContext && (
                    <VStack align="stretch" spacing={2} w="full">
                      {slide!.context.map((block, i) => renderBlock(block, i, ctx))}
                    </VStack>
                  )}
                  {slide!.primaries.map((block, i) => renderBlock(block, i, ctx))}
                </VStack>
              ) : (
                <>
                  {hasContext && <SlideInfoPanel blocks={slide!.context} />}
                  <Box w="full" maxW="960px" mx="auto">
                    {slide!.primaries.map((block, i) => renderBlock(block, i, ctx))}
                  </Box>
                </>
              )}
            </VStack>
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Fixed navigation footer — always visible at viewport bottom */}
      <SlideNavigation
        currentSlide={nav.currentSlide}
        totalSlides={nav.totalSlides}
        isFirst={nav.isFirst}
        isLast={nav.isLast}
        onPrev={handlePrev}
        onNext={isOnCompletionSlide ? undefined : handleNext}
        onGoTo={handleGoTo}
        onComplete={isLastContentSlide ? handleComplete : undefined}
        isCompleted={isCompleted}
      />
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────

interface LessonContentProps {
  contentKey: string;
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
  contentBlocks?: ContentBlock[];
  onComplete?: () => void;
  isCompleted?: boolean;
  onSlideChange?: (current: number, total: number) => void;
  lessonTitle?: string;
  nextLessonUrl?: string;
  courseUrl?: string;
  catalogUrl?: string;
}

export function LessonContent({
  contentKey,
  courseSlug,
  moduleSlug,
  lessonSlug,
  contentBlocks,
  onComplete,
  isCompleted,
  onSlideChange,
  lessonTitle,
  nextLessonUrl,
  courseUrl,
  catalogUrl,
}: LessonContentProps) {
  const { t } = useTranslation('training');

  const blocks: ContentBlock[] = contentBlocks
    || (t(contentKey, { returnObjects: true }) as ContentBlock[]);

  if (!Array.isArray(blocks)) {
    return (
      <Text color="gray.600" fontSize="sm" lineHeight="tall">
        {String(blocks)}
      </Text>
    );
  }

  const ctx = { courseSlug, moduleSlug, lessonSlug };
  const slides = useMemo(() => groupIntoSlides(blocks), [blocks]);

  return (
    <SlideViewer
      slides={slides}
      ctx={ctx}
      onComplete={onComplete}
      isCompleted={isCompleted}
      onSlideChange={onSlideChange}
      lessonTitle={lessonTitle}
      nextLessonUrl={nextLessonUrl}
      courseUrl={courseUrl}
      catalogUrl={catalogUrl}
    />
  );
}
