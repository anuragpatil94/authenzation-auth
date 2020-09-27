import { v4 } from 'uuid';
import { Logger } from '../middleware/logger';
import { InternalServerError } from '../util';
import { db } from '../middleware/database';
import { authServices } from '.';
import config from '../config';

export const createUser = async ({
  firstName,
  lastName,
  username,
  password,
}) => {
  try {
    // Create document to be inserted to the database
    const { salt, hashedPassword } = await authServices.encryptPassword(
      password,
    );
    const newUser = {
      userId: v4(),
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hashedPassword,
    };

    // Insert newUser to the database
    const insertOperation = await db.query(
      'insert into users ("UserId", "FirstName", "LastName", "Username", "Password") values (${userId}, ${firstName}, ${lastName}, ${username}, ${password} ) returning "UserId";',
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
    await db.query(`delete from users where "Username"='${username}';`, {
      username,
    });
  } catch (error) {
    Logger.error(error.message);
    throw error;
  }
};
