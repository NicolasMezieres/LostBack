import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPrismaMock } from './mocks/Auth.prisma.mock';
import {
  cookieRuleMock,
  resMock,
  roleMock,
  signinResponseMock,
  signupMessageMock,
  tokenMock,
  userMock,
} from './mocks/auth.mock';
import { AuthEmailMock } from './mocks/Auth.email.mock';
import { AuthJwtMock } from './mocks/Auth.jwt.mock';
import { AuthConfigMock } from './mocks/Auth.config.mock';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: AuthPrismaMock },
        { provide: EmailService, useValue: AuthEmailMock },
        { provide: JwtService, useValue: AuthJwtMock },
        { provide: ConfigService, useValue: AuthConfigMock },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('signup', () => {
    const dto = {
      firstName: 'test',
      lastName: 'test',
      username: 'maisouicclair',
      email: 'maisouicclair@example.com',
      password: 'StrongP@ssword73',
    };
    it('should return a {message: "Your account as been create !" }', () => {
      jest
        .spyOn(AuthPrismaMock.user, 'findUnique')
        .mockResolvedValue(undefined);
      jest
        .spyOn(AuthPrismaMock.user, 'findUnique')
        .mockResolvedValue(undefined);
      jest.spyOn(AuthPrismaMock.role, 'findUnique').mockResolvedValue(roleMock);
      jest
        .spyOn(argon, 'hash')
        .mockResolvedValueOnce('hashed password')
        .mockResolvedValueOnce('token hashed');
      jest.spyOn(AuthPrismaMock.user, 'create').mockResolvedValue(userMock);
      jest
        .spyOn(AuthEmailMock, 'accountConfirmation')
        .mockResolvedValue(undefined);

      expect(authService.signup(dto)).resolves.toEqual(signupMessageMock);
    });
    it('shloud throw a unauthorized exception, username is already taken', () => {
      jest.spyOn(AuthPrismaMock.user, 'findUnique').mockResolvedValue(userMock);
      expect(() => authService.signup(dto)).rejects.toEqual(
        new UnauthorizedException('Username is already taken'),
      );
    });
    it('shloud throw a unauthorized exception, email is already taken', () => {
      // j'utilise mockResolvedValueOnce car mockResolvedValue ecrase les mock identique précedent
      jest
        .spyOn(AuthPrismaMock.user, 'findUnique')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(userMock);

      expect(() => authService.signup(dto)).rejects.toEqual(
        new UnauthorizedException('Email is already taken'),
      );
    });
    it('shloud throw a internal server error exception, Error on the Database', () => {
      jest
        .spyOn(AuthPrismaMock.user, 'findUnique')
        .mockResolvedValue(undefined);
      jest
        .spyOn(AuthPrismaMock.role, 'findUnique')
        .mockResolvedValue(undefined);
      expect(() => authService.signup(dto)).rejects.toEqual(
        new InternalServerErrorException('Error on the Database'),
      );
    });
  });
  describe('signin', () => {
    const dto = {
      identifier: 'maisouicclair@example.com',
      password: 'StrongP@ssword73',
    };
    it("should return {message:'Connexion succesfully', role:'role'}", async () => {
      const dataUser = { ...userMock, role: { name: 'role' } };
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(dataUser);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);
      jest.spyOn(authService, 'signToken').mockResolvedValue(tokenMock);

      expect(await authService.signin(dto, resMock)).toEqual(
        signinResponseMock,
      );
      expect(resMock.cookie).toHaveBeenCalledWith(
        'access_token',
        tokenMock.connexion_token,
        cookieRuleMock,
      );
    });
    it('should return unauthorized exception Invalid credential', () => {
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(undefined);
      expect(authService.signin(dto, resMock)).rejects.toEqual(
        new UnauthorizedException('Invalid credential'),
      );
    });
    it('should return unauthorized exception Your account is not active', () => {
      const user = { ...userMock };
      user.isActive = false;
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(user);
      expect(authService.signin(dto, resMock)).rejects.toEqual(
        new UnauthorizedException('Your account is not active'),
      );
    });
    it('should return unauthorized exception Invalid credential', () => {
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(userMock);
      jest.spyOn(argon, 'verify').mockResolvedValue(false);
      expect(authService.signin(dto, resMock)).rejects.toEqual(
        new UnauthorizedException('Invalid credential'),
      );
    });
  });
  describe('activationAccount', () => {
    const token = 'token';
    it('should return Your account is active ! ', () => {
      const user = { ...userMock };
      user.activationToken = token;
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(userMock);
      jest.spyOn(AuthPrismaMock.user, 'update').mockResolvedValue(userMock);
      expect(authService.activationAccount(token)).resolves.toEqual({
        message: 'Your account is active !',
      });
    });
    it('should return Not found exception Account not found', () => {
      jest.spyOn(AuthPrismaMock.user, 'findFirst').mockResolvedValue(undefined);
      expect(authService.activationAccount(token)).rejects.toEqual(
        new NotFoundException('Account not found'),
      );
    });
  });
  describe('signToken', () => {
    it('should return connexion token', () => {
      jest.spyOn(AuthJwtMock, 'signAsync').mockResolvedValue('jwtToken');
      jest.spyOn(AuthConfigMock, 'get').mockResolvedValue('jwt secret');
      expect(authService.signToken(userMock, '1d')).resolves.toEqual({
        connexion_token: 'jwtToken',
      });
    });
  });
  describe('forgetPassword', () => {
    const dto = { email: 'email@email.com' };
    it('should return Check your email', () => {
      jest.spyOn(AuthPrismaMock.user, 'findUnique').mockResolvedValue(userMock);
      expect(authService.forgetPassword(dto)).resolves.toEqual({
        message: 'Check your email',
      });
    });
    it('should return Your account is not active', () => {
      const user = { ...userMock };
      user.isActive = false;
      jest.spyOn(AuthPrismaMock.user, 'findUnique').mockResolvedValue(user);
      expect(authService.forgetPassword(dto)).resolves.toEqual({
        message: 'Your account is not active',
      });
    });
  });
  describe('resetPassword', () => {
    it('should return Password change, congratuilations !', () => {
      jest.spyOn(argon, 'hash').mockResolvedValue('hashed new password');
      expect(
        authService.resetPassword(userMock, { password: 'new password' }),
      ).resolves.toEqual({ message: 'Password change, congratulations !' });
    });
  });
});
