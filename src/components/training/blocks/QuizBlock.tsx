import { useState, useCallback } from 'react';
import {
  Box, VStack, Text, Button, RadioGroup, Radio, Stack,
  Input, HStack, Icon, Badge, Flex,
} from '@chakra-ui/react';
import { FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { Reorder } from 'framer-motion';
import { MotionBox } from '../../motion';
import { useTrainingQuiz } from '../../../hooks/useTrainingQuiz';
import type { QuizBlock as QuizBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: QuizBlockType;
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
}

export function QuizBlock({ block, courseSlug = '', moduleSlug = '', lessonSlug = '' }: Props) {
  const { submitAnswer, getQuizResult } = useTrainingQuiz();
  const existing = getQuizResult(courseSlug, moduleSlug, lessonSlug, block.quizId);

  const [answer, setAnswer] = useState<unknown>(existing?.answer || '');
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(
    existing ? { correct: existing.isCorrect } : null,
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!answer) return;
    setSubmitting(true);

    let correctValue: unknown;
    if (block.variant === 'multiple-choice' || block.variant === 'true-false') {
      correctValue = block.correctAnswer;
    } else if (block.variant === 'drag-drop') {
      correctValue = block.correctOrder || block.categories;
    } else if (block.variant === 'fill-blank') {
      correctValue = block.blanks?.map(b => b.correctValues[0]);
    }

    const result = await submitAnswer(courseSlug, moduleSlug, lessonSlug, block.quizId, answer, correctValue);
    setFeedback(result);
    setSubmitting(false);
  }, [answer, block, courseSlug, moduleSlug, lessonSlug, submitAnswer]);

  const handleRetry = () => {
    setAnswer('');
    setFeedback(null);
  };

  return (
    <Box w="full" p={5} border="1px solid" borderColor="gray.200" borderRadius="xl" bg="white">
      <VStack align="stretch" spacing={4}>
        <Flex justify="space-between" align="center">
          <Badge colorScheme="purple" fontSize="xs" px={2} py={0.5} borderRadius="full">
            Quiz
          </Badge>
          {block.xpBonus && (
            <Badge colorScheme="yellow" fontSize="xs" px={2} py={0.5} borderRadius="full">
              +{block.xpBonus} XP
            </Badge>
          )}
        </Flex>

        <Text fontWeight="600" fontSize="sm" color="gray.800">
          {block.question}
        </Text>

        {/* Multiple Choice / True-False */}
        {(block.variant === 'multiple-choice' || block.variant === 'true-false') && (
          <RadioGroup value={answer as string} onChange={setAnswer} isDisabled={feedback?.correct === true}>
            <Stack spacing={2}>
              {block.options?.map((opt) => (
                <Box
                  key={opt.value}
                  p={3}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={
                    feedback
                      ? opt.value === block.correctAnswer
                        ? 'green.300'
                        : opt.value === answer
                          ? 'red.300'
                          : 'gray.200'
                      : answer === opt.value
                        ? 'purple.300'
                        : 'gray.200'
                  }
                  bg={
                    feedback
                      ? opt.value === block.correctAnswer
                        ? 'green.50'
                        : opt.value === answer && !feedback.correct
                          ? 'red.50'
                          : 'white'
                      : 'white'
                  }
                  transition="all 0.2s"
                >
                  <Radio value={opt.value} colorScheme="purple" size="sm">
                    <Text fontSize="sm" color="gray.700">{opt.label}</Text>
                  </Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        )}

        {/* Drag and Drop */}
        {block.variant === 'drag-drop' && block.items && (
          <DragDropQuiz
            items={block.items}
            value={answer as string[] | undefined}
            onChange={setAnswer}
            disabled={feedback?.correct === true}
            correctOrder={block.correctOrder}
            feedback={feedback}
          />
        )}

        {/* Fill in the Blank */}
        {block.variant === 'fill-blank' && block.blanks && (
          <FillBlankQuiz
            template={block.template || ''}
            blanks={block.blanks}
            value={answer as string[] | undefined}
            onChange={setAnswer}
            disabled={feedback?.correct === true}
            feedback={feedback}
          />
        )}

        {/* Actions */}
        {!feedback?.correct && (
          <Button
            colorScheme="purple"
            size="sm"
            onClick={handleSubmit}
            isLoading={submitting}
            isDisabled={!answer || (Array.isArray(answer) && answer.length === 0)}
          >
            Verificar
          </Button>
        )}

        {/* Feedback */}
        {feedback && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              p={3}
              borderRadius="lg"
              bg={feedback.correct ? 'green.50' : 'red.50'}
              border="1px solid"
              borderColor={feedback.correct ? 'green.200' : 'red.200'}
            >
              <HStack spacing={2}>
                <Icon
                  as={feedback.correct ? FiCheck : FiX}
                  color={feedback.correct ? 'green.500' : 'red.500'}
                  boxSize={4}
                />
                <Text fontSize="sm" color={feedback.correct ? 'green.700' : 'red.700'} fontWeight="600">
                  {feedback.correct ? 'Correto!' : 'Incorreto. Tente novamente.'}
                </Text>
              </HStack>
              {feedback.correct && block.explanation && (
                <Text fontSize="xs" color="green.600" mt={2}>{block.explanation}</Text>
              )}
            </Box>
            {!feedback.correct && (
              <Button size="xs" variant="ghost" mt={2} leftIcon={<FiRefreshCw />} onClick={handleRetry}>
                Tentar novamente
              </Button>
            )}
          </MotionBox>
        )}
      </VStack>
    </Box>
  );
}

// ─── Sub-components ───

function DragDropQuiz({
  items,
  value,
  onChange,
  disabled,
  correctOrder,
  feedback,
}: {
  items: string[];
  value?: string[];
  onChange: (v: string[]) => void;
  disabled: boolean;
  correctOrder?: string[];
  feedback: { correct: boolean } | null;
}) {
  const [order, setOrder] = useState<string[]>(value || [...items]);

  const handleReorder = (newOrder: string[]) => {
    if (disabled) return;
    setOrder(newOrder);
    onChange(newOrder);
  };

  return (
    <Box>
      <Text fontSize="xs" color="gray.500" mb={2}>Arraste para reordenar:</Text>
      <Reorder.Group axis="y" values={order} onReorder={handleReorder}>
        {order.map((item, idx) => (
          <Reorder.Item key={item} value={item} style={{ listStyle: 'none' }}>
            <Box
              p={3}
              mb={1}
              borderRadius="lg"
              border="1px solid"
              borderColor={
                feedback && correctOrder
                  ? correctOrder[idx] === item ? 'green.300' : 'red.300'
                  : 'gray.200'
              }
              bg={
                feedback && correctOrder
                  ? correctOrder[idx] === item ? 'green.50' : 'red.50'
                  : 'gray.50'
              }
              cursor={disabled ? 'default' : 'grab'}
              _active={{ cursor: disabled ? 'default' : 'grabbing' }}
              fontSize="sm"
              userSelect="none"
            >
              <HStack>
                <Text color="gray.400" fontSize="xs" fontWeight="700" minW="20px">{idx + 1}.</Text>
                <Text color="gray.700">{item}</Text>
              </HStack>
            </Box>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </Box>
  );
}

function FillBlankQuiz({
  template,
  blanks,
  value,
  onChange,
  disabled,
  feedback,
}: {
  template: string;
  blanks: { id: string; correctValues: string[] }[];
  value?: string[];
  onChange: (v: string[]) => void;
  disabled: boolean;
  feedback: { correct: boolean } | null;
}) {
  const [answers, setAnswers] = useState<string[]>(value || blanks.map(() => ''));

  const parts = template.split(/(\{\{blank\}\})/g);
  let blankIdx = 0;

  const handleChange = (idx: number, val: string) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
    onChange(next);
  };

  return (
    <Box>
      <Flex wrap="wrap" align="center" gap={1} fontSize="sm" color="gray.700" lineHeight="2">
        {parts.map((part, i) => {
          if (part === '{{blank}}') {
            const currentIdx = blankIdx;
            const blank = blanks[currentIdx];
            const isCorrect = blank?.correctValues.some(
              v => v.toLowerCase() === answers[currentIdx]?.toLowerCase(),
            );
            blankIdx++;
            return (
              <Input
                key={i}
                size="sm"
                w="150px"
                display="inline-block"
                value={answers[currentIdx] || ''}
                onChange={(e) => handleChange(currentIdx, e.target.value)}
                isDisabled={disabled}
                borderColor={
                  feedback
                    ? isCorrect ? 'green.300' : 'red.300'
                    : 'purple.200'
                }
                bg={
                  feedback
                    ? isCorrect ? 'green.50' : 'red.50'
                    : 'white'
                }
                _focus={{ borderColor: 'purple.400' }}
                borderRadius="md"
                placeholder="..."
              />
            );
          }
          return <Text key={i} as="span">{part}</Text>;
        })}
      </Flex>
    </Box>
  );
}
