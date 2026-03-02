import { Box, Heading, Text, VStack, UnorderedList, ListItem, Alert, AlertIcon, Code } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface LessonContentProps {
  contentKey: string;
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'alert' | 'code';
  text?: string;
  items?: string[];
  alertStatus?: 'info' | 'warning' | 'success';
}

export function LessonContent({ contentKey }: LessonContentProps) {
  const { t } = useTranslation('training');

  const blocks = t(contentKey, { returnObjects: true }) as ContentBlock[];

  if (!Array.isArray(blocks)) {
    return (
      <Text color="gray.600" fontSize="sm" lineHeight="tall">
        {String(blocks)}
      </Text>
    );
  }

  return (
    <VStack align="flex-start" spacing={4} w="full">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <Heading key={i} as="h3" size="sm" fontWeight="700" mt={i > 0 ? 2 : 0}>
                {block.text}
              </Heading>
            );
          case 'paragraph':
            return (
              <Text key={i} color="gray.700" fontSize="sm" lineHeight="tall">
                {block.text}
              </Text>
            );
          case 'list':
            return (
              <UnorderedList key={i} spacing={1} pl={4}>
                {block.items?.map((item, j) => (
                  <ListItem key={j} fontSize="sm" color="gray.700">{item}</ListItem>
                ))}
              </UnorderedList>
            );
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
          default:
            return null;
        }
      })}
    </VStack>
  );
}
