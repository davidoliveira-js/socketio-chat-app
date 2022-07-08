const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Fill in all fields',
            },
            len: {
              args: [1, 20],
              msg: 'Invalid username',
            },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'Fill in all fields',
            },
            len: {
              args: [1, 64],
              msg: 'Invalid password',
            },
          },
        },
        role: DataTypes.INTEGER,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: 'User',
      }
    );
  }
}

module.exports = User;
