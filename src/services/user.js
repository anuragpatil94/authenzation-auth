import { v4 } from 'uuid';
import { Logger } from '../middleware/logger';
import { InternalServerError, constants } from '../util';
import { databaseConnection } from '../middleware/database';

export const createUser = async userData => {
  try {
    // Create database Instance
    const db = await databaseConnection();

    // Create document to be inserted to the database
    const newUser = {
      userId: v4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      password: userData.password,
    };

    // Insert newUser to the database
    const insertOperation = await db.query(
      'insert into  users ("UserId", "FirstName", "LastName", "Username", "Password")  values (${userId}, ${firstName}, ${lastName}, ${username}, ${password} ) returning "UserId";',
      newUser,
    );

    const lastInsertedId = insertOperation[0].UserId || false;

    // Check if the data is inserted or not.
    if (!lastInsertedId) {
      throw new InternalServerError('Cannot create user');
    }

    Logger.info('User document inserted in database');

    return lastInsertedId;
  } catch (err) {
    Logger.error(err.message);
    throw err;
  }
};

export const findUserByUsername = async username => {
  try {
    // Create database Instance
    const db = await databaseConnection();

    const user = await db.query(
      `select * from users where "Username"='${username}'`,
      { username },
    );

    if (user && user.length > 0) return user;
    return false;
  } catch (error) {
    Logger.error(error.message);
    throw error;
  }
};

export const findUserById = () => {};

export const findAllUsers = () => {};

export const deleteUser = async username => {
  try {
    // Create database Instance
    const db = await databaseConnection();
    await db.query(`delete from users where "Username"='${username}';`, {
      username,
    });
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
