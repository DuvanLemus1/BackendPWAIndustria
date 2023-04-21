import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

import Doctor from './modelDoctor.js'

const ProveedorMedicamento = sequelize.define('ProveedoresMedicamentos', {
    idProveedor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreProveedor: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    telefonoProveedor: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    direccionProveedor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    correoElectronicoProveedor: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique:true
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
      tablename:'ProveedoresMedicamentos'
    },
    {
      timestamps: false,
      freezeTableName: true
    },
    );

    ProveedorMedicamento.belongsTo(Doctor ,{foreignKey: 'idDoctor'});

export default ProveedorMedicamento;