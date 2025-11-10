export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  line_user_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateDto {
  email: string;
  password: string;
  name: string;
  line_user_id?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  line_user_id?: string;
  created_at: Date;
}
