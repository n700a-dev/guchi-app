import { XYCoord } from 'react-dnd';
import { TPost } from '../new/page';

export const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000);
};

export const findPostById = (posts: TPost[], id: number) => {
  const found = posts.find((post) => post.tId === id);
  if (!found) throw new Error('postが見つかりませんでした');
  return found;
};

export const getCursorPosition = (e: MouseEvent | TouchEvent): XYCoord => {
  return e instanceof TouchEvent
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };
};
