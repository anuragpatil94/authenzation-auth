import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import config from '../config';
import { db } from '../middleware/database';

import { Logger } from '../middleware/logger';
import { findUserByUsername } from './user';

/**
 * Gets the UserId of the User after matching the Username and Password of the user
 * @param {string} username username recieved from API Request
 * @param {string} password password in plain text from API Request
 *
 * @returns {string|boolean} returns _id if user is verified else returns false
 */
const verifyUser = async (username, password) => {
  try {
    const [user] = await findUserByUsername(username);
    if (!user) {
      return false;
    }

    const isUserValid = await verifyPassword(password, user.Password);

    const { UserId, FirstName, LastName } = user;
    if (isUserValid) {
      return { UserId, FirstName, LastName };
    }
    return false;
  } catch (error) {
    Logger.error(error.message);
    throw error;
  }
};

const setToken = async ({ userId, accessToken, refreshToken }) => {
  const id = v4();
  const { TokenId } = await db.one(`
    insert into 
    tokens ("TokenId", "UserId", "AccessToken", "RefreshToken") 
    values ('${id}','${userId}','${accessToken}','${refreshToken}') returning "TokenId";`);

  if (TokenId) {
    return true;
  }
  return false;
};

const encryptPassword = async password => {
  // Salt Rounds to generate Salt
  const saltRounds = 10;

  // Generate Salt
  const salt = await bcrypt.genSalt(saltRounds);
  // Generate Hashed Password based on salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return { salt, hashedPassword };
};

const verifyPassword = async (password, hash) => {
  // Comparing request password with the database stored hash password
  const result = await bcrypt.compare(password, hash);
  return result;
};

export { verifyUser, encryptPassword, setToken };
