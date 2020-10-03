import jwt from 'jsonwebtoken';

import { authServices, userServices } from '../../services';
import { Logger } from '../../middleware/logger';
import { constants, ErrorHandler, InternalServerError } from '../../util';
import config from '../../config';

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

    // Step1 - JWT
    // TODO: Step2 - Session
    // TODO: Step3 - Cookie Authentication

    const user = { UserId, FirstName, LastName };

    let data = {};
    if (authtype === constants.AUTHTYPE.JWT) {
      // Generate Access Token and Refresh Token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save the token in database
      const isTokenSet = await authServices.setToken(
        UserId,
        accessToken,
        refreshToken,
      );

      if (!isTokenSet) {
        throw new InternalServerError('Cannot Set Token');
      }
      data = {
        ...data,
        authType: authtype,
        tokens: { accessToken, refreshToken },
      };
    } else if (authtype === constants.AUTHTYPE.BASIC) {
      data = { ...data, authType: authtype, user };
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
export const signout = (req, res, next) => {
  res.status(200).json({ message: 'This is Logout Route' });
};

export const getNewTokens = async (req, res, next) => {
  try {
    const requestData = req.body;
    const { token, tokenData } = requestData;
    const { UserId, FirstName, LastName } = tokenData;

    // Find Token in Database
    const prevTokenId = await authServices.verifyRefreshToken(UserId, token);

    if (!prevTokenId) {
      throw new Error('Invalid Token For User');
    }

    // Create New Tokens
    const accessToken = generateAccessToken({ UserId, FirstName, LastName });
    const refreshToken = generateRefreshToken({ UserId, FirstName, LastName });

    // Set New Tokens
    const areNewTokensSet = await authServices.setToken(
      UserId,
      accessToken,
      refreshToken,
      prevTokenId,
    );
    if (!areNewTokensSet) {
      throw new Error('New Tokens Not Set');
    }

    // Return New Tokens
    res
      .status(200)
      .json({ success: true, data: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper Methods
 */
// Generate Tokens
const generateAccessToken = data =>
  jwt.sign(data, config.jwt.accessTokenSecret, {
    expiresIn: config.jwt.accessTokenExpiration,
  });
const generateRefreshToken = data =>
  jwt.sign(data, config.jwt.refreshTokenSecret, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
