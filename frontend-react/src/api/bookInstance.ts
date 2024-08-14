import { BookInstance, BookInstanceQuery } from "@/type";
import request from "@/utils/request";
import qs from "qs";


export async function getBookInstancesList(params?: BookInstanceQuery) {
    try {
      return request.get(`/api/bookInstances?${qs.stringify(params)}`);
    } catch (error) {
      console.error('Failed to get bookType List:', error);
      throw error; 
    }
  };

  export async function updateBookInstance(id: string, updateData: BookInstance) {
    try {
        const response = await request.patch(`/api/bookInstances/${id}`, updateData);
        return response.data; 
    } catch (error) {
        console.error('Failed to update BookType:', error);
        throw error; 
    }
  }