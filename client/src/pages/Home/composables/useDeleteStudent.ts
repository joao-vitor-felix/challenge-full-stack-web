import { StudentService } from "@/services/StudentService";
import { useMutation } from "@tanstack/vue-query";

export function useDeleteStudent() {
  const mutation = useMutation<void, Error, string>({
    mutationFn: ra => StudentService.delete(ra)
  });
  return mutation;
}
