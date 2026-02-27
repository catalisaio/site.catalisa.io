import { Presentation } from '../components/presentation/Presentation';
import { fintechSlides } from '../components/presentation/slides/presets';

export function FintechPresentation() {
  return <Presentation slides={fintechSlides} />;
}
