require('dotenv').config();

module.exports = {
  development: {
    dialect: process.env.DIALECT,
    host: process.env.PG_HOST,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    define: {
      timestamps: true,
      underscored: true,
    },
    ssl: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  secret: process.env.SECRET_KEY,
};
