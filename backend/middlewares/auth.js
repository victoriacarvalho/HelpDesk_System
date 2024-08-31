import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
      return next(
        new ErrorHandler("Usuário não autenticado para o dashboard!", 400)
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!["Administrador", "Técnico"].includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} não autorizado para esta funcionalidade!`, 403)
      );
    }
    next();
  }
);

export const isUserPadraoAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.padraoToken;
    if (!token) {
        return next(new ErrorHandler("Usuário não autenticado!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Padrao") {
        return next(
          new ErrorHandler("Não autorizado para estes recursos!", 403)
        );
    }
    next();
  }
);

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} não autorizado para acessar este recurso!`, 403)
          );
        }
        next();
    };
};
