import { z } from 'zod';

export const TEXT_INPUT_NAME = 'text';
export const IMAGE_BASE64_INPUT_NAME = 'imageBase64';
export const IMAGE_URL_INPUT_NAME = 'imageUrl';
export const EMOTION_INPUT_NAME = 'emotion';

export const PostSchema = z
  .object({
    text: z.string().max(1000, { message: '最大1000文字以内で入力してください' }).optional(),
    imageBase64: z.string().optional(),
    imageUrl: z.string().optional(),
    emotion: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.text || data.imageBase64 || data.imageUrl;
    },
    { message: 'グチを入力するか画像を投稿してください', path: [TEXT_INPUT_NAME] },
  );
