const { connectToDatabase } = require("../../helpers/db");
const Post = require("../../models/post");
const { signedUrl } = require("../../utils/getUrlGenerator");
const { response, error } = require("../../utils/response");

// To get a single Post
exports.getPost = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    const { id } = event.pathParameters;
    const post = await Post.findById(id);

    if (!post) {
      return response({ statusCode: 404, error: "Post not found." });
    }

    post.imageUrl = signedUrl(post.imageUrl);

    return response({
      statusCode: 200,
      message: "Post Found Successfully",
      data: post,
    });
  } catch (err) {
    return error(err.message);
  }
};

// To get All Posts
exports.getAllPosts = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const currentPage = event.queryStringParameters.page || 1;
  const ITEMS_PER_PAGE = 2;

  try {
    await connectToDatabase();
    const posts = await Post.find()
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    // eslint-disable-next-line no-restricted-syntax
    for (const post of posts) {
      post.imageUrl = signedUrl(post.imageUrl);
    }

    return response({
      statusCode: 200,
      message: "Posts fetched Successfully",
      data: posts,
    });
  } catch (err) {
    return error(err.message);
  }
};
