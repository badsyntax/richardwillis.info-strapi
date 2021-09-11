const _ = require('lodash');

module.exports = {
  async uploadFileAndPersist(fileData, { user } = {}) {
    const config = strapi.plugins.upload.config;

    const {
      getDimensions,
      generateThumbnail,
      generateResponsiveFormats,
      generateWebPFile,
    } = strapi.plugins.upload.services['image-manipulation'];

    await strapi.plugins.upload.provider.upload(fileData);

    const webPFile = await generateWebPFile(fileData);
    if (webPFile) {
      await strapi.plugins.upload.provider.upload(webPFile);
      delete webPFile.buffer;
      _.set(fileData, 'formats.webp', webPFile);
    }

    const thumbnailFile = await generateThumbnail(fileData);
    if (thumbnailFile) {
      await strapi.plugins.upload.provider.upload(thumbnailFile);
      delete thumbnailFile.buffer;
      _.set(fileData, 'formats.thumbnail', thumbnailFile);
    }

    const formats = await generateResponsiveFormats(fileData);
    if (Array.isArray(formats) && formats.length > 0) {
      for (const format of formats) {
        if (!format) continue;

        const { key, file } = format;

        await strapi.plugins.upload.provider.upload(file);

        const webPFile = await generateWebPFile(file);
        if (webPFile) {
          await strapi.plugins.upload.provider.upload(webPFile);
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
