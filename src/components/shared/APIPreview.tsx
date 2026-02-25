import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { MotionBox } from '../motion';

export interface APIMessage {
  text: string;
  sent: boolean;
  delay: number;
  time?: string;
}

interface APIPreviewProps {
  messages: APIMessage[];
  title?: string;
  triggerMode?: 'inView' | 'auto';
}

export function APIPreview({ messages, title = 'API Preview', triggerMode = 'inView' }: APIPreviewProps) {
  return (
    <Box
      w="full"
      maxW={{ base: '100%', md: '360px' }}
      h={{ base: '340px', md: '440px' }}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="2xl"
      bg="#1a1a2e"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Flex
        bg="#16213e"
        px={4}
        py={3}
        align="center"
        gap={3}
      >
        <Box w={8} h={8} borderRadius="full" bg="orange.500" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontSize="xs" fontWeight="bold">API</Text>
        </Box>
        <Box>
          <Text color="white" fontSize="sm" fontWeight="600">{title}</Text>
          <Text color="whiteAlpha.600" fontSize="xs">200 OK</Text>
        </Box>
      </Flex>

      {/* Messages */}
      <VStack
        spacing={2}
        p={3}
        flex={1}
        align="stretch"
        overflow="hidden"
        bg="#1a1a2e"
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
            maxW="90%"
          >
            <Box
              bg={msg.sent ? '#0f3460' : '#16213e'}
              border="1px solid"
              borderColor={msg.sent ? 'blue.700' : 'whiteAlpha.100'}
              color="white"
              px={3}
              py={2}
              borderRadius="lg"
              fontSize="xs"
              fontFamily="mono"
              whiteSpace="pre-line"
              lineHeight="1.6"
            >
              {/* Color method keywords */}
              {msg.text.split('\n').map((line, li) => {
                const isMethod = /^(GET|POST|PUT|DELETE|PATCH)\s/.test(line);
                const isStatus = /^(200|201|400|404|500)\s/.test(line);
                return (
                  <Text key={li} fontSize="xs" lineHeight="1.6">
                    {isMethod ? (
                      <>
                        <Text as="span" color="green.300" fontWeight="700">{line.split(' ')[0]}</Text>
                        {' '}
                        <Text as="span" color="orange.300">{line.split(' ').slice(1).join(' ')}</Text>
                      </>
                    ) : isStatus ? (
                      <Text as="span" color="green.300" fontWeight="600">{line}</Text>
                    ) : (
                      <Text as="span" color="whiteAlpha.800">{line}</Text>
                    )}
                  </Text>
                );
              })}
              <Text as="span" fontSize="2xs" color="whiteAlpha.400" ml={2} float="right" mt={1}>
                {msg.time || `${9 + Math.floor(i / 2)}:${(10 + i * 3).toString().padStart(2, '0')}`}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </VStack>
    </Box>
  );
}
