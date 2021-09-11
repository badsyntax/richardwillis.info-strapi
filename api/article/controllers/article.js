const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.article.findOne({ slug });
    return sanitizeEntity(entity, { model: strapi.models.article });
  },

  async comment(ctx) {
    ctx.request.body.article = ctx.params.id;
    const entity = await strapi.services.comment.create({
      published_at: null,
      ...ctx.request.body,
    });
    await strapi.plugins['email'].services.email.send({
      to: 'willis.rh@gmail.com',
      from: 'strapi@richardwillis.info',
      subject: 'New comment posted',
      text: 'Hello world!',
      html: 'Hello world!',
    });
    return sanitizeEntity(entity, { model: strapi.models.comment });
  },
};
