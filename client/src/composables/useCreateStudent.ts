import { StudentService } from "@/services/StudentService";
import type { Student } from "@/types/Student";
import { useMutation } from "@tanstack/vue-query";

export function useCreateStudent() {
  const mutation = useMutation<void, Error, Student>({
    mutationFn: student => StudentService.create(student)
  });
  return mutation;
}
