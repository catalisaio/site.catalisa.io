import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from '@chakra-ui/react';
import type { AccordionFAQBlock as AccordionFAQBlockType } from '../../../data/trainingBlockTypes';

interface Props {
  block: AccordionFAQBlockType;
}

export function AccordionFAQBlock({ block }: Props) {
  return (
    <Accordion allowMultiple w="full">
      {block.items.map((item, i) => (
        <AccordionItem key={i} border="1px solid" borderColor="gray.200" borderRadius="lg" mb={2}>
          <AccordionButton py={3} px={4} _hover={{ bg: 'gray.50' }} borderRadius="lg">
            <Box flex="1" textAlign="left">
              <Text fontSize="sm" fontWeight="600" color="gray.800">
                {item.question}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} px={4}>
            <Text fontSize="sm" color="gray.600" lineHeight="tall">
              {item.answer}
            </Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
