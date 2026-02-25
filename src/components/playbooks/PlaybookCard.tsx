import { Box, VStack, HStack, Text, Badge, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { MotionBox } from '../motion';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import type { Playbook } from '../../data/playbooks';
import { categoryMeta, getPlaybookIcon } from '../../data/playbooks';
import { categoryBadges } from '../../data/capabilityClusters';

interface PlaybookCardProps {
  playbook: Playbook;
  index: number;
}

export function PlaybookCard({ playbook, index }: PlaybookCardProps) {
  const { t } = useTranslation('playbooks');
  const lp = useLocalizedPath();
  const catMeta = categoryMeta[playbook.category];
  const Icon = getPlaybookIcon(playbook.icon);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Box
        as={Link}
        to={lp(`/playbooks/${playbook.id}`)}
        display="block"
        bg="white"
        p={5}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        borderLeft="4px solid"
        borderLeftColor="transparent"
        _hover={{
          borderLeftColor: `${catMeta.color}.400`,
          boxShadow: 'lg',
          transform: 'translateY(-4px)',
          '& .playbook-icon': { transform: 'scale(1.1)' },
          '& .playbook-arrow': { opacity: 1, transform: 'translateX(2px)' },
        }}
        transition="all 0.25s ease"
        h="full"
      >
        <VStack align="flex-start" spacing={3} h="full">
          {/* Header: icon + category badge */}
          <HStack justify="space-between" w="full">
            <Flex
              className="playbook-icon"
              w="40px"
              h="40px"
              borderRadius="full"
              bg={`${catMeta.color}.50`}
              align="center"
              justify="center"
              transition="transform 0.2s"
              flexShrink={0}
            >
              <Box as={Icon} color={`${catMeta.color}.500`} boxSize="20px" />
            </Flex>
            <HStack spacing={1.5}>
              {playbook.type === 'app' && (
                <Badge
                  colorScheme="orange"
                  variant="subtle"
                  fontSize="2xs"
                  borderRadius="full"
                  px={2}
                >
                  App
                </Badge>
              )}
              <Badge
                colorScheme={catMeta.color}
                fontSize="2xs"
                borderRadius="full"
                px={2}
              >
                {t(catMeta.labelKey)}
              </Badge>
            </HStack>
          </HStack>

          {/* Title */}
          <Text fontWeight="700" fontSize="md" lineHeight="short">
            {t(playbook.nameKey)}
          </Text>

          {/* Description (2 lines) */}
          <Text
            color="gray.500"
            fontSize="sm"
            lineHeight="tall"
            flex={1}
            noOfLines={2}
          >
            {t(playbook.descriptionKey)}
          </Text>

          {/* Mini workflow steps (colored dots) */}
          <HStack spacing={1.5}>
            {playbook.workflowSteps.slice(0, 5).map((step, i) => (
              <Box
                key={i}
                w="6px"
                h="6px"
                borderRadius="full"
                bg={`${categoryBadges[step.category]?.color || 'gray'}.400`}
              />
            ))}
            {playbook.workflowSteps.length > 5 && (
              <Text fontSize="2xs" color="gray.400">+{playbook.workflowSteps.length - 5}</Text>
            )}
          </HStack>

          {/* Building blocks as subtle inline text */}
          <Text fontSize="xs" color="gray.400">
            {playbook.blocks.slice(0, 3).join(' · ')}
            {playbook.blocks.length > 3 && ` +${playbook.blocks.length - 3}`}
          </Text>

          {/* CTA link */}
          <HStack
            spacing={1}
            color="brand.500"
            fontWeight="600"
            fontSize="sm"
          >
            <Text>{t('card.useTemplate')}</Text>
            <Box
              as={FiArrowRight}
              className="playbook-arrow"
              boxSize="14px"
              opacity={0.5}
              transition="all 0.2s"
            />
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
}
