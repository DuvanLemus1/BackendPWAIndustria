import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

const Doctor = sequelize.define('doctores', {
  idDoctor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombreDoctor: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  correoElectronico: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique:true
  },
  contrasena: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(200),
  },
  confirmado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
  },{
    tablename:'doctores'
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