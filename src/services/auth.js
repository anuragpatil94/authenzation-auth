import { databaseConnection } from '../middleware/database';
import { Logger } from '../middleware/logger';
import { constants } from '../util';
import { findUserByUsername } from './user';

/**
 * Gets the UserId of the User after matching the Username and Password of the user
 * @param {string} username username recieved from API Request
 * @param {string} password password in plain text from API Request
 *
 * @returns {string|boolean} returns _id if user is verified else returns false
 */
export const verifyUser = async (username, password) => {
  try {
    const user = await findUserByUsername(username);

    const isUserValid = await verifyPassword(password, user.password);
    if (isUserValid) {
      return user._id;
    }
    return false;
  } catch (error) {
    Logger.error(error.message);
    throw error;
  }
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
