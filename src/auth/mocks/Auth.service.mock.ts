import { messageMock, signinResponseMock } from './auth.mock';

export class AuthServiceMock {
  forgetPassword = jest.fn().mockResolvedValue(messageMock);
  signup = jest.fn().mockResolvedValue(messageMock);
  signin = jest.fn().mockResolvedValue(signinResponseMock);
  resetPassword = jest.fn().mockResolvedValue(messageMock);
  activationAccount = jest.fn().mockResolvedValue(messageMock);
}
