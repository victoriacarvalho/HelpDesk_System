import mongoose from "mongoose"

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "HELPDESK_SYSTEM"
    }).then(()=>{
        console.log("Conectado ao banco de dados do HELPDESK ")
    }).catch(err=>{
        console.log(`Ocorreu erro durante a conexão com o banco de dados ${err}`);
    });
};