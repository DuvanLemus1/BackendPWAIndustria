
import sequelize from '../config/db.js';
import { DataTypes, Sequelize } from 'sequelize';

import Paciente from './modelPaciente.js'; 

const Cita = sequelize.define('citas', {
    idCita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      trim: true,
      allowNull: false
    },
    fechaCita: {
        type: DataTypes.DATEONLY,
        defaultValue:Sequelize.fn('now'),
        allowNull: false
    },
    horaCita: {
      type: DataTypes.TIME,
      defaultValue: new Date(0,0,0,0,0,0),
      allowNull: false,
    },
    estadoCita: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    idPaciente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Paciente,
            key:'idPaciente'
        }
    }
    },{
      tablename:'citas'
    },
    {
      timestamps: false,
      freezeTableName: true
    },
    );

    Cita.belongsTo(Paciente ,{foreignKey: 'idPaciente'});

export default Cita;