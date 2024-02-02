import React from 'react';
import { Text } from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';

export const ErrorMessage = ({ error }: { error: FieldError }) => (
  <>
    {error?.message && (
      <Text fontSize="12" color="red">
        {error.message}
      </Text>
    )}
  </>
);
