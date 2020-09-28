import jwt from 'jsonwebtoken';

import { authServices, userServices } from '../../services';
import { Logger } from '../../middleware/logger';
import { constants, ErrorHandler, InternalServerError } from '../../util';
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
    const { Username, Password, authtype } = requestData;

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

    let data = {};

    const user = { UserId, FirstName, LastName };

    if (authtype === constants.AUTHTYPE.JWT) {
      // Generate Access Token and Refresh Token
      const accessToken = generateToken(user, config.jwt.accessTokenExpiration);
      const refreshToken = generateToken(
        user,
        config.jwt.refreshTokenExpiration,
      );
      // Save the token in database
      const isTokenSet = await authServices.setToken({
        userId: UserId,
        accessToken,
        refreshToken,
      });

      if (!isTokenSet) {
        throw new InternalServerError('Cannot Set Token');
      }
      data = { accessToken, refreshToken };
    } else if (authType === constants.AUTHTYPE.BASIC) {
      data = { ...data, user };
    }

    res.status(200).json({ success: true, data });
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
const generateToken = (user, expireTime) =>
  jwt.sign(user, config.jwt.accessTokenSecret, {
    expiresIn: expireTime,
  });
