import { Presentation } from '../components/presentation/Presentation';
import { investorSlides } from '../components/presentation/slides/presets';

export function InvestorPresentation() {
  return <Presentation slides={investorSlides} />;
}
