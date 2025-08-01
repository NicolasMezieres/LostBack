import { Response } from 'express';
export const messageMock = { messsage: 'message' };
export const signupMessageMock = {
  message: 'Your account as been create !',
};
export const signinResponseMock = {
  message: 'Connexion succesfully',
  role: 'role',
};

export const resMock = { cookie: jest.fn() } as unknown as Response;

export const userMock = {
  id: '1',
  roleId: '1',
  firstName: 'test',
  lastName: 'test',
  username: 'maisouicclair',
  password: 'StrongP@ssword73',
  email: 'maisouicclai@example.com',
  isActive: true,
  activationToken: '',
  gdpr: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const adminMock = {
  id: '1',
  roleId: '2',
  username: 'username',
  firstName: 'test',
  lastName: 'test',
  password: 'StrongP@ssword73',
  email: 'email@example.com',
  isActive: true,
  activationToken: '',
  gdpr: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const roleMock = {
  id: 1,
  role: 'role',
};
