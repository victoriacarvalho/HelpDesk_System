import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const userPadraoRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, sector, password, registration, role} = req.body;

    if (!firstName || 
        !lastName || 
        !email || 
        !phone || 
        !sector || 
        !password || 
        !registration
    ) {
        return next(new ErrorHandler("Por favor, preencha todo o formulário!", 400));
    }

    const isRegistered = await User.findOne({ registration });
    if (isRegistered) {
        return next(new ErrorHandler("Matrícula já cadastrada!", 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        sector,
        password,
        registration,
        role: "Padrao",
    });

    generateToken(user, "Usuário Registrado!", 200, res);

    });

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, registration } = req.body;
    
    if (!email || !password || !registration) {
        return next(new ErrorHandler("Por favor, preencha todos os detalhes!", 400));
    }
    
    const user = await User.findOne({ registration }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Matrícula ou senha inválidos!", 400));
    }
     /*   const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }*/ 

    generateToken(user, "Usuário logado com sucesso!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, sector, registration } = req.body;
    
    if (!firstName ||
        !lastName || 
        !email || 
        !phone || 
        !sector || 
        !password || 
        !registration
    ) {
        return next(new ErrorHandler("Por favor, preencha todo o formulário!", 400));
    }
    
    const isRegistered = await User.findOne({ registration });
    if (isRegistered) {
      return next(new ErrorHandler("Já existe um administrador com esta matrícula!", 400));
    }
    
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        sector,
        password,
        registration,
        role: "Administrador",
    });
    
    res.status(200).json({
        success: true,
        message: "Novo administrador registrado!",
        admin,
    });
});


export const addNewTecnico = catchAsyncErrors(async (req, res, next) => {

    const { firstName, 
            lastName, 
            email, 
            phone, 
            sector, 
            registration, 
            password,
         } = req.body;
    
    if (!firstName || 
        !lastName || 
        !email || 
        !phone || 
        !sector || 
        !registration || 
        !password
        
    ) {
        return next(new ErrorHandler("Por favor, preencha todo o formulário!", 400));
    }
    
    const isRegistered = await User.findOne({ registration });
    if (isRegistered) {
        return next(new ErrorHandler("Já existe um técnico com essa matrícula", 400));
    }
    
    const tecnico = await User.create({
        firstName,
        lastName,
        email,
        phone,
        sector,
        registration,
        password
    });
    
    res.status(200).json({
        success: true,
        message: "Novo Técnico registrado!",
        tecnico,
    });
});


export const getAllTecnicos = catchAsyncErrors(async (req, res, next) => {
    const tecnicos = await User.find({ role: "Tecnico" });
    res.status(200).json({
        success: true,
        tecnicos,
    });
});


export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Administrador fez logout com sucesso!.",
      });
  });

  export const logoutPadrao = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("padraoToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Usuário fez logout com sucesso!.",
      });
  });