import mongoose from "mongoose";
import validator from "validator";

const chamadoSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:[true, "Nome é necessário!"],
        minlength: [3, "Primeiro nome deve conter ao menos 3 caracteres!"],
    },
    lastName: {
        type: String,
        required: [true, "Último nome é necessário!"],
        minlength: [3, "Último nome deve conter ao menos 3 caracteres!"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "E-mail é necessário!"],       
    },
    phone: {
        type: String,
        required: [true, "Celular é necessário!"],
        minlength: [11, "Insira um número de telefone de 11 dígitos"],
        maxlength: [11, "Limite de 11 números"],
    },
    sector: {
        type: String,
        required: [true, "Setor é necessário!"],
        minlength: [3, "Nome do setor deve conter ao menos 3 caracteres!"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tecnico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Referência ao modelo User
    },
    status: {
        type: String,
        enum: ["Pendente", "Aberto", "Encerrado"],
        default: "Aberto",
    },
    title: {
        type: String,
        required: [true, "Título é necessário!"],
        minlength: [3, "Título deve conter ao menos 3 caracteres!"],
    },
    description: {
        type: String,
        required: [true, "Descrição é necessário!"],
        minlength: [10, "Descrição deve conter ao menos 10 caracteres!"],
    },
    chamado_date: {
        type: Date,
        default: Date.now,
    },
});

export const Chamado = mongoose.model("Chamado", chamadoSchema);
