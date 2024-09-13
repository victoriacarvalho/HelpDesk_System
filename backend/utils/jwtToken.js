export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === 'Administrador' || user.role === 'Tecnico' ? 'adminToken' : 'padraoToken';

  res
  .status(statusCode)
  .cookie(cookieName, token, {
      expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Habilitar secure em produção
      sameSite: 'None',
  })
  .json({
      success: true,
      message,
      user,
      token,
  });
};
