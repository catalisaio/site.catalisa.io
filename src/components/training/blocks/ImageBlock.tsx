import { useState } from 'react';
import { Box, Image, Text, Modal, ModalOverlay, ModalContent, ModalCloseButton } from '@chakra-ui/react';
import type { ImageBlock as ImageBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: ImageBlockType;
}

export function ImageBlock({ block }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box w="full" textAlign="center">
        <Image
          src={block.src}
          alt={block.alt}
          maxW={block.maxW || '100%'}
          mx="auto"
          borderRadius="lg"
          cursor="pointer"
          onClick={() => setIsOpen(true)}
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.02)' }}
        />
        {block.caption && (
          <Text mt={2} fontSize="xs" color="gray.500" fontStyle="italic">
            {block.caption}
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" shadow="none" maxW="90vw">
          <ModalCloseButton color="white" top={-8} right={-2} />
          <Image
            src={block.src}
            alt={block.alt}
            w="full"
            borderRadius="lg"
          />
        </ModalContent>
      </Modal>
    </>
  );
}
