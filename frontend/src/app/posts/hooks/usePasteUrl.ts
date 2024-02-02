import { useCallback } from 'react';
import { TEXT_INPUT_NAME } from '../consts/postSchema';
import { URL_REGEX } from '../consts/regex';
import { UseFormReturn } from 'react-hook-form';
import { TPostInput } from '../new/page';

export const usePasteUrl = (methods: UseFormReturn<TPostInput>) => {
  const onPaste = useCallback(
    /*
    * このコードは非公開です。
    */
  );

  return { onPaste };
};
