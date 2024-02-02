const MAX_STRING_COUNT = 20;

export const questionBeforeDelete = (post: { text: string | undefined }) => {
  if (!post.text) return 'このグチを削除しますか？';
  const trimedString =
    post.text.length <= MAX_STRING_COUNT ? post.text : `${post.text.substring(0, MAX_STRING_COUNT)}...`;
  return `「${trimedString}」のグチを削除しますか？`;
};
