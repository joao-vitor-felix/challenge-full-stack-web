import { StudentService } from "@/services/StudentService";
import type { ListStudentsResponse } from "@/types/Student";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";

export function useListStudents(page: Ref<number>, pageSize: Ref<number>, name?: Ref<string>) {
  const query = useQuery<ListStudentsResponse>({
    queryKey: ["students", page, pageSize],
    queryFn: () => StudentService.list(page.value, pageSize.value, name?.value),
    refetchOnWindowFocus: false
  });
  return query;
}
