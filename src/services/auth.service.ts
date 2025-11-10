import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';
import { config } from '../config/env';
import { LoginDto, RegisterDto, AuthResponse } from '../models/auth.model';

export class AuthService {
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name } = registerDto;

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword,
        name,
      })
      .select('id, email, name')
      .single();

    if (error || !newUser) {
      throw new Error('Failed to create user');
    }

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      config.jwt.secret
    );

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, password')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwt.secret
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
