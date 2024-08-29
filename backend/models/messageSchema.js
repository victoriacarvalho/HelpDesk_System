import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, "Primeiro nome deve conter ao menos 3 caracteres!"]
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, "Último nome deve conter ao menos 3 caracteres!"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Adicione um email válido!"]
    },
    phone: {
        type: String,
        required: true,
        minlength: [11, "Insira um número de telefone de 11 dígitos"],
        maxlength: [11, "Limite de 11 números"],
    },
    message: {
        type: String,
        required: true,
        minlength: [10, "A mensagem deve conter ao menos 10 caracteres!"],
    },
});

export const Message = mongoose.model("Message", messageSchema);
