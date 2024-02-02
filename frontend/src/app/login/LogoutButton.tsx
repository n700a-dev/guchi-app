import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { TokenContext } from '../providers/TokenProvider';

export const LogoutButton = () => {
  const { dispatch } = useContext(TokenContext);

  return <Button onClick={() => dispatch?.({ type: 'remove' })}>ログアウト</Button>;
};
