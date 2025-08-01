import { Response } from 'express';
export const messageMock = { messsage: 'message' };
export const signupMessageMock = {
  message: 'Your account as been create !',
};
export const signinResponseMock = {
  message: 'Connexion succesfully',
  role: 'role',
};
export const tokenMock = { connexion_token: 'jwtToken' };
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
export const cookieRuleMock = {
  // permet au cookie d'être accessible uniquement au serveur web
  httpOnly: true,
  //strict si c'est le front et le back on le même url sinon none
  sameSite: 'none',
  //durée du cookie
  maxAge: 1000 * 60 * 60 * 24 * 7,
  //est ce que le cookie doit provenir d'un https et est ce que c'est le même nom de domaine entre back et front
  secure: process.env.IS_PRODUCTION === 'true' ? true : false,
};
