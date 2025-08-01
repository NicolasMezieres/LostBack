import { userMock } from './auth.mock';

export const AuthPrismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn().mockResolvedValue(userMock),
    update: jest.fn(),
  },
  role: {
    findUnique: jest.fn(),
  },
};
