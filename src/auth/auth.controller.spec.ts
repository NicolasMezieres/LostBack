import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock } from './mocks/Auth.service.mock';
import {
  messageMock,
  resMock,
  signinResponseMock,
  signupMessageMock,
  userMock,
} from './mocks/auth.mock';

describe('AuthController', () => {
  let authController: AuthController;
  //avant chaque test
  beforeEach(async () => {
    //on créer une zone de test qui aura pour reférence moduleRef
    const moduleRef = await Test.createTestingModule({
      // ca correspond au controlleur et les providers du module
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
    }).compile();
    // génère la classe AuthController en instance
    // afin de pouvoir tester les routes
    authController = moduleRef.get(AuthController);
  });
  it('should be defined', async () => {
    expect(authController).toBeDefined();
  });
  describe('forgetPassword', () => {
    it('should return a message', () => {
      const dto = { email: 'johndoe@gmail.com' };
      expect(authController.forgetPassword(dto)).resolves.toEqual(messageMock);
    });
  });
  describe('signup', () => {
    it('should return a message', () => {
      const dto = {
        firstName: 'test',
        lastName: 'test',
        username: 'test',
        email: 'example@example.com',
        password: 'StrongP@ssword73',
      };
      console.log(signupMessageMock);
      expect(authController.signup(dto)).resolves.toEqual(signupMessageMock);
    });
  });
  describe('signin', () => {
    it('should return a message', async () => {
      const dto = {
        identifier: 'test',
        password: 'StrongP@ssword73',
      };
      await expect(authController.signin(dto, resMock)).resolves.toEqual(
        signinResponseMock,
      );
    });
  });
  describe('resetPassword', () => {
    it('should return a message', async () => {
      const dto = {
        password: 'StrongP@ssword73',
      };
      await expect(
        authController.resetPassword(userMock, dto),
      ).resolves.toEqual(messageMock);
    });
  });
  describe('activationAccount', () => {
    it('should return a message', async () => {
      const token = 'token';
      await expect(authController.activationAccount(token)).resolves.toEqual(
        messageMock,
      );
    });
  });
});
