import { api } from "@/lib/api";
import type { ListStudentsResponse } from "@/types/Student";

export class StudentService {
  static async list(page: number, pageSize: number, name = "") {
    let url = `/students?page=${page}&pageSize=${pageSize}`;

    if (name) {
      url = url.concat(`&name=${name}`);
    }

    const { data } = await api.get<ListStudentsResponse>(url);
    return data;
  }

  static async delete(ra: string) {
    await api.delete(`/students/${ra}`);
  }
}
