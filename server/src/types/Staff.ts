export type Staff = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: "REGISTRAR" | "PROFESSOR";
};
