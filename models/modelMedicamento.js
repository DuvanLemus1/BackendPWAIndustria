
import sequelize from '../config/db.js';
import { DataTypes, Sequelize } from 'sequelize';

import Proveedor from './modelProveedor.js'; 

const Medicamento = sequelize.define('Medicamentos', {
    idMedicamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serialMedicamento: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    nombreMedicamento: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    cantidadMedicamento: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
    idProveedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:Proveedor,
            key:'idProveedor'
        }
    }
    },{
      tablename:'Medicamentos'
    },
    {
      timestamps: false,
      freezeTableName: true
    },
    );

    Medicamento.belongsTo(Proveedor ,{foreignKey: 'idProveedor'});

export default Medicamento;