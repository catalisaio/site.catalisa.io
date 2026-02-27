import { Presentation } from '../components/presentation/Presentation';
import { insuranceSlides } from '../components/presentation/slides/presets';

export function InsurancePresentation() {
  return <Presentation slides={insuranceSlides} />;
}
