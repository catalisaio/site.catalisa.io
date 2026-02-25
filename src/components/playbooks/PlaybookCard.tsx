import { Box, VStack, HStack, Text, Badge, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MotionBox } from '../motion';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';
import type { Playbook } from '../../data/playbooks';
import { categoryMeta } from '../../data/playbooks';

interface PlaybookCardProps {
  playbook: Playbook;
  index: number;
}

export function PlaybookCard({ playbook, index }: PlaybookCardProps) {
  const { t } = useTranslation('playbooks');
  const lp = useLocalizedPath();
  const catMeta = categoryMeta[playbook.category];

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
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        _hover={{
          borderColor: 'brand.200',
          boxShadow: 'md',
          transform: 'translateY(-4px)',
        }}
        transition="all 0.2s"
        h="full"
      >
        <VStack align="flex-start" spacing={3} h="full">
          <HStack justify="space-between" w="full">
            <Text fontSize="2xl">{playbook.emoji}</Text>
            <Badge colorScheme={catMeta.color} fontSize="2xs">
              {t(catMeta.labelKey)}
            </Badge>
          </HStack>

          <Text fontWeight="700" fontSize="md">
            {t(playbook.nameKey)}
          </Text>

          <Text color="gray.500" fontSize="sm" lineHeight="tall" flex={1}>
            {t(playbook.descriptionKey)}
          </Text>

          <HStack spacing={1} flexWrap="wrap">
            {playbook.blocks.slice(0, 4).map((block) => (
              <Badge key={block} variant="outline" fontSize="2xs" colorScheme="gray">
                {block}
              </Badge>
            ))}
            {playbook.blocks.length > 4 && (
              <Badge variant="outline" fontSize="2xs" colorScheme="gray">
                +{playbook.blocks.length - 4}
              </Badge>
            )}
          </HStack>

          <Button
            size="sm"
            variant="ghost"
            colorScheme="brand"
            fontWeight="600"
            px={0}
            _hover={{ bg: 'transparent', color: 'brand.600' }}
          >
            {t('card.useTemplate')} →
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
}
