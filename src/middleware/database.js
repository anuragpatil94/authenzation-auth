import { MongoClient } from 'mongodb';

import config from '../config';
import { Logger } from './logger';
import { constants } from '../util';

const usersSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'details',
      'username',
      'password',
      'salt',
      'userLevel',
      'createdAt',
    ],
    properties: {
      details: {
        bsonType: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          firstName: {
            bsonType: 'string',
          },
          middleName: {
            bsonType: 'string',
          },
          lastName: {
            bsonType: 'string',
          },
          age: {
            bsonType: 'int',
          },
          addressId: {
            bsonType: 'objectId',
          },
        },
      },
      username: {
        bsonType: 'string',
        description:
          'Username is a Unique string which is also an Index and is Required',
      },
      password: {
        bsonType: 'string',
        description: 'Bcrypted Password with Salt',
      },
      salt: {
        bsonType: 'string',
        description: 'Salt used to Hash Password',
      },
      userLevel: {
        enum: ['admin', 'general'],
        description: 'This is based on level of access granted to the user',
      },
      jwtRefreshToken: {
        bsonType: 'string',
      },
      createdAt: {
        bsonType: 'date',
      },
    },
  },
};

export const databaseConnection = async () => {
  try {
    const url = config.databaseConfig.mongoURI;
    const username = config.databaseConfig.mongoUser;
    const password = config.databaseConfig.mongoPassword;
    const databaseName = config.databaseConfig.mongoDbName;

    const mongoClient = new MongoClient(url, {
      useUnifiedTopology: true,
      appname: constants.APPNAME,
      authSource: databaseName,
      auth: { user: username, password: password },
    });

    await mongoClient.connect();
    const db = mongoClient.db(databaseName);

    const collections = await db
      .listCollections({}, { nameOnly: true })
      .toArray();

    const collectionList = collections.map(collection => collection.name);

    // UNCOMMENT IF YOU WANT TO DELETE USERS COLLECTION
    // if (process.env.NODE_ENV === "development") {
    //   if (collectionList.includes("users")) {
    //     await db.dropCollection("users");
    //     collectionList.pop("users");
    //     Logger.info("Dropped Users Collection");
    //   }
    // }

    if (!collectionList.includes('users')) {
      await (
        await db.createCollection('users', {
          validator: usersSchema,
          validationLevel: 'strict',
          validationAction: 'error',
        })
      ).createIndex({ username: 1 }, { name: 'userNameIndex', unique: true });

      Logger.info('Created Users Collection');
    }

    return db;
  } catch (err) {
    Logger.error('Connection to database failed!!');
    Logger.error(err);
    return 0;
  }
};
