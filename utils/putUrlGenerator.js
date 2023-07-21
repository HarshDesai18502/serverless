const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { response, error } = require("./response");

function generateUniqueFileName(extension) {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string of length 6
  return `image-${timestamp}-${randomString}.${extension}`;
}

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

async function putObject(filename, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${filename}`,
    ContentType: contentType,
  });
  const url = getSignedUrl(s3Client, command, { expiresIn: 120 });
  return url;
}

// to generate a presigned url to upload an image
exports.uploadImage = async (event) => {
  try {
    const contentType = event.headers["Content-Type"];
    const fileExtension = contentType.split("/")[1];

    const allowedExtensions = ["png", "jpg", "jpeg"];
    if (!allowedExtensions.includes(fileExtension)) {
      return response({
        statusCode: 422,
        error: "file type should be png, jpg or jpeg.",
      });
    }

    const uniqueFileName = generateUniqueFileName(fileExtension);
    const url = await putObject(uniqueFileName, fileExtension);

    return response({
      statusCode: 200,
      data: {
        url,
        path: `${uniqueFileName}`,
      },
    });
  } catch (err) {
    return error(err.message);
  }
};
