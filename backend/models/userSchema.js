import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    sector: {
        type: String,
        required: true,
        minlength: [3, "Nome do setor deve conter ao menos 3 caracteres!"],
    },
    password:{
        type: String,
        minlength: [8, "A senha deve conter ao menos 10 dígitos"],
        required: true,
        select: false,
    },
    registration:{
        type: String,
        minlength: [7, "A matrícula deve conter ao 7 dígitos"],
        maxlength: [7, "A matrícula deve conter ao 7 dígitos"],
    },

    role: {
        type: String,
        required: [true, "Tipo de acesso necessário!"],
        enum: ["Administrador", "Tecnico", "Padrao"],
      },

    tecAvatar: {
        public_id: String,
        url: String,
    },
});


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,8);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};

userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY,{
       expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);

