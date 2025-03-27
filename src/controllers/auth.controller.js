import { hashedPassword, verifyPassword } from "../lib/bcrypt.js";
import { getTokenFromHeaders } from "../lib/getTokenFromHeaders.js";
import { jsonResponse } from "../lib/json.response.js";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import Token from "../models/token.model.js";
import User from '../models/user.model.js';


class AuthController {

  async signup(req, res) {
    const { name, username, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json(
        jsonResponse(400,
          {
            message: "All Fields are required",
            success: false
          }
        )
      )
    }

    const emailAlreadyRegistered = await User.findOne({ email });
    if (emailAlreadyRegistered) {
      const error = new Error('Email already registered');
      return res.status(400).json(
        jsonResponse(400,
          {
            message: error.message,
            success: false
          }
        )
      );
    }

    const usernameAlreadyRegistered = await User.findOne({ username });
      if (usernameAlreadyRegistered) {
      const error = new Error('Username already registered');
      return res.status(400).json(
        jsonResponse(400,
          {
            message: error.message,
            success: false
          }
        )
      );
    }

    try {
      const passwordHashed = await hashedPassword(password);
      const user = new User(
        {
          name, 
          username, 
          email,
          password: passwordHashed
        }
      )

      const userSaved = await user.save();

      res.status(201).json(
        jsonResponse(201,
          {
            message: 'User signup successfully',
            success: true,
            user: {
              ...userSaved._doc,
              password: undefined
            }
          }
        )
      )
    } catch (err) {
      console.log(err)
      res.status(500).json(
        jsonResponse(500,
          {
            message: err.response,
            success: false
          }
        )
      )
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if ( !email || !password) {
      return res.status(400).json(
        jsonResponse(400,
          {
            message: "All Fields are required",
            success: false
          }
        )
      )
    }

    const user = await User.findOne({ email }, { _id: 1, name: 1, username: 1, email: 1, password: 1 });
    if (!user) {
      const error = new Error('Bad Credentials');
      return res.status(400).json(
        jsonResponse(400,
          {
            message: error.message,
            success: false
          }
        )
      );
    }

    try {
      const passwordHashed = await verifyPassword(password, user.password);
      if (!passwordHashed) {
      const error = new Error('Password Bad Credentials');
        return res.status(400).json(
          jsonResponse(400,
            {
              message: error.message,
              success: false
            }
          )
        );
      }

      // create token
      const accessToken = createAccessToken({
        ...user._doc,
        password: undefined
      });
      console.log('Login: ', accessToken);

      // generate and save the refresh token
      const refreshToken = createRefreshToken({
        ...user._doc,
        password: undefined
      });

      const newRefreshTokenObject = new Token({
        id: user._id,
        token: refreshToken
      })

      await newRefreshTokenObject.save();

      res.status(200).json(
        jsonResponse(200,
          {
            message: 'User logged successfully',
            success: true,
            user: {
              ...user._doc,
              password: undefined
            },
            accessToken,
            refreshToken
          }
        )
      )
    } catch (err) {
      console.log(err)
      res.status(201).json(
        {
          message: 'Error with the login',
          success: false
        }
      )
    }
  }
  
  async signout(req, res) {
    try {
      const refreshToken = getTokenFromHeaders(req.headers);
      console.log('Refresh Token: ', refreshToken)

      if (!refreshToken) {
        return res.status(400).json(
          jsonResponse(400,{
            message: 'You do not singout',
            success: false
          })
        )
      }

      await Token.findOneAndDelete({ token: refreshToken });
      
      res.status(200).json(
        jsonResponse(200,
          {
            message: 'User signout successfully',
            success: true
          }
        )
      )
    } catch (err) {
      console.log(err)
      res.status(201).json(
        {
          message: 'Error with the signout',
          success: false
        }
      )
    }
  }

  async refreshToken(req, res) {
    const refreshToken = getTokenFromHeaders(req.headers);

    if (!refreshToken) {
      return res.status(401).send(
        jsonResponse(401,
          {
            message: 'Unauthorized: No token enviado',
            success: false
          }
        )
      )
    }

    try { 
      const found = await Token.findOne({ token: refreshToken });
      if (!found) {
        return res.status(401).send(
          jsonResponse(401,
            {
              message: 'Unauthorized: Token no existe',
              success: false
            }
          )
        )
      }

      const payload = verifyRefreshToken(found.token);
      console.log('Payload: ', payload)

      if (!payload) {
        return res.status(401).send(
          jsonResponse(401,
            {
              message: 'Unauthorized: Data incorrecta',
              success: false
            }
          )
        )
      }
      const accessToken = createAccessToken(payload.data);

      res.status(201).json(
          jsonResponse(200,
            {
            message: 'Access Token Created successfully',
            success: true,
            accessToken
          }
        )
      )
    } catch (err) {
      console.log(err)
      res.status(500).json(
        {
          message: 'Error with the verify refresh token',
          success: false
        }
      )
    }
  }

  getUser(req, res) {
    console.log(req.user)
    res.status(200).json(
      jsonResponse(200,
        {
          user: req.user
        }
      )
    )
  }
  
}

export default AuthController;