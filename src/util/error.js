export class BadRequestError extends Error {
  constructor(message = '') {
    let msg = 'Bad Input Parameter';
    if (message) {
      msg = msg + `: ${message}`;
    }
    super(msg);
    this.status = 400;
  }
}

export class ErrorHandler extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class InternalServerError extends Error {
  constructor(message = '') {
    super(message);
    this.status = 500;
  }
}
