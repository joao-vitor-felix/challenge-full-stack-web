export type Student = {
  ra: string;
  cpf: string;
  name: string;
  email: string;
};

export type ListStudentsResponse = {
  data: Student[];
  pagination: {
    total: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
};
