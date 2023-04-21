
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

import Doctor from './modelDoctor.js'

const Paciente = sequelize.define('Pacientes', {
    idPaciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DNI: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
    nombrePaciente: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    telefonoPaciente: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    correoElectronicoPaciente: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique:true
    },
    direccionPaciente: {
      type: DataTypes.STRING(255),
      allowNull: false,
      
    },
    idDoctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Doctor,
            key:'idDoctor'
        }
    }
    },{
      tablename:'Pacientes'
    },
    {
      timestamps: false,
      freezeTableName: true
    },
    );

    Paciente.belongsTo(Doctor ,{foreignKey: 'idDoctor'});

export default Paciente;