const response = ({
  statusCode,
  message = null,
  data = null,
  error = null,
}) => ({
  statusCode,
  body: JSON.stringify({ message, data, error }),
});

const error = (err) => ({
  statusCode: 500,
  body: JSON.stringify({ message: "Internal Server Error", error: err }),
});

module.exports = { response, error };
