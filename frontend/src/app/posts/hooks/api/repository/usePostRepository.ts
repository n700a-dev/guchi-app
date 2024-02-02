import { TPostInput } from '../../../new/page';
import { RepoStrategy } from '@/app/posts/index/providers/RepoStrategyProvider';
import { usePostFrontend } from './usePostFrontend';
import { usePostBackend } from './usePostBackend';

export type TRepoMethods = {
  createPost: (post: TPostInput) => Promise<boolean>;
  updatePost: (createdAtMs: number, post: TPostInput) => Promise<boolean>;
  deletePost: (createdAtMs: number) => Promise<boolean>;
};

/**
 * 戦略に応じて、localかremoteのrepositoryを返す
 */
const repositoryFactory = (strategy: (typeof RepoStrategy)[keyof typeof RepoStrategy]) => {
  switch (strategy) {
    case RepoStrategy.local:
      return usePostFrontend;
    case RepoStrategy.remote:
      return usePostBackend;
    default:
      throw new Error('repository factory Invalid strategy');
  }
};

export const usePostRepository = (strategy: (typeof RepoStrategy)[keyof typeof RepoStrategy]) => {
  const { createPost, updatePost, deletePost } = repositoryFactory(strategy)();

  return {
    createPost,
    updatePost,
    deletePost,
  } satisfies TRepoMethods;
};
