import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request, @Res() res: Response) {
    if (req.user === 'Email is not verified!') {
      return res.status(401).json({
        message: 'Email is not verified!',
      });
    } else if ((req.user as any).token) {
      return res.status(200).json({
        message: 'Login successful',
        token: (req.user as any).token,
      });
    } else {
      return res.status(401).json({
        message: 'Email or password is invalid',
      });
    }
  }
}
