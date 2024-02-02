import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type DailyEmotionCount = {
  __typename?: 'DailyEmotionCount';
  emotion?: Maybe<Scalars['String']['output']>;
  emotionCount: Scalars['Int']['output'];
  postedDate: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: MyBoolean;
  deletePost: MyBoolean;
  updatePost: MyBoolean;
  withdrawCurrentUser: MyBoolean;
};


export type MutationCreatePostArgs = {
  input: TPostCreateArg;
};


export type MutationDeletePostArgs = {
  input: TPostDeleteArg;
};


export type MutationUpdatePostArgs = {
  input: TPostArg;
};

export type MyBoolean = {
  __typename?: 'MyBoolean';
  result: Scalars['Boolean']['output'];
};

export type Post = {
  __typename?: 'Post';
  createdAtMs: Scalars['String']['output'];
  diffHour: Scalars['Int']['output'];
  emotion?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  postedDate: Scalars['String']['output'];
  text?: Maybe<Scalars['String']['output']>;
  updatedAtMs: Scalars['String']['output'];
  uploadedAtMs?: Maybe<Scalars['String']['output']>;
};

export type PostedDate = {
  __typename?: 'PostedDate';
  diffHour: Scalars['Int']['output'];
  endOfDayMs: Scalars['String']['output'];
  postCount: Scalars['Int']['output'];
  postedDate: Scalars['String']['output'];
  startOfDayMs: Scalars['String']['output'];
  updatedAtMs: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  currentUser: User;
  dailyEmotionCounts: Array<DailyEmotionCount>;
  dailyPosts: Array<Post>;
  postCount: Scalars['Int']['output'];
  postImageUploadCredential: UploadCredential;
  postedDate: PostedDate;
  postedDates: Array<PostedDate>;
  strageCredential: StrageCredential;
  users: Array<User>;
};


export type QueryDailyEmotionCountsArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};


export type QueryDailyPostsArgs = {
  postedDate: Scalars['String']['input'];
};


export type QueryPostImageUploadCredentialArgs = {
  createdAtMs: Scalars['String']['input'];
  updatedAtMs: Scalars['String']['input'];
};


export type QueryPostedDateArgs = {
  postedDate: Scalars['String']['input'];
};


export type QueryPostedDatesArgs = {
  month: Scalars['Int']['input'];
  year: Scalars['Int']['input'];
};

export type StrageCredential = {
  __typename?: 'StrageCredential';
  accessQuery: Scalars['String']['output'];
  baseUrl: Scalars['String']['output'];
  expiredAtMs: Scalars['String']['output'];
};

export type TPostArg = {
  createdAtMs: Scalars['String']['input'];
  emotion?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  updatedAtMs: Scalars['String']['input'];
};

export type TPostCreateArg = {
  createdAtMs: Scalars['String']['input'];
  diffHour: Scalars['Int']['input'];
  emotion?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  postedDate: Scalars['String']['input'];
  text: Scalars['String']['input'];
  updatedAtMs: Scalars['String']['input'];
};

export type TPostDeleteArg = {
  createdAtMs: Scalars['String']['input'];
};

export type UploadCredential = {
  __typename?: 'UploadCredential';
  fields: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int']['output'];
  nickname: Scalars['String']['output'];
};


export const CreatePostDocument = gql`
    mutation createPost($input: TPostCreateArg!) {
  createPost(input: $input) {
    result
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($input: TPostDeleteArg!) {
  deletePost(input: $input) {
    result
  }
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($input: TPostArg!) {
  updatePost(input: $input) {
    result
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const WithdrawCurrentUserDocument = gql`
    mutation WithdrawCurrentUser {
  withdrawCurrentUser {
    result
  }
}
    `;

export function useWithdrawCurrentUserMutation() {
  return Urql.useMutation<WithdrawCurrentUserMutation, WithdrawCurrentUserMutationVariables>(WithdrawCurrentUserDocument);
};
export const DailyEmotionCountsDocument = gql`
    query DailyEmotionCounts($year: Int!, $month: Int!) {
  dailyEmotionCounts(year: $year, month: $month) {
    postedDate
    emotion
    emotionCount
  }
}
    `;

export function useDailyEmotionCountsQuery(options: Omit<Urql.UseQueryArgs<DailyEmotionCountsQueryVariables>, 'query'>) {
  return Urql.useQuery<DailyEmotionCountsQuery, DailyEmotionCountsQueryVariables>({ query: DailyEmotionCountsDocument, ...options });
};
export const DailyPostCountDocument = gql`
    query DailyPostCount($postedDate: String!) {
  postedDate(postedDate: $postedDate) {
    postedDate
    postCount
  }
}
    `;

export function useDailyPostCountQuery(options: Omit<Urql.UseQueryArgs<DailyPostCountQueryVariables>, 'query'>) {
  return Urql.useQuery<DailyPostCountQuery, DailyPostCountQueryVariables>({ query: DailyPostCountDocument, ...options });
};
export const DailyPostsDocument = gql`
    query DailyPosts($postedDate: String!) {
  dailyPosts(postedDate: $postedDate) {
    __typename
    uploadedAtMs
    text
    emotion
    imageUrl
    createdAtMs
    updatedAtMs
    diffHour
    postedDate
  }
}
    `;

export function useDailyPostsQuery(options: Omit<Urql.UseQueryArgs<DailyPostsQueryVariables>, 'query'>) {
  return Urql.useQuery<DailyPostsQuery, DailyPostsQueryVariables>({ query: DailyPostsDocument, ...options });
};
export const PostCountDocument = gql`
    query PostCount {
  postCount
}
    `;

export function usePostCountQuery(options?: Omit<Urql.UseQueryArgs<PostCountQueryVariables>, 'query'>) {
  return Urql.useQuery<PostCountQuery, PostCountQueryVariables>({ query: PostCountDocument, ...options });
};
export const PostImageUploadCredentialDocument = gql`
    query PostImageUploadCredential($createdAtMs: String!, $updatedAtMs: String!) {
  postImageUploadCredential(createdAtMs: $createdAtMs, updatedAtMs: $updatedAtMs) {
    url
    fields
  }
}
    `;

export function usePostImageUploadCredentialQuery(options: Omit<Urql.UseQueryArgs<PostImageUploadCredentialQueryVariables>, 'query'>) {
  return Urql.useQuery<PostImageUploadCredentialQuery, PostImageUploadCredentialQueryVariables>({ query: PostImageUploadCredentialDocument, ...options });
};
export const PostedDatesDocument = gql`
    query PostedDates($year: Int!, $month: Int!) {
  postedDates(year: $year, month: $month) {
    postedDate
    startOfDayMs
    postCount
    updatedAtMs
  }
}
    `;

export function usePostedDatesQuery(options: Omit<Urql.UseQueryArgs<PostedDatesQueryVariables>, 'query'>) {
  return Urql.useQuery<PostedDatesQuery, PostedDatesQueryVariables>({ query: PostedDatesDocument, ...options });
};
export const StorageCredentialDocument = gql`
    query StorageCredential {
  strageCredential {
    baseUrl
    accessQuery
    expiredAtMs
  }
}
    `;

export function useStorageCredentialQuery(options?: Omit<Urql.UseQueryArgs<StorageCredentialQueryVariables>, 'query'>) {
  return Urql.useQuery<StorageCredentialQuery, StorageCredentialQueryVariables>({ query: StorageCredentialDocument, ...options });
};
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    __typename
    id
    nickname
  }
}
    `;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery, CurrentUserQueryVariables>({ query: CurrentUserDocument, ...options });
};
export const UsersDocument = gql`
    query Users {
  users {
    __typename
    id
    nickname
  }
}
    `;

export function useUsersQuery(options?: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'>) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables>({ query: UsersDocument, ...options });
};
export type CreatePostMutationVariables = Exact<{
  input: TPostCreateArg;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'MyBoolean', result: boolean } };

export type DeletePostMutationVariables = Exact<{
  input: TPostDeleteArg;
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'MyBoolean', result: boolean } };

export type UpdatePostMutationVariables = Exact<{
  input: TPostArg;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'MyBoolean', result: boolean } };

export type WithdrawCurrentUserMutationVariables = Exact<{ [key: string]: never; }>;


export type WithdrawCurrentUserMutation = { __typename?: 'Mutation', withdrawCurrentUser: { __typename?: 'MyBoolean', result: boolean } };

export type DailyEmotionCountsQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type DailyEmotionCountsQuery = { __typename?: 'Query', dailyEmotionCounts: Array<{ __typename?: 'DailyEmotionCount', postedDate: string, emotion?: string | null, emotionCount: number }> };

export type DailyPostCountQueryVariables = Exact<{
  postedDate: Scalars['String']['input'];
}>;


export type DailyPostCountQuery = { __typename?: 'Query', postedDate: { __typename?: 'PostedDate', postedDate: string, postCount: number } };

export type DailyPostsQueryVariables = Exact<{
  postedDate: Scalars['String']['input'];
}>;


export type DailyPostsQuery = { __typename?: 'Query', dailyPosts: Array<{ __typename: 'Post', uploadedAtMs?: string | null, text?: string | null, emotion?: string | null, imageUrl?: string | null, createdAtMs: string, updatedAtMs: string, diffHour: number, postedDate: string }> };

export type PostCountQueryVariables = Exact<{ [key: string]: never; }>;


export type PostCountQuery = { __typename?: 'Query', postCount: number };

export type PostImageUploadCredentialQueryVariables = Exact<{
  createdAtMs: Scalars['String']['input'];
  updatedAtMs: Scalars['String']['input'];
}>;


export type PostImageUploadCredentialQuery = { __typename?: 'Query', postImageUploadCredential: { __typename?: 'UploadCredential', url: string, fields: string } };

export type PostedDatesQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type PostedDatesQuery = { __typename?: 'Query', postedDates: Array<{ __typename?: 'PostedDate', postedDate: string, startOfDayMs: string, postCount: number, updatedAtMs: string }> };

export type StorageCredentialQueryVariables = Exact<{ [key: string]: never; }>;


export type StorageCredentialQuery = { __typename?: 'Query', strageCredential: { __typename?: 'StrageCredential', baseUrl: string, accessQuery: string, expiredAtMs: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename: 'User', id: number, nickname: string } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename: 'User', id: number, nickname: string }> };

import { IntrospectionQuery } from 'graphql';
export default {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": null,
    "types": [
      {
        "kind": "OBJECT",
        "name": "DailyEmotionCount",
        "fields": [
          {
            "name": "emotion",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "emotionCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "postedDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "createPost",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MyBoolean",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "deletePost",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MyBoolean",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "updatePost",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MyBoolean",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "input",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "withdrawCurrentUser",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MyBoolean",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MyBoolean",
        "fields": [
          {
            "name": "result",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Post",
        "fields": [
          {
            "name": "createdAtMs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "diffHour",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "emotion",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "imageUrl",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "postedDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "text",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "updatedAtMs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "uploadedAtMs",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "PostedDate",
        "fields": [
          {
            "name": "diffHour",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "endOfDayMs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "postCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "postedDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "startOfDayMs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "updatedAtMs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "currentUser",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "dailyEmotionCounts",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "DailyEmotionCount",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "month",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "year",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "dailyPosts",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Post",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "postedDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "postCount",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "postImageUploadCredential",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UploadCredential",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "createdAtMs",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "updatedAtMs",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "postedDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "PostedDate",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "postedDate",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "postedDates",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "PostedDate",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "month",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "year",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "strageCredential",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "StrageCredential",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "users",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "User",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "StrageCredential",
        "fields": [
          {
            "name": "accessQuery",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "baseUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "expiredAtMs",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UploadCredential",
        "fields": [
          {
            "name": "fields",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "url",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "User",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "nickname",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;