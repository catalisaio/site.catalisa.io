import { SimpleGrid, VStack, Text, Box } from '@chakra-ui/react';
import { platformStats } from '../../data/stats';
import { AnimatedCounter } from '../shared/AnimatedCounter';
import { SectionWrapper } from '../shared/SectionWrapper';

export function StatsCounter() {
  return (
    <SectionWrapper bg="brand.500">
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
        {platformStats.map((stat) => (
          <VStack key={stat.label} spacing={1}>
            <Box>
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                fontSize={{ base: '3xl', md: '5xl' }}
                fontWeight="800"
                color="white"
              />
            </Box>
            <Text color="whiteAlpha.900" fontWeight="600" fontSize="sm">
              {stat.label}
            </Text>
            <Text color="whiteAlpha.700" fontSize="xs" textAlign="center">
              {stat.description}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </SectionWrapper>
  );
}
