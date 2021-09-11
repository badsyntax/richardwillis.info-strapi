const sharp = require('sharp');
const { bytesToKbytes } = require('strapi-plugin-upload/utils/file');

const getMetadatas = (buffer) =>
  sharp(buffer)
    .metadata()
    .catch(() => ({})); // ignore errors

const formatsToProccess = ['jpeg', 'png'];

const canBeProcessed = async (buffer) => {
  const { format } = await getMetadatas(buffer);
  return format && formatsToProccess.includes(format);
};

exports.generateWebPFile = async (file) => {
  if (!(await canBeProcessed(file.buffer))) {
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
};
