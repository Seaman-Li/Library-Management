import request from "@/utils/request";
import qs from "qs";
import { BookQueryType, BookType } from "../type"

export async function getBookList(params?: BookQueryType) {
  try {
    return request.get(`/api/bookTypes?${qs.stringify(params)}`);
  } catch (error) {
    console.error('Failed to get bookType List:', error);
    throw error; 
  }
};

export async function BookTypeAdd(params: BookType) {
  try {
    return request.post("/api/bookTypes", params);
  } catch (error) {
    console.error('Failed to add bookType:', error);
    throw error; 
  }
};

export async function bookDelete(id: string) {
  try {
    return request.delete("/api/bookTypes/${id}");
  } catch (error) {
    console.error('Failed to delete bookType:', error);
    throw error; 
  }
};

export async function getCategories() {
  try {
    const response = await request.get('/api/bookTypes/categories');
    return response; 
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};

export async function getBookTypeById(id: string) {
  try {
    const response = await request.get(`/api/bookTypes/${id}`);
    return response; // 假设 response 结构中的数据是在 data 属性中
  } catch (error) {
    console.error('Failed to get bookType by ID:', error);
    throw error;
  }
};


export async function updateBookType(id: string, updateData: BookType) {
  try {
      const response = await request.patch(`/api/bookTypes/${id}`, updateData);
      return response.data; // 返回更新后的 BookType
  } catch (error) {
      console.error('Failed to update BookType:', error);
      throw error; 
  }
}
