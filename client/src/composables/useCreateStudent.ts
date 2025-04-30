import { StudentService } from "@/services/StudentService";
import type { Error } from "@/types/Error";
import type { Student } from "@/types/Student";
import { useMutation } from "@tanstack/vue-query";
import type { AxiosError } from "axios";

export function useCreateStudent() {
  const mutation = useMutation<void, AxiosError<Error>, Student>({
    mutationFn: student => StudentService.create(student)
  });
  return mutation;
}
