const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

// To delete the image from the s3
module.exports.deleteImage = async (filePath) => {
  const cmd = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
  });
  await s3Client.send(cmd);
};
