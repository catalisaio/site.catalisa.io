import { Navigate, useLocation } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { useLocalizedPath } from '../../i18n/useLocalizedPath';

interface ProtectedRouteProps {
  children: React.ReactNode;
  loginPath?: string;
}

export function ProtectedRoute({ children, loginPath = '/treinamento/login' }: ProtectedRouteProps) {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();
  const lp = useLocalizedPath();

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="lg" color="brand.500" />
      </Flex>
    );
  }

  if (!user) {
    return <Navigate to={lp(loginPath)} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
