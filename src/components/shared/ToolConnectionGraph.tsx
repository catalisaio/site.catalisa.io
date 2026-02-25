import { useState } from 'react';
import { Box, Text, VStack, SimpleGrid, HStack, Icon } from '@chakra-ui/react';
import { FiCheck, FiDatabase, FiCalendar, FiDollarSign, FiMail, FiCode, FiPackage } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { MotionBox, staggerItem } from '../motion';
import type { IconType } from 'react-icons';

interface ToolData {
  name: string;
  actions: string[];
}

interface ToolConnectionGraphProps {
  tools: ToolData[];
}

const toolIcons: Record<string, IconType> = {
  CRM: FiDatabase,
  ERP: FiPackage,
  Calendario: FiCalendar,
  Calendar: FiCalendar,
  Pagamentos: FiDollarSign,
  Payments: FiDollarSign,
  'E-mail': FiMail,
  Email: FiMail,
  'APIs Custom': FiCode,
  'Custom APIs': FiCode,
};

const toolColors = ['blue.400', 'green.400', 'orange.400', 'purple.400', 'red.400', 'cyan.400'];

export function ToolConnectionGraph({ tools }: ToolConnectionGraphProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = tools[selectedIndex];

  return (
    <VStack spacing={8} w="full">
      {/* Tool selector grid */}
      <SimpleGrid columns={{ base: 3, md: 6 }} spacing={3} w="full">
        {tools.map((tool, i) => {
          const ToolIcon = toolIcons[tool.name] || FiCode;
          const isActive = i === selectedIndex;
          const color = toolColors[i % toolColors.length];

          return (
            <MotionBox key={tool.name} {...staggerItem}>
              <Box
                as="button"
                onClick={() => setSelectedIndex(i)}
                w="full"
                py={4}
                px={3}
                borderRadius="xl"
                bg={isActive ? `${color.replace('.400', '.50')}` : 'gray.50'}
                border="2px solid"
                borderColor={isActive ? color : 'gray.200'}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: color, transform: 'translateY(-2px)' }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <Icon as={ToolIcon} boxSize={6} color={isActive ? color : 'gray.400'} />
                <Text
                  fontSize="xs"
                  fontWeight={isActive ? '700' : '500'}
                  color={isActive ? 'gray.800' : 'gray.500'}
                >
                  {tool.name}
                </Text>
              </Box>
            </MotionBox>
          );
        })}
      </SimpleGrid>

      {/* Actions detail panel */}
      <AnimatePresence mode="wait">
        <MotionBox
          key={selected.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          w="full"
        >
          <Box
            p={6}
            borderRadius="2xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="lg" fontWeight="700" color="gray.800" mb={4}>
              {selected.name}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {selected.actions.map((action, i) => (
                <HStack key={i} spacing={2}>
                  <Box as={FiCheck} color={toolColors[selectedIndex % toolColors.length]} boxSize={4} flexShrink={0} />
                  <Text fontSize="sm" color="gray.600">
                    {action}
                  </Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        </MotionBox>
      </AnimatePresence>
    </VStack>
  );
}
