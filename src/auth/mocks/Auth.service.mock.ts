import {
  messageMock,
  signinResponseMock,
  signupMessageMock,
  tokenMock,
} from './auth.mock';

export class AuthServiceMock {
  forgetPassword = jest.fn().mockResolvedValue(messageMock);
  signup = jest.fn().mockResolvedValue(signupMessageMock);
  signin = jest.fn().mockResolvedValue(signinResponseMock);
  resetPassword = jest.fn().mockResolvedValue(messageMock);
  activationAccount = jest.fn().mockResolvedValue(messageMock);
  signToken = jest.fn().mockRejectedValue(tokenMock);
}
