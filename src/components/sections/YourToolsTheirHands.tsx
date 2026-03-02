import { Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../shared/SectionWrapper';
import { GradientText } from '../shared/GradientText';
import { ToolConnectionGraph } from '../shared/ToolConnectionGraph';

interface ToolData {
  name: string;
  actions: string[];
}

export function YourToolsTheirHands() {
  const { t } = useTranslation('home');
  const tools = t('yourTools.tools', { returnObjects: true }) as ToolData[];

  return (
    <SectionWrapper bg="white" id="your-tools">
      <VStack spacing={4} textAlign="center" mb={{ base: 10, md: 14 }}>
        <HStack
          bg="brand.50"
          px={4}
          py={1.5}
          borderRadius="full"
          border="1px solid"
          borderColor="brand.200"
          spacing={2}
        >
          <Text color="brand.600" fontSize="sm" fontWeight="600">
            &#10022; {t('yourTools.badge')}
          </Text>
        </HStack>

        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="800"
          color="gray.900"
          lineHeight="1.2"
          maxW="700px"
        >
          {t('yourTools.heading')}{' '}
          <GradientText fontSize="inherit" fontWeight="inherit">
            {t('yourTools.headingGradient')}
          </GradientText>
        </Heading>

        <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }} maxW="600px">
          {t('yourTools.subtitle')}
        </Text>
      </VStack>

      <ToolConnectionGraph tools={tools} moreLabel={t('yourTools.moreLabel')} />
    </SectionWrapper>
  );
}
