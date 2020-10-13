export const LOGTYPE = {
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warn',
  DEBUG: 'debug',
};
export const APPNAME = 'AUTH_API';

export const APIROUTES = {
  AUTH: {
    SELF: '/auth',
    SIGNUP: '/signup',
    SIGNIN: '/signin',
    TOKEN: '/token',
    FORGETPASSWORD: '/forget-password',
  },
};

export const AUTHTYPE = {
  JWT: 'JWT',
  BASIC: 'basic',
};

export const COLLECTION = {
  USERS: 'users',
};

export const USER = {
  USERLEVEL: {
    GENERAL: 'general',
    ADMIN: 'admin',
  },
};
