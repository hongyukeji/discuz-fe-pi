import api from '../api';

/**
 * 获取表情
 */
export default async function readEmoji() {
  const res = await api.readEmoji();
  return res;
}
