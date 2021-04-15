import { idGet } from '@/libs/id';

export const NOTIFICATIONS_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  CONTENT: 'content',
};

/**
 * @typedef {'info'|'warning'|'error'|'success'} NotificationsTypes
 * */

/**
 * @param {Object} params
 * @param {string} [params.id='']
 * @param {NotificationsTypes} [params.type='info']
 * @param {string} [params.title='']
 * @param {string} [params.text='']
 * @param {boolean} [params.withClose=true]
 * @param {boolean} [params.autoClose=true]
 * @param {null|Function} [params.renderContent=null]
 * @return {NotificationItem}
 * */
export function notificationsCreate(params) {
  const {
    id,
    type,
    contentData,
    title,
    text,
    withClose,
    autoClose,
    renderContent,
  } = params;

  return {
    id: id || idGet(),
    type: type || NOTIFICATIONS_TYPES.INFO,
    contentData: contentData || null,
    title: title || '',
    text: text || '',
    withClose: typeof withClose === 'boolean'
      ? withClose
      : true,
    autoClose: typeof autoClose === 'boolean'
      ? autoClose
      : true,
    renderContent: typeof renderContent === 'function'
      ? renderContent
      : null,
  };
}

/**
 * @typedef {Object} NotificationItem
 * @property {string} id
 * @property {NotificationsTypes} type
 * @property {string} title
 * @property {string} text
 * @property {boolean} withClose
 * @property {boolean} autoClose
 * @property {null|Function} [renderContent]
 * */
