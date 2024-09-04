import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Chamado } from "../models/chamadoSchema.js";
import { User } from "../models/userSchema.js";

export const postChamado = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        sector,
        chamado_date,
        title,
        description,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !sector ||
        !title ||
        !description
        
    ) {
        return next(new ErrorHandler("Por favor, preencha todo o formulário!", 400));
    }

    const userId = req.user._id;
    const chamado = await Chamado.create({
        firstName,
        lastName,
        email,
        phone,
        sector,
        title,
        description,
        userId,
    });
     res.status(200).json({
        success: true,
        chamado,
        message: "Chamado enviado!",
   });
        
});

export const getAllChamados = catchAsyncErrors(async (req, res, next) => {
    const chamados = await Chamado.find();
    res.status(200).json({
        success: true,
        chamados,
    });
});

export const updateChamadoStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    let chamado = await Chamado.findById(id);
    if (!chamado) {
        return next(new ErrorHandler("Chamado não encontrado!", 404));
    }

    chamado = await Chamado.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Status do chamado atualizado!",
        chamado,
      });
    }
);

export const deleteChamado = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const chamado = await Chamado.findById(id);
    if (!chamado) {
        return next(new ErrorHandler("Chamado não encontrado!", 404));
    }

    await Chamado.deleteOne();

    res.status(200).json({
        success: true,
        message: "Chamado deletado!",
    });
});

export const countChamado = catchAsyncErrors(async (req, res, next) => {
    try {
      const count = await Chamado.countDocuments(); // Conta todos os documentos na coleção Chamado
      res.status(200).json({ count });
    } catch (error) {
      next(new ErrorHandler('Erro ao contar chamados', 500)); // Usa ErrorHandler para lidar com erros
    }
  });

  export const getChamadoById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const chamado = await Chamado.findById(id);
    if (!chamado) {
        return next(new ErrorHandler("Chamado não encontrado!", 404));
    }

    res.status(200).json({
        success: true,
        chamado,
    });
});

  