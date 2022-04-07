import snakeCase from 'lodash/snakeCase';

import { RequestParams } from 'utils/interfaces';

export const joinParams = (params: RequestParams) =>
  Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null)
    .map(k => `${encodeURIComponent(snakeCase(k))}=${encodeURIComponent(params[k].toString())}`)
    .join('&');

const joinUrlParams = (url: string, ...paramObjects: RequestParams[]) => {
  let result = url;
  paramObjects.forEach(params => {
    if (params && Object.keys(params).length) {
      result = `${result}${result.includes('?') ? '&' : '?'}${joinParams(params)}`;
    }
  });

  return result;
};

export default joinUrlParams;
