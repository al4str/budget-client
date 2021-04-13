import { useEffect } from 'react';

/**
 * @param {Object} params
 * @param {string} params.title
 * @return {void}
 * */
export function useTitle(params) {
  const { title } = params;

  useEffect(() => {
    window.document.title = title;
  }, [
    title,
  ]);
}
