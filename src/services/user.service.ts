import { supabase } from '../config/database';
import { UserResponseDto } from '../models/user.model';

export class UserService {
  async getUserById(userId: string): Promise<UserResponseDto | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, line_user_id, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as UserResponseDto;
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, line_user_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch users');
    }

    return (data as UserResponseDto[]) || [];
  }

  async updateUser(
    userId: string,
    updates: Partial<{ name: string; line_user_id: string }>
  ): Promise<UserResponseDto> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, name, line_user_id, created_at')
      .single();

    if (error || !data) {
      throw new Error('Failed to update user');
    }

    return data as UserResponseDto;
  }

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) {
      throw new Error('Failed to delete user');
    }
  }
}
