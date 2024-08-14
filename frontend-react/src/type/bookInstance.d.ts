export interface BookInstance {
    _id?: string;
    bookTypeID: {
      _id: string;
      name: string;
    };
    isBorrowed: boolean;
    createdAt: string;
  }
  
  export interface BookInstanceQuery {
    current?: number;
    pageSize?: number;
    _id?:string;
    bookName?:string;
    isBorrowed?: boolean; 
    all?: boolean;  
  }