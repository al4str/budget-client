import { fetchExec, fetchMapGenericBody } from '@/libs/fetch';
import { propertyGet } from '@/libs/property';
import { API_URL } from '@/helpers/constants';
import { sessionsWithTokenHeader } from '@/helpers/sessions';

/**
 * @return {Promise<BackupsLatestResponse>}
 * */
export function backupsObtainLatest() {
  return fetchExec({
    url: `${API_URL}/backup/latest`,
    options: {
      headers: sessionsWithTokenHeader({}),
    },
    errorTitle: '[backups] obtaining latest backup failed',
    bodyMapper: mapLatest,
  });
}

/**
 * @typedef {FetchResponse
 * & { body: BackupsLatestBody }} BackupsLatestResponse
 * */

/**
 * @typedef {FetchGenericData
 * & { data: string }} BackupsLatestBody
 * */

/**
 * @param {null|Object} raw
 * @return {BackupsLatestBody}
 * */
function mapLatest(raw) {
  const { ok, reason } = fetchMapGenericBody(raw);
  const data = propertyGet(raw, ['data'], '');

  return {
    ok,
    reason,
    data,
  };
}
