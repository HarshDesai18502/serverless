const { connectToDatabase } = require("../../helpers/db");
const Post = require("../../models/post");
const { response, error } = require("../../utils/response");
const { signedUrl } = require("../../utils/getUrlGenerator");

exports.search = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectToDatabase();
    const searchTerm = event.queryStringParameters.q;
    const posts = await Post.find({
      title: { $regex: searchTerm, $options: "i" },
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const post of posts) {
      post.imageUrl = signedUrl(post.imageUrl);
    }

    return response({
      statusCode: 200,
      message: "post fetched successfully.",
      data: posts,
    });
  } catch (err) {
    return error(err.message);
  }
};
