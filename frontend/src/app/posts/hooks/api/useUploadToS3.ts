import axios from 'axios';
import { GRAPHQL_REQUEST_HEADER } from '../../../../config/requestHeader';
import { print, DocumentNode } from 'graphql';
import { PostImageUploadCredentialDocument } from '@/gql/graphql';
import urlJoin from 'url-join';
import { useCallback, useContext } from 'react';
import { TokenContext } from '@/app/providers/TokenProvider';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('API_URL is not defined in Environment Variables!');
}

/**
 * base64文字列をFileオブジェクトに変換する
 */
const base64ToFile = (base64str: string) => {
  const fileData = base64str.replace(/^data:\w+\/\w+;base64,/, '');
  const decodedFile = Buffer.from(fileData, 'base64');
  return new File([decodedFile], 'converted_image.png', { type: 'image/png' });
};

export const useUploadToS3 = () => {
  const { token } = useContext(TokenContext);

  // graphql.tsからaxiosのqueryを生成する方法
  // https://gist.github.com/ilovett/05eb90de7305a1750863c5c5724e9efb
  const generateGraphqlQueryFunction = useCallback(
    (query: DocumentNode, variables: unknown) => {
      const data = {
        query: print(query),
        variables,
      };

      return async () => {
        const res = await axios.post(urlJoin(API_URL, 'graphql'), data, {
          headers: {
            ...GRAPHQL_REQUEST_HEADER.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        return res.data.data;
      };
    },
    [token],
  );

  /**
   * S3投稿用の署名付きURLを取得する
   */
  const getPostImageUploadUrl = useCallback(
    async (createdAtMs: string, updatedAtMs: string) => {
      const fn = generateGraphqlQueryFunction(PostImageUploadCredentialDocument, { createdAtMs, updatedAtMs });
      const data = await fn().catch((e) => {
        throw e;
      });
      const cred = data?.postImageUploadCredential;
      if (!cred) {
        throw new Error('投稿用のURLの取得に失敗しました');
      }

      const formData = new FormData();
      const fieldsObj = JSON.parse(cred.fields);
      for (const key in fieldsObj) {
        formData.append(key, fieldsObj[key]);
      }

      return { s3Url: cred.url, formData };
    },
    [generateGraphqlQueryFunction],
  );

  /**
   * S3に画像をアップロードする
   */
  const uploadToS3 = useCallback(async (s3Url: string, formData: FormData, imageBase64: string) => {
    const file = base64ToFile(imageBase64);
    formData.append('file', file);

    await axios
      .post(s3Url, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .catch((e) => {
        throw e;
      });
    const pathname = formData.get('key');

    if (!pathname) {
      throw new Error('Failed to upload image. imageUrl is falsy.');
    }

    return pathname.toString();
  }, []);

  return {
    getPostImageUploadUrl,
    uploadToS3,
  };
};
