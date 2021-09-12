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
    const article = await strapi.services.article.findOne({
      id: ctx.params.id,
    });
    await strapi.plugins['email'].services.email.send({
      to: 'willis.rh@gmail.com',
      from: 'strapi@richardwillis.info',
      subject: 'New Comment Posted on richardwillis.info',
      text: `A new comment was posted on richardwillis.info.\n\nPost Title: ${article.title}.\n\nApprove or delete the comment: https://strapi.docker-box.richardwillis.info/admin/plugins/content-manager/collectionType/application::comment.comment/${entity.id}`,
      html: `A new comment was posted on richardwillis.info.<br/><br/>Post Title: ${article.title}.<br/><br/>Approve or delete the comment: <a href="https://strapi.docker-box.richardwillis.info/admin/plugins/content-manager/collectionType/application::comment.comment/${entity.id}">https://strapi.docker-box.richardwillis.info/admin/plugins/content-manager/collectionType/application::comment.comment/${entity.id}</a>`,
    });
    return sanitizeEntity(entity, { model: strapi.models.comment });
  },
};
