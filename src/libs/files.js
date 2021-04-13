/**
 * @param {File} file
 * @return {Promise<string>}
 * */
export function filesGetDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * @param {File} file
 * @return {string}
 * */
export function filesGetHumanSize(file) {
  if (!(file instanceof File) || !file.size) {
    return '0.00 B';
  }
  const size = file.size;
  const e = Math.floor(Math.log(size) / Math.log(1024));
  const value = (size / (1024 ** e)).toFixed(2);
  const prefix = ' KMGTP'.charAt(e);
  return `${value} ${prefix}B`;
}

/**
 * @param {string} [name='file.txt']
 * @param {string} [type]
 * */
export function filesGetEmpty(name, type) {
  return new window.File(
    [new window.Blob(
      [new ArrayBuffer(0)],
      { type: type || 'text/plain' },
    )],
    name || 'file.txt',
    { type: type || 'text/plain' },
  );
}

/**
 * @param {string} url
 * @return {Promise<HTMLImageElement>}
 * */
export function filesGetImage(url) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onerror = (err) => reject(err);
    image.onload = () => resolve(image);
    image.src = url;
    if (image.complete) {
      resolve(image);
    }
  });
}

/**
 * @param {File} file
 * @param {function(HTMLImageElement): boolean} validator
 * @return {Promise<boolean>}
 * */
export async function filesIsImageInvalid(file, validator) {
  try {
    if (!(file instanceof File) || !file.size || typeof validator !== 'function') {
      return true;
    }
    const dataURL = await filesGetDataURL(file);
    const image = await filesGetImage(dataURL);
    return validator(image);
  }
  catch (err) {
    return true;
  }
}
