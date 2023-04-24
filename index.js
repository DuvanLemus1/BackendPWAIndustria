
import express  from "express";
import sequelize from "./config/db.js";

//Importar routers
import routerDoctores from "./routes/routerDoctor.js";
import routerPacientes from "./routes/routerPaciente.js";
import routerProveedores from "./routes/routerProveedor.js";
import routerCitas from "./routes/routerCitas.js";
import routerMedicamentos from "./routes/routerMedicamentos.js";

import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
app.use(express.json());
dotenv.config();

//Probar la conexion a la BD --------------------------------
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(error => {
    console.error('Error al conectar a la base de datos:', error);
  });
//------------------------------------------------------------


//Configurar CORS

const whitelist=["http://54.167.89.3"];
const whitelist2=["http://ec2-54-167-89-3.compute-1.amazonaws.com"]

const corsOptions={
  origin: function(origin, callback){
    if(whitelist.includes(origin) || whitelist2.includes(origin)){
      //Consulta la API
      callback(null,true);
  }else{
      //No permitido
      callback(new Error("Error de CORS"))
  }
  }
};
app.use(cors(corsOptions));


//Administrar Routing-----------------------------------------
app.use("/api/doctores", routerDoctores);
app.use("/api/pacientes", routerPacientes);
app.use("/api/proveedores", routerProveedores);
app.use("/api/citas", routerCitas);
app.use("/api/medicamentos", routerMedicamentos)


const PORT= process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Corriendo en el puerto ${PORT}`);
});


