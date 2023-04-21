import sequelize from '../config/db.js';
import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

const Doctor = sequelize.define('Doctores', {
  idDoctor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombreDoctor: {
    type: DataTypes.STRING(200),
    allowNull: false,
    trim: true
  },
  segundoNombreDoctor: {
    type: DataTypes.STRING(200),
    trim: true
  },
  apellidoDoctor: {
    type: DataTypes.STRING(200),
    trim: true,
    allowNull: false,
  },
  segundoApellidoDoctor: {
    type: DataTypes.STRING(200),
    trim: true
  },
  rol: {
    type: DataTypes.STRING(200),
    defaultValue:'usuario'
  },
  correoElectronico: {
    type: DataTypes.STRING(200),
    allowNull: false,
    trim: true,
    unique:true
  },
  contrasena: {
    type: DataTypes.STRING(200),
    trim: true,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    trim: true,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(200),
  },
  confirmado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tipoSuscripcion:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  fechaInicioSuscripcion: {
    type: DataTypes.DATEONLY,
    defaultValue:Sequelize.fn('now'),
    allowNull: false
  },
  fechaFinSuscripcion: {
    type: DataTypes.DATEONLY,
    defaultValue:Sequelize.fn('now'),
    allowNull: false
  },
  costoSuscripcion: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  tipoNuevaSuscripcion:{
    type:DataTypes.INTEGER,
  },
  fechaInicioNuevaSuscripcion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fechaFinNuevaSuscripcion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  costoNuevaSuscripcion: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  renovacionAutomatica: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false
  },

  },{
    tablename:'Doctores'
  },
  {
    timestamps: false,
    freezeTableName: true
  },
  );

  //Hasheo de passwords --Verificar luego con el reseteo de contras
  Doctor.beforeCreate(async (doctor, options) => {
    if(!doctor.changed('contrasena')){
      return ;
    }
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(doctor.contrasena, saltRounds);
    doctor.contrasena = hashedPassword;
  });

  Doctor.beforeUpdate(async (doctor, options) => {
    if (!doctor.changed('contrasena')) {
      return;
    }
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(doctor.contrasena, saltRounds);
    doctor.contrasena = hashedPassword;
  });


  Doctor.prototype.comprobarContrasena = async function(contrasenaFormulario) {
  return await bcrypt.compare(contrasenaFormulario, this.contrasena);}

export default Doctor;