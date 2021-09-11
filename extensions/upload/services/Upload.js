const _ = require('lodash');
const { isImageFile } = require('./image-manipulation');

function getAdditionalParams(fileData) {
  if (isImageFile(fileData)) {
    return {
      CacheControl: 'public,max-age=31536000,immutable',
    };
  }
  return undefined;
}

module.exports = {
  async uploadFileAndPersist(fileData, { user } = {}) {
    const config = strapi.plugins.upload.config;

    const {
      getDimensions,
      generateThumbnail,
      generateResponsiveFormats,
      generateWebPFile,
    } = strapi.plugins.upload.services['image-manipulation'];

    await strapi.plugins.upload.provider.upload(
      fileData,
      getAdditionalParams(fileData)
    );

    const webPFile = await generateWebPFile(fileData);
    if (webPFile) {
      await strapi.plugins.upload.provider.upload(
        webPFile,
        getAdditionalParams(webPFile)
      );
      delete webPFile.buffer;
      _.set(fileData, 'formats.webp', webPFile);
    }

    const thumbnailFile = await generateThumbnail(fileData);
    if (thumbnailFile) {
      await strapi.plugins.upload.provider.upload(
        thumbnailFile,
        getAdditionalParams(thumbnailFile)
      );
      delete thumbnailFile.buffer;
      _.set(fileData, 'formats.thumbnail', thumbnailFile);
    }

    const formats = await generateResponsiveFormats(fileData);
    if (Array.isArray(formats) && formats.length > 0) {
      for (const format of formats) {
        if (!format) continue;

        const { key, file } = format;

        await strapi.plugins.upload.provider.upload(
          file,
          getAdditionalParams(file)
        );

        const webPFile = await generateWebPFile(file);
        if (webPFile) {
          await strapi.plugins.upload.provider.upload(
            webPFile,
            getAdditionalParams(webPFile)
          );
          delete webPFile.buffer;
          _.set(fileData, ['formats', `webp-${key}`], webPFile);
        }

        delete file.buffer;

        _.set(fileData, ['formats', key], file);
      }
    }

    const { width, height } = await getDimensions(fileData.buffer);

    delete fileData.buffer;

    _.assign(fileData, {
      provider: config.provider,
      width,
      height,
    });

    return this.add(fileData, { user });
  },
};
