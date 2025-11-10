import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../models/auth.model';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const registerDto: RegisterDto = req.body;

      if (!registerDto.email || !registerDto.password || !registerDto.name) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const result = await this.authService.register(registerDto);

      res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({ error: message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;

      if (!loginDto.email || !loginDto.password) {
        res.status(400).json({ error: 'Missing email or password' });
        return;
      }

      const result = await this.authService.login(loginDto);

      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({ error: message });
    }
  };
}
