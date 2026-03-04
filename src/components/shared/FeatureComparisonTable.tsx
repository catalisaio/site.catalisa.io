import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Icon, HStack } from '@chakra-ui/react';
import { FiCheck, FiX } from 'react-icons/fi';
import { MotionBox, fadeInUp } from '../motion';

interface Column {
  label: string;
  highlighted?: boolean;
}

interface FeatureComparisonTableProps {
  columns: Column[];
  rows: { feature: string; values: (string | boolean)[] }[];
  featureHeader?: string;
  accentColor?: string;
}

export function FeatureComparisonTable({
  columns,
  rows,
  featureHeader,
  accentColor = 'brand',
}: FeatureComparisonTableProps) {
  return (
    <MotionBox {...fadeInUp}>
      <Box
        overflowX="auto"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th
                py={4}
                px={5}
                fontSize="xs"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wide"
                borderColor="gray.100"
              >
                {featureHeader || ''}
              </Th>
              {columns.map((col) => (
                <Th
                  key={col.label}
                  py={4}
                  px={5}
                  textAlign="center"
                  bg={col.highlighted ? `${accentColor}.50` : undefined}
                  borderColor="gray.100"
                  position="relative"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color={col.highlighted ? `${accentColor}.600` : 'gray.700'}
                    textTransform="none"
                    letterSpacing="normal"
                  >
                    {col.label}
                  </Text>
                  {col.highlighted && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      h="3px"
                      bg={`${accentColor}.500`}
                      borderTopRadius="xl"
                    />
                  )}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, i) => (
              <Tr key={i} _hover={{ bg: 'gray.50' }}>
                <Td
                  py={3.5}
                  px={5}
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.700"
                  borderColor="gray.100"
                >
                  {row.feature}
                </Td>
                {row.values.map((val, j) => (
                  <Td
                    key={j}
                    py={3.5}
                    px={5}
                    textAlign="center"
                    bg={columns[j]?.highlighted ? `${accentColor}.50` : undefined}
                    borderColor="gray.100"
                  >
                    {typeof val === 'boolean' ? (
                      val ? (
                        <HStack justify="center">
                          <Icon as={FiCheck} color={`${accentColor}.500`} boxSize={4} />
                        </HStack>
                      ) : (
                        <HStack justify="center">
                          <Icon as={FiX} color="gray.300" boxSize={4} />
                        </HStack>
                      )
                    ) : (
                      <Text fontSize="sm" color={columns[j]?.highlighted ? `${accentColor}.700` : 'gray.600'}>
                        {val}
                      </Text>
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </MotionBox>
  );
}
