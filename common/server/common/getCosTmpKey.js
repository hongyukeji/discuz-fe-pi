import api from '../api';

export default async function _getCosTmpKey(params) {
  const res = await api.http({
    url: '/apiv3/coskey',
    method: 'post',
    data: params,
    timeout: 5000,
  });
  return res;
}