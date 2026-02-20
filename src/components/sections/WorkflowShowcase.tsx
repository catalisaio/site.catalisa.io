import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, HStack, Badge, Button, Flex,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useTranslatedWorkflows } from '../../i18n/useTranslatedData';
import { MotionBox } from '../motion';
import { WorkflowPreview } from '../workflow-preview/WorkflowPreview';
import { categoryBadges } from '../../data/capabilityClusters';

export function WorkflowShowcase() {
  const { t } = useTranslation('workflows');
  const workflowPreviews = useTranslatedWorkflows();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = workflowPreviews[selectedIdx];

  return (
    <Box py={{ base: 16, lg: 20 }} bg="gray.50">
      <Container maxW="1280px">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
            {t('workflowShowcase.badge')}
          </Badge>
          <Heading as="h2" size="xl" fontWeight="800">
            {t('workflowShowcase.heading')}
          </Heading>
          <Text color="gray.500" maxW="550px">
            {t('workflowShowcase.subtitle')}
          </Text>
        </VStack>

        {/* Tabs */}
        <HStack
          spacing={3}
          justify="center"
          mb={8}
          flexWrap="wrap"
          gap={2}
        >
          {workflowPreviews.map((wf, i) => (
            <Button
              key={wf.id}
              size="sm"
              variant={i === selectedIdx ? 'solid' : 'outline'}
              colorScheme={i === selectedIdx ? 'brand' : 'gray'}
              onClick={() => setSelectedIdx(i)}
              borderRadius="full"
              fontWeight="600"
              px={4}
            >
              {wf.title}
              <Badge
                ml={2}
                colorScheme={wf.badgeColor}
                fontSize="2xs"
                borderRadius="full"
                px={1.5}
              >
                {wf.badge}
              </Badge>
            </Button>
          ))}
        </HStack>

        {/* Content: Preview + Description */}
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={8}
          align="stretch"
        >
          {/* Preview area */}
          <Box
            flex={2}
            minH={{ base: '280px', md: '400px' }}
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            p={{ base: 4, md: 6 }}
            boxShadow="sm"
            overflow="hidden"
          >
            <WorkflowPreview
              key={selected.id}
              workflow={selected}
              variant="light"
              autoPlay
            />
          </Box>

          {/* Description area */}
          <MotionBox
            key={selected.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            flex={1}
            minW={{ lg: '300px' }}
            maxW={{ lg: '360px' }}
          >
            <Box
              bg="white"
              borderRadius="2xl"
              border="1px solid"
              borderColor="gray.100"
              p={6}
              h="full"
            >
              <VStack align="flex-start" spacing={4}>
                <Badge
                  colorScheme={selected.badgeColor}
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {selected.badge}
                </Badge>

                <Heading as="h3" size="md" fontWeight="700">
                  {selected.title}
                </Heading>

                <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                  {selected.description}
                </Text>

                {/* Steps list */}
                <VStack align="stretch" spacing={2} w="full" pt={2}>
                  {selected.executionOrder.map((step, si) => {
                    const stepIds = Array.isArray(step) ? step : [step];
                    const nodes = stepIds
                      .map((id) => selected.nodes.find((n) => n.id === id))
                      .filter(Boolean);

                    return (
                      <HStack key={si} spacing={2} align="center">
                        <Box
                          w={5} h={5} borderRadius="full"
                          bg={`${selected.badgeColor}.50`}
                          display="flex" alignItems="center" justifyContent="center"
                          flexShrink={0}
                        >
                          <Text fontSize="2xs" fontWeight="700" color={`${selected.badgeColor}.500`}>
                            {si + 1}
                          </Text>
                        </Box>
                        <HStack spacing={1} flexWrap="wrap">
                          {nodes.map((node) => node && (
                            <HStack key={node.id} spacing={1}>
                              <Badge
                                colorScheme={categoryBadges[node.category]?.color || 'gray'}
                                fontSize="2xs"
                              >
                                {node.category}
                              </Badge>
                              <Text fontSize="xs" color="gray.600">{node.label}</Text>
                            </HStack>
                          ))}
                          {stepIds.length > 1 && (
                            <Badge colorScheme="blue" fontSize="2xs" variant="outline">
                              {t('workflowShowcase.parallel')}
                            </Badge>
                          )}
                        </HStack>
                        {si < selected.executionOrder.length - 1 && (
                          <Box as={FiArrowRight} color="gray.300" boxSize="10px" flexShrink={0} />
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              </VStack>
            </Box>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  );
}
