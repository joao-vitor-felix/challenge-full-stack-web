import { HttpError } from "./HttpError";

export class RaAlreadyTakenError extends HttpError {
  constructor() {
    super(
      409,
      "A student with the provided ra already exists",
      "RA_ALREADY_TAKEN"
    );
  }
}

export class EmailAlreadyTakenError extends HttpError {
  constructor() {
    super(
      409,
      "A student with the provided email already exists",
      "EMAIL_ALREADY_TAKEN"
    );
  }
}

export class CpfAlreadyTakenError extends HttpError {
  constructor() {
    super(
      409,
      "A student with the provided cpf already exists",
      "CPF_ALREADY_TAKEN"
    );
  }
}
