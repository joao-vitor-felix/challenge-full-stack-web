export class StaffNotFoundError extends Error {
  code: string;
  constructor() {
    super("Staff not found");
    this.code = "STAFF_NOT_FOUND";
  }
}

export class PasswordMismatchError extends Error {
  code: string;
  constructor() {
    super("Wrong password");
    this.code = "PASSWORD_MISMATCH";
  }
}
