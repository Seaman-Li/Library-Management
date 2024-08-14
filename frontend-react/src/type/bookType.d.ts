export interface BookQueryType {
  name?: string;
  author?: string;
  category?: string;
  current?: number;
  pageSize?: number;
  all?: boolean; // 获取所有数据
}

export interface BookType {
  name: string;
  author: string;
  category: string;
  cover: string;
  publishAt?: number;
  stock: number;
  availableCount?: number;
  description: string;
  _id?: string;
}