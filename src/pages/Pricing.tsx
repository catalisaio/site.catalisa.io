import {
  Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Button, Icon,
  Badge, Divider, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
} from '@chakra-ui/react';
import { FiCheck, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { SectionWrapper } from '../components/shared/SectionWrapper';
import { GradientText } from '../components/shared/GradientText';
import { MotionBox, fadeInUp } from '../components/motion';

const WHATSAPP_URL = 'https://wa.me/5511977303414?text=Ola!%20Quero%20saber%20mais%20sobre%20os%20planos%20da%20Catalisa.';

export function Pricing() {
  const { t } = useTranslation('pricing');
  const plans = t('plans', { returnObjects: true }) as Array<{
    name: string;
    description: string;
    price: string;
    priceSuffix?: string;
    badge?: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
  }>;
  const faq = t('faq.items', { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <>
      {/* Hero */}
      <Box bg="hero.bg" pt={20} pb={16}>
        <Container maxW="1280px">
          <VStack spacing={4} textAlign="center" maxW="700px" mx="auto">
            <MotionBox {...fadeInUp}>
              <Heading as="h1" fontSize={{ base: '3xl', md: '5xl' }} fontWeight="800" color="white" lineHeight="1.1">
                {t('hero.heading')}{' '}
                <GradientText gradient="linear(to-r, catalisa.secondary, catalisa.accent)" fontSize="inherit" fontWeight="inherit">
                  {t('hero.headingGradient')}
                </GradientText>
              </Heading>
            </MotionBox>
            <MotionBox {...fadeInUp}>
              <Text color="whiteAlpha.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="600px">
                {t('hero.subtitle')}
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Plans */}
      <SectionWrapper>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="stretch">
          {plans.map((plan, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <VStack
                align="stretch"
                spacing={5}
                p={6}
                bg="white"
                borderRadius="xl"
                border="2px solid"
                borderColor={plan.highlighted ? 'brand.500' : 'gray.200'}
                position="relative"
                h="full"
                _hover={{ boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                {plan.badge && (
                  <Badge
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                    bg="brand.500"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="700"
                  >
                    {plan.badge}
                  </Badge>
                )}

                <VStack spacing={2} align="flex-start">
                  <Heading as="h3" size="md" fontWeight="700">
                    {plan.name}
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    {plan.description}
                  </Text>
                </VStack>

                <HStack align="baseline" spacing={1}>
                  <Heading size="2xl" fontWeight="800" color={plan.highlighted ? 'brand.500' : 'gray.800'}>
                    {plan.price}
                  </Heading>
                  {plan.priceSuffix && (
                    <Text color="gray.500" fontSize="sm">{plan.priceSuffix}</Text>
                  )}
                </HStack>

                <Divider />

                <VStack align="flex-start" spacing={2} flex={1}>
                  {plan.features.map((feature, j) => (
                    <HStack key={j} spacing={2}>
                      <Icon as={FiCheck} color="green.500" boxSize={4} flexShrink={0} />
                      <Text fontSize="sm" color="gray.700">{feature}</Text>
                    </HStack>
                  ))}
                </VStack>

                <Button
                  as="a"
                  href={WHATSAPP_URL}
                  target="_blank"
                  size="lg"
                  bg={plan.highlighted ? 'brand.500' : 'gray.100'}
                  color={plan.highlighted ? 'white' : 'gray.800'}
                  _hover={{
                    bg: plan.highlighted ? 'brand.600' : 'gray.200',
                    transform: 'translateY(-2px)',
                  }}
                  leftIcon={<FiMessageCircle />}
                  fontWeight="700"
                  transition="all 0.2s"
                >
                  {plan.cta}
                </Button>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Text textAlign="center" color="gray.500" fontSize="sm" mt={6}>
          {t('disclaimer')}
        </Text>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper bg="gray.50">
        <VStack spacing={8} textAlign="center" mb={8}>
          <Heading as="h2" size="lg" fontWeight="800">
            {t('faq.heading')}
          </Heading>
        </VStack>

        <Box maxW="700px" mx="auto">
          <Accordion allowMultiple>
            {faq.map((item, i) => (
              <AccordionItem key={i} border="none" mb={3}>
                <AccordionButton
                  bg="white"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  px={6}
                  py={4}
                  _hover={{ borderColor: 'brand.500' }}
                  _expanded={{ borderColor: 'brand.500' }}
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="600" fontSize="sm">{item.question}</Text>
                  </Box>
                  <AccordionIcon color="brand.500" />
                </AccordionButton>
                <AccordionPanel px={6} py={4}>
                  <Text color="gray.600" fontSize="sm" lineHeight="tall">{item.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </SectionWrapper>
    </>
  );
}
