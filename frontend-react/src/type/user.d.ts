export interface UserQueryType {
  name?: string;
  status?: number;
  current?: number;
  pageSize?: number;
}

export interface UserType {
  _id?: string;
  name: string;
  password: string;
  // status: "on" | "off";
  nickname: string;
  role: USER_ROLE;
}

export interface UserLoginType {
  name: string;
  password: string;
}
