export type Error = {
  message: string;
  code: ErrorCode;
};

type ErrorCode =
  | "PASSWORD_MISMATCH"
  | "STAFF_NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "RA_ALREADY_TAKEN"
  | "EMAIL_ALREADY_TAKEN"
  | "CPF_ALREADY_TAKEN"
  | "STUDENT_NOT_FOUND"
  | "STAFF_ALREADY_EXISTS";

export const errorMessageMap: Record<ErrorCode, string> = {
  PASSWORD_MISMATCH: "Senha incorreta",
  STAFF_NOT_FOUND: "Conta não encontrada",
  INTERNAL_SERVER_ERROR: "Erro interno do servidor",
  CPF_ALREADY_TAKEN: "Já existe um estudante com o CPF informado",
  RA_ALREADY_TAKEN: "Já existe um estudante com o RA informado",
  EMAIL_ALREADY_TAKEN: "Já existe um estudante com o e-mail informado",
  STAFF_ALREADY_EXISTS: "Funcionário já existe",
  STUDENT_NOT_FOUND: "Estudante não encontrado"
};
