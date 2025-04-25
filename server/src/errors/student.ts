export class RaAlreadyTakenError extends Error {
  code: string;
  constructor() {
    super("A student with the provided ra already exists");
    this.code = "RA_ALREADY_TAKEN";
  }
}

export class EmailAlreadyTakenError extends Error {
  code: string;
  constructor() {
    super("A student with the provided email already exists");
    this.code = "EMAIL_ALREADY_TAKEN";
  }
}

export class CpfAlreadyTakenError extends Error {
  code: string;
  constructor() {
    super("A student with the provided cpf already exists");
    this.code = "CPF_ALREADY_TAKEN";
  }
}
