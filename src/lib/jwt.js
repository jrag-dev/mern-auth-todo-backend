import jsonwebtoken from 'jsonwebtoken';


const sign = (payload, isAccessToken) => {
  return jsonwebtoken.sign(
    payload, 
    isAccessToken ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESK_TOKEN_SECRET, 
    { 
      algorithm: 'HS256',
      expiresIn: '1h'
    }
  );
}

export const createAccessToken = (data) => {
  return sign({ data }, true)
}

export const createRefreshToken =  (data) => {
  return sign({ data }, false)
}

export const verifyAccessToken = (token) => {
  return jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export const verifyRefreshToken = (token) => {
  return jsonwebtoken.verify(token, process.env.REFRESK_TOKEN_SECRET);
}