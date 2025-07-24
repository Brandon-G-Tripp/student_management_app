import apiClient from "../../api/apiClient";
import { type Student } from "../../types";

export const getStudents = async (): Promise<Student[]> => {
  const resp = await apiClient.get<Student[]>('/students');
  return resp.data;
}

export const createStudent = async (studentData: Omit<Student, 'id'>): Promise<Student> => {
  const resp = await apiClient.post<Student>('/students', studentData);
  return resp.data;
}
