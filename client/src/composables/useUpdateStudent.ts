import type { UpdateStudentSchema } from "@/schemas/updateStudentSchema";
import { StudentService } from "@/services/StudentService";
import { useMutation } from "@tanstack/vue-query";

export function useUpdateStudent() {
  const mutation = useMutation<void, Error, UpdateStudentSchema & { ra: string }>({
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
