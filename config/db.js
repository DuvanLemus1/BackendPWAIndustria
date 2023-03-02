import Sequelize from 'sequelize';
const sequelize = new Sequelize('sistemaadministrador', 'root', 'admin123', {
  host: 'localhost',
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