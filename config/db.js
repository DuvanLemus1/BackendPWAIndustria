import Sequelize from 'sequelize';
const sequelize = new Sequelize('sistemaAdministrador', 'root', 'admin123', {
  host: 'baseindustria.clo6hkqdcfir.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
  define:{
    timestamps:false
},
pool:{
    max:5,
    min:0,
    acquire:30000,
    idle:10000
},
operatorAliases:false
});

export default sequelize;