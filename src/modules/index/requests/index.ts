import { useHTTP } from '@/common/requests/http';

const { GET, POST } = useHTTP('/v1');

/**
 * 列表
 */
export function fetchIndexList() {
  return new Promise(resolve => {
    GET('/indexList')({}).then((result: any) => {
      resolve(result);
    });
  });
}
