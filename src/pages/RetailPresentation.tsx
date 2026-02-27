import { Presentation } from '../components/presentation/Presentation';
import { retailSlides } from '../components/presentation/slides/presets';

export function RetailPresentation() {
  return <Presentation slides={retailSlides} />;
}
