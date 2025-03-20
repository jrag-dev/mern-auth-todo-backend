import { hashedPassword, verifyPassword } from "../lib/bcrypt.js";
import { jsonResponse } from "../lib/json.response.js";
import { createAccessToken, createRefreshToken } from "../lib/jwt.js";
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

    const userAlreadyRegistered = await User.findOne({ email });
    if (userAlreadyRegistered) {
      const error = new Error('User already registered');
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
    console.log(user)
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
      const accessToken = createAccessToken(user);

      // generate and save the refresh token
      const refreshToken = createRefreshToken(user);

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
      res.status(201).json(
        {
          message: 'User signout successfully',
          success: true
        }
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
    try {
      res.status(201).json(
        {
          message: 'User signup successfully',
          success: true
        }
      )
    } catch (err) {
      console.log(err)
      res.status(201).json(
        {
          message: 'Error with the signup',
          success: false
        }
      )
    }
  }
}

export default AuthController;