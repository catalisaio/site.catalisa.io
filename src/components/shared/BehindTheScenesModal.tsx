import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Text, Button, VStack, useDisclosure,
} from '@chakra-ui/react';
import { FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { BrowserFrame } from './BrowserFrame';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20a%20Catalisa.';

export function useBehindTheScenes() {
  return useDisclosure();
}

interface BehindTheScenesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BehindTheScenesModal({ isOpen, onClose }: BehindTheScenesModalProps) {
  const { t } = useTranslation('common');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
      <ModalContent bg="gray.900" borderRadius="2xl" mx={4} overflow="hidden">
        <ModalHeader color="white" fontWeight="800" fontSize="xl" pb={1}>
          {t('behindTheScenes.modalTitle')}
        </ModalHeader>
        <ModalCloseButton color="whiteAlpha.600" _hover={{ color: 'white' }} />

        <ModalBody pt={0} pb={4}>
          <VStack spacing={4} align="stretch">
            <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
              {t('behindTheScenes.modalSubtitle')}
            </Text>

            <BrowserFrame url="catalisa.io" variant="dark">
              <video
                src="/videos/behind-the-scenes.mp4"
                controls
                autoPlay
                playsInline
                style={{ width: '100%', display: 'block' }}
              />
            </BrowserFrame>
          </VStack>
        </ModalBody>

        <ModalFooter pt={0}>
          <Button
            as="a"
            href={WHATSAPP_URL}
            target="_blank"
            size="md"
            bg="whatsapp.500"
            color="white"
            _hover={{ bg: 'whatsapp.600', transform: 'translateY(-1px)' }}
            leftIcon={<FiMessageCircle />}
            transition="all 0.2s"
            fontWeight="700"
          >
            {t('behindTheScenes.ctaButton')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
