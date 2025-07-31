import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock } from './mocks/Auth.service.mock';

describe('AuthController', () => {
  let authController: AuthController;
  //   let authService: AuthService;
  //avant chaque test
  beforeEach(async () => {
    //on créer une zone de test qui aura pour reférence moduleRef
    const moduleRef = await Test.createTestingModule({
      // ca correspond au controlleur et les providers du module
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
    }).compile();
    //je suppose que le compile c'est pour généré tous ça
    // on donne à quoi correspond tel variable afin d'y accèder plus tard
    authController = moduleRef.get(AuthController);
    // authService = moduleRef.get(AuthService);
  });
  describe('signup', () => {
    it('should be defined', async () => {
      expect(authController).toBeDefined();
      //   const message = 'Your account as been create !';
      //   const dto: signupDTO = {
      //     firstName: 'test',
      //     lastName: 'test',
      //     username: 'test',
      //     email: 'example@example.com',
      //     password: 'StrongP@ssword73',
      //   };
      //   const result = await authController.signup(dto);
      //   expect(result).toBe(message);
      //   expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });
});
