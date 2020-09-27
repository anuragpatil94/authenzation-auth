import jwt from 'jsonwebtoken';

import { authServices, userServices } from '../../services';
import { Logger } from '../../middleware/logger';
import { ErrorHandler } from '../../util';
import config from '../../config';
import { create } from 'lodash';

export const signup = async (req, res, next) => {
  try {
    // Get data from the request
    const requestData = req.body;
    const { Username } = requestData;

    if (config.env.isDevelopment) {
      await userServices.deleteUser(Username);
    }
    // Check if user exist
    const user = await userServices.findUserByUsername(Username);

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
    const requestData = req.body;
    const { Username, Password } = requestData;
    // TODO: Use AuthType
    // const authType = authtype;

    // Verify if user is in database and correct credentials
    const { UserId, FirstName, LastName } = await authServices.verifyUser(
      Username,
      Password,
    );

    // Throw error if User is not received.
    if (!UserId) {
      throw new ErrorHandler(401, 'User Credentials Invalid!');
    }

    // TODO: Step1 - JWT
    // TODO: Step2 - Session
    // TODO: Step3 - Cookie Authentication

    const user = { UserId, FirstName, LastName };

    // const accessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

    res.status(200).json({ success: true, data: { user } });
    // .json({ success: true, data: { accessToken, refreshToken } });
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
