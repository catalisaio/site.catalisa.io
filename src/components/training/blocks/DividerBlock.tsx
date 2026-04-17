import { Divider } from '@chakra-ui/react';
import type { DividerBlock as DividerBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: DividerBlockType;
}

export function DividerBlock({ block }: Props) {
  return (
    <Divider
      borderStyle={block.variant || 'solid'}
      borderColor="gray.200"
      my={2}
    />
  );
}
