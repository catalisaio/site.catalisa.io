import { useRef, useState } from 'react';
import { Box, Icon, Flex } from '@chakra-ui/react';
import { FiPlay } from 'react-icons/fi';
import { BrowserFrame } from './BrowserFrame';

interface VideoPlayerProps {
  src: string;
  poster: string;
  aspectRatio?: string;
  borderRadius?: string;
  showBrowserFrame?: boolean;
  browserFrameUrl?: string;
}

export function VideoPlayer({
  src,
  poster,
  aspectRatio = '16 / 9',
  borderRadius = '2xl',
  showBrowserFrame = false,
  browserFrameUrl = 'panel.catalisa.app',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const videoContent = (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius={showBrowserFrame ? undefined : borderRadius}
      boxShadow={showBrowserFrame ? undefined : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}
      border={showBrowserFrame ? undefined : '1px solid'}
      borderColor={showBrowserFrame ? undefined : 'whiteAlpha.200'}
      cursor={isPlaying ? 'default' : 'pointer'}
      onClick={!isPlaying ? handlePlay : undefined}
      sx={{ aspectRatio }}
    >
      {/* Video element */}
      <Box
        as="video"
        ref={videoRef}
        src={isPlaying ? src : undefined}
        poster={poster}
        controls={isPlaying}
        preload="none"
        w="100%"
        h="100%"
        objectFit="cover"
        onEnded={() => setIsPlaying(false)}
        sx={{
          '&::-webkit-media-controls-panel': {
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          },
        }}
      />

      {/* Play button overlay */}
      {!isPlaying && (
        <Flex
          position="absolute"
          inset={0}
          align="center"
          justify="center"
          bg="blackAlpha.400"
          transition="background 0.3s"
          _hover={{ bg: 'blackAlpha.500' }}
        >
          <Flex
            align="center"
            justify="center"
            w={{ base: '60px', md: '80px' }}
            h={{ base: '60px', md: '80px' }}
            borderRadius="full"
            bg="whiteAlpha.200"
            backdropFilter="blur(8px)"
            border="2px solid"
            borderColor="whiteAlpha.400"
            transition="all 0.3s"
            _hover={{
              bg: 'whiteAlpha.300',
              transform: 'scale(1.1)',
            }}
          >
            <Icon
              as={FiPlay}
              boxSize={{ base: 6, md: 8 }}
              color="white"
              ml={1}
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );

  if (showBrowserFrame) {
    return (
      <Box
        borderRadius={borderRadius}
        overflow="hidden"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.5)"
      >
        <BrowserFrame url={browserFrameUrl}>
          {videoContent}
        </BrowserFrame>
      </Box>
    );
  }

  return videoContent;
}
