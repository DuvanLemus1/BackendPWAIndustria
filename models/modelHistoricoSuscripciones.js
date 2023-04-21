import sequelize from '../config/db.js';
import { DataTypes, Sequelize } from 'sequelize';

import Doctor from './modelDoctor.js'; 

const HistoricoSuscripcion = sequelize.define('historicoSuscripciones', {
    idSuscripcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      idDoctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Doctor,
            key:'idDoctor'
        }
    }
    },{
      tablename:'historicoSuscripciones'
    },
    {
      timestamps: false,
      freezeTableName: true
    },
    );

    HistoricoSuscripcion.belongsTo(Doctor ,{foreignKey: 'idDoctor'});
    Doctor.hasMany(HistoricoSuscripcion, {foreignKey: 'idDoctor'} )
export default HistoricoSuscripcion;