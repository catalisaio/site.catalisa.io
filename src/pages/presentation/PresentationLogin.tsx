import { useState } from 'react';
import {
  Box, Container, Heading, Text, VStack, Input, Button, FormControl, FormLabel, Alert, AlertIcon,
  Flex, Icon,
} from '@chakra-ui/react';
import { FiMonitor } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

export function PresentationLogin() {
  const { t } = useTranslation('presentation-admin');
  const { signIn, user } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const lp = useLocalizedPath();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || lp('/apresentacao');

  // Redirect if already logged in
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="440px" py={20}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={3} textAlign="center">
          <Flex
            w={14}
            h={14}
            borderRadius="xl"
            bg="purple.50"
            align="center"
            justify="center"
            mx="auto"
          >
            <Icon as={FiMonitor} boxSize={7} color="purple.500" />
          </Flex>
          <Heading size="lg">{t('login.heading')}</Heading>
          <Text color="gray.600" fontSize="sm">{t('login.subtitle')}</Text>
        </VStack>

        {error && (
          <Alert status="error" borderRadius="lg" fontSize="sm">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">{t('login.email')}</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                size="lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm">{t('login.password')}</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                size="lg"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              w="full"
              isLoading={loading}
            >
              {t('login.submit')}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
