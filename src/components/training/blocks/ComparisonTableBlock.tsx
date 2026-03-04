import { FeatureComparisonTable } from '../../shared/FeatureComparisonTable';
import type { ComparisonTableBlock as ComparisonTableBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: ComparisonTableBlockType;
}

export function ComparisonTableBlock({ block }: Props) {
  return (
    <FeatureComparisonTable
      columns={block.columns}
      rows={block.rows}
    />
  );
}
