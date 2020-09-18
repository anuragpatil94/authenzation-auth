import jwt from 'jsonwebtoken';

import { userServices } from '../../services';
import { Logger } from '../../middleware/logger';
import { ErrorHandler } from '../../util';
import config from '../../config';

export const signup = async (req, res, next) => {
  try {
    // Get data from the request
    const requestData = req.body;
    console.log(requestData);

    // Check if user exist
    const user = await userServices.findUserByUsername(requestData.username);

    // Handle duplicate user exception
    if (user) {
      const message = 'Username already exist!';
      Logger.debug(message);
      throw new ErrorHandler(400, message);
    }

    // Create new User
    const createdUserId = await userServices.createUser(requestData);

    // Check if UserId is Created.
    if (!createdUserId) {
      const message = 'User not created!';
      Logger.debug(message);
      throw new Error(message);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    // TODO: Use AuthType
    const authType = req.body.authtype;

    // Verify if user is in database and correct credentials
    const userId = await userServices.verifyUser(
      req.body.username,
      req.body.password,
    );

    // Throw error if User is not received.
    if (!userId) {
      throw new ErrorHandler(401, 'User Credentials Invalid!');
    }

    // TODO: TOKEN MAGIC
    // TODO: Step1 - JWT

    const user = {
      _id: userId,
      username: req.body.username,
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // TODO: Step2 - Session
    // TODO: Step3 - Basic

    res
      .status(200)
      .json({ success: true, data: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};
export const signout = (req, res, next) => {
  res.status(200).json({ message: 'This is Logout Route' });
};

/**
 * Helper Methods
 */
// Generate Tokens
const generateAccessToken = user =>
  jwt.sign(user, config.jwt.accessTokenSecret, {
    expiresIn: config.jwt.accessTokenExpiration,
  });

const generateRefreshToken = user =>
  jwt.sign(user, config.jwt.refreshTokenSecret);
