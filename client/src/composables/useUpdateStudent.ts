import type { UpdateStudentSchema } from "@/schemas/updateStudentSchema";
import { StudentService } from "@/services/StudentService";
import type { Error } from "@/types/Error";
import { useMutation } from "@tanstack/vue-query";
import type { AxiosError } from "axios";

export function useUpdateStudent() {
  const mutation = useMutation<void, AxiosError<Error>, UpdateStudentSchema & { ra: string }>({
    mutationFn: data =>
      StudentService.update(
        {
          name: data.name,
          email: data.email
        },
        data.ra
      )
  });
  return mutation;
}
