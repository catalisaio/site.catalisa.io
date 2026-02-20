import { Box, Text, HStack, Badge } from '@chakra-ui/react';
import { WorkflowPreview } from './WorkflowPreview';
import { workflowPreviews } from '../../data/workflowPreviews';

export function WorkflowPreviewHero() {
  // Use workflow #2 (Triagem com IA) — visually interesting with branch
  const workflow = workflowPreviews[1];

  return (
    <Box
      maxW="580px"
      w="full"
      bg="rgba(17,24,32,0.6)"
      backdropFilter="blur(8px)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="2xl"
      overflow="hidden"
      p={4}
    >
      {/* Header */}
      <HStack mb={2} spacing={3}>
        <Badge
          colorScheme={workflow.badgeColor}
          fontSize="2xs"
          px={2}
          py={0.5}
          borderRadius="full"
        >
          {workflow.badge}
        </Badge>
        <Text color="whiteAlpha.700" fontSize="xs" fontWeight="500">
          Workflow: {workflow.title}
        </Text>
      </HStack>

      {/* Preview */}
      <WorkflowPreview
        workflow={workflow}
        variant="dark"
        autoPlay
      />
    </Box>
  );
}
