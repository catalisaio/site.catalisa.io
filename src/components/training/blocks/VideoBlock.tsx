import { Box } from '@chakra-ui/react';
import { VideoPlayer } from '../../shared/VideoPlayer';
import type { VideoBlock as VideoBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: VideoBlockType;
}

export function VideoBlock({ block }: Props) {
  return (
    <Box w="full">
      <VideoPlayer
        src={block.src}
        poster={block.poster}
        showBrowserFrame={block.showBrowserFrame}
        browserFrameUrl={block.browserFrameUrl}
      />
    </Box>
  );
}
