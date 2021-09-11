const sharp = require('sharp');
const { bytesToKbytes } = require('strapi-plugin-upload/utils/file');

const getMetadatas = (buffer) =>
  sharp(buffer)
    .metadata()
    .catch(() => ({})); // ignore errors

const imageFormats = ['jpeg', 'png', 'webp'];
const imageFormatsWithoutWebP = imageFormats.filter(
  (format) => format !== 'webp'
);

async function isImageFile(buffer, formats = imageFormats) {
  const { format } = await getMetadatas(buffer);
  return format && formats.includes(format);
}

async function shouldProcessWebP(buffer) {
  return isImageFile(buffer, imageFormatsWithoutWebP);
}

async function generateWebPFile(file) {
  if (!(await shouldProcessWebP(file.buffer))) {
    return null;
  }
  const webPBuffer = await sharp(file.buffer)
    .webp()
    .toBuffer()
    .catch(() => null);

  if (webPBuffer) {
    const { width, height, size } = await getMetadatas(webPBuffer);
    const name = file.name.substr(0, file.name.lastIndexOf('.')) + '.webp';

    return {
      name: name,
      hash: file.hash,
      ext: '.webp',
      mime: 'image/webp',
      width,
      height,
      size: bytesToKbytes(size),
      buffer: webPBuffer,
      path: null,
    };
  }

  return null;
}

module.exports = {
  isImageFile,
  generateWebPFile,
};
