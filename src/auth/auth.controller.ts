import { Controller, Post, Body, Request, UseGuards, HttpCode, HttpStatus, Get, Query, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard'; // We will create this guard
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Needed for Swagger doc if register is here
import { UsersService } from '../users/users.service'; // Needed if register is here

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService // Inject UsersService if register stays here
    ) {}

  // If register stays in UsersController, remove it from here.
  // If moved here, uncomment and adjust:
  /*
  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado.' })
  async register(@Body() createUserDto: CreateUserDto) {
    // Consider moving registration logic fully to AuthService or keep in UsersService
    return this.usersService.create(createUserDto);
  }
  */

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indicates that this endpoint requires a Bearer token
  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Retorna dados do perfil do usuário.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy.validate
    return req.user;
  }

  // Logout: In a stateless JWT setup, logout is typically handled client-side
  // by deleting the token. No backend endpoint is strictly necessary unless
  // managing refresh tokens or a token blacklist.
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer logout (simulação/placeholder)' })
  @ApiResponse({ status: 200, description: 'Logout simulado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async logout(@Request() req) {
      // For stateless JWT, there's nothing to do on the server side typically.
      // If using refresh tokens or a blacklist, implement invalidation here.
      console.log(`User ${req.user.email} logged out.`);
      return { message: 'Logout bem-sucedido (token deve ser removido no cliente).' };
  }

  @Post('request-password-recovery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiQuery({ name: 'email', required: true, description: 'Email do usuário para recuperação' })
  @ApiResponse({ status: 200, description: 'Instruções de recuperação enviadas (se o email existir).' })
  async requestPasswordRecovery(@Query('email') email: string) {
      return this.authService.requestPasswordRecovery(email);
  }

  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir senha usando token de recuperação' })
  @ApiParam({ name: 'token', required: true, description: 'Token de recuperação recebido por email' })
  @ApiBody({ schema: { type: 'object', properties: { newPassword: { type: 'string', minLength: 6 } } } })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou senha fraca.' })
  @ApiResponse({ status: 401, description: 'Não autorizado (token inválido/expirado).' })
  async resetPassword(@Param('token') token: string, @Body('newPassword') newPassword: string) {
      // Add validation for newPassword if not using DTO
      if (!newPassword || newPassword.length < 6) {
          throw new Error('Nova senha inválida ou muito curta.'); // Use appropriate NestJS exception
      }
      return this.authService.resetPassword(token, newPassword);
  }

}