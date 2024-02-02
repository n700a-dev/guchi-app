import { Button } from '@chakra-ui/react';
import React from 'react';
import { useGoogleOAuth2 } from './useGoogleOAuth2';

export const LoginButton = () => {
  const { goToOAuth2Endpoint } = useGoogleOAuth2();

  return <Button onClick={goToOAuth2Endpoint}>ログイン</Button>;
};
