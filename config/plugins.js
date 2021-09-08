module.exports = ({ env }) => ({
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_ACCESS_SECRET'),
      region: env('AWS_REGION'),
      params: {
        Bucket: env('AWS_BUCKET') + '/strapi-media',
      },
    },
    breakpoints: {
      1280: 1280,
      1024: 1024,
      768: 768,
      640: 640,
      420: 420,
    },
  },
});
