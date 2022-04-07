import camelcaseKeys from 'camelcase-keys';
import { parse } from 'cookie';
import snakecaseKeys from 'snakecase-keys';
import { v4 as uuid } from 'uuid';

import { ErrorCodes, HttpMethod } from 'utils/enums';
import { FetchError, NetworkError } from 'utils/errors';
import { RequestOption, HttpResponse, DefaultErrorDetail } from 'utils/interfaces';

export default async function request<TResPayload, TResError = DefaultErrorDetail>(
  path: string,
  method: HttpMethod,
  body?: object,
  options: RequestOption = {}
) {
  const url = `${process.env.REACT_APP_DOMAIN}${path}`;
  const { header = {}, init = {} } = options;
  const { jwt } = parse(document.cookie);

  let bodyPayload = null;
  if (body) {
    const snakecasedBody = snakecaseKeys(body, { deep: true });
    bodyPayload = JSON.stringify(snakecasedBody);
  }
  const res = await Promise.race([
    fetch(url, {
      method,
      credentials: 'include',
      body: bodyPayload,
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
        'Client-Request-Id': uuid(),
        ...header,
      }),
      ...init,
    }),
    new Promise((_, reject) => setTimeout(() => reject(new NetworkError()), 110000)),
  ]);

  const json: HttpResponse<TResPayload, TResError> = camelcaseKeys(await (res as Response).json(), {
    deep: true,
  });

  if (json.code !== ErrorCodes.NoError) {
    throw new FetchError(json);
  }

  return json.data;
}
