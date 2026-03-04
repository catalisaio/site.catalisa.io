import { FeatureComparisonTable } from '../../shared/FeatureComparisonTable';
import type { ComparisonTableBlock as ComparisonTableBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: ComparisonTableBlockType;
}

export function ComparisonTableBlock({ block }: Props) {
  // If columns[0] is the feature label (no highlighted prop and values don't include it),
  // use it as featureHeader and pass the rest as data columns
  const hasFeatureHeader = block.columns.length > 0 &&
    block.rows.length > 0 &&
    block.rows[0].values.length === block.columns.length - 1;

  const featureHeader = hasFeatureHeader ? block.columns[0].label : undefined;
  const dataColumns = hasFeatureHeader ? block.columns.slice(1) : block.columns;

  return (
    <FeatureComparisonTable
      columns={dataColumns}
      rows={block.rows}
      featureHeader={featureHeader}
    />
  );
}
