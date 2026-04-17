import { Presentation } from '../components/presentation/Presentation';
import { economicsSlides } from '../components/presentation/slides/presets';

export function EconomicsPresentation() {
  return <Presentation slides={economicsSlides} />;
}
