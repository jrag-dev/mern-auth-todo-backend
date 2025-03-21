import { getTokenFromHeaders } from "../lib/getTokenFromHeaders.js";
import { jsonResponse } from "../lib/json.response.js";
import { verifyAccessToken } from "../lib/jwt.js";

export function authenticate(req, res, next) {
  const token = getTokenFromHeaders(req.headers);
  console.log('token: ', token)

  if (token) {
    const decoded = verifyAccessToken(token)
    console.log('Decoded: ', decoded)
    if (decoded) {
      req.user = { ...decoded.data };
      next();
    } else {
      res.status(401).json(
        jsonResponse(401,
          {
            message: 'No tokend provided',
            sucess: false
          }
        )
      )
    }
  } else {
    res.status(401).json(
      jsonResponse(401,
        {
          message: 'No tokend provided',
          sucess: false
        }
      )
    )
  }
}