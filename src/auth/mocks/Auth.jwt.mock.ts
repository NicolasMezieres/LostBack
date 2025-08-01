export const AuthJwtMock = {
  signAsync: jest.fn().mockResolvedValue('jwtToken'),
};
