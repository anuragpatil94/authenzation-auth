import bcrypt from 'bcrypt';

import { databaseConnection } from '../middleware/database';
import { Logger } from '../middleware/logger';
import { InternalServerError, constants } from '../util';

const COLLECTION = constants.COLLECTION.USERS;

export const createUser = async userData => {
  try {
    // Create database Instance
    const db = await databaseConnection();

    // Create document to be inserted to the database
    const newUser = await createUserDocument(userData);

    // Insert newUser to the database
    const insertOperation = await db.collection(COLLECTION).insertOne(newUser);

    // Check if the data is inserted or not.
    if (!insertOperation.result.ok) {
      throw new InternalServerError('Cannot create user');
    }

    Logger.info('User document inserted in database');

    return insertOperation.insertedId;
  } catch (err) {
    throw err;
  }
};

export const findUserByUsername = async username => {
  try {
    const db = await databaseConnection();

    // TODO: Remove this later. added for testing.
    // await db.collection(COLLECTION).deleteOne({ username: username });

    const user = await db.collection(COLLECTION).findOne({ username });

    if (!user) return false;
    return user;
  } catch (error) {
    Logger.error(error.message);
    throw error;
  }
};

export const findUserById = () => {};

export const findAllUsers = () => {};

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

/*
Helper Methods
*/

const createUserDocument = async ({ username, password, ...details }) => {
  // Encrypt Password
  const { salt, hashedPassword } = await encryptPassword(password);

  // TODO: Added new fields
  // User Document
  const user = {
    username,
    password: hashedPassword,
    details: {
      firstName: details.firstName,
      lastName: details.lastName,
      ...(details.middleName && { middleName: details.middleName }),
    },
    salt,
    userLevel: constants.USER.USERLEVEL.GENERAL,
    createdAt: new Date(),
  };

  Logger.info('User document Created');
  return user;
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
