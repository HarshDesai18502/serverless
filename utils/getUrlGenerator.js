// const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// const s3Client = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//   },
// });

// // to generate a pre signed url of an image
// module.exports.getObjectURL = async (key) => {
//   const command = new GetObjectCommand({
//     Bucket: process.env.BUCKET_NAME,
//     Key: key,
//   });
//   const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
//   return url;
// };

const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

module.exports.signedUrl = (key) =>
  getSignedUrl({
    url: `https://d17rh7z5appirt.cloudfront.net/${key}`,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
  });
