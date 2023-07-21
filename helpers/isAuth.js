const jwt = require("jsonwebtoken");

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

exports.validate = async (event) => {
  const authorizerToken = event.authorizationToken;
  const authorizerArr = authorizerToken.split(" ");
  const token = authorizerArr[1];

  if (
    authorizerArr.length !== 2 ||
    authorizerArr[0] !== "Bearer" ||
    authorizerArr[1].length === 0
  ) {
    return generatePolicy(undefined, "Deny", event.methodArn);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  if (decodedToken.userId !== undefined && decodedToken.userId.length > 0) {
    return generatePolicy(decodedToken.userId, "Allow", event.methodArn);
  }

  return generatePolicy(undefined, "Deny", event.methodArn);
};
