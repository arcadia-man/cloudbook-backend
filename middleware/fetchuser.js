//fetchuser is middleware function in which we check the authenticatio
const jwt = require("jsonwebtoken");
const JWT_sec = "thisisprtiamkuamrmauryaandmy";

const fetchuser = (req, res, next) => {
  //get the user form the jwt token and add id to req
  //token will be send as name auth-token to header(included with req)

  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "access denide" });
  }
  try {
    //we are decrypting the token into data using secreat code as well as token
    const data = jwt.verify(token, JWT_sec);
    //we are appending req with another value req.user with data.user which is define in auth.js
    req.user = data;
    next();
  } catch (error) {
    return res.status(401).send({ error: "access denide" });
  }
};

module.exports = fetchuser;
