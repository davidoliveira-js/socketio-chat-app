const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookie = require('cookie');
const env = require('../config/process');

module.exports = {
  async index(req, res) {
    try {
      const users = await User.findAll({ attributes: ['username'] });
      if (users) {
        return res.json({
          success: true,
          result: users,
        });
      } else {
        return res.json({
          success: true,
          result: [],
        });
      }
    } catch (error) {
      res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['username'],
      });
      if (user) {
        return res.json({
          success: true,
          result: user,
        });
      } else {
        return res.json({
          success: true,
          result: [],
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },

  async create(req, res) {
    try {
      const { username, password, role } = req.body;
      if (
        !username ||
        !password ||
        username == undefined ||
        password == undefined ||
        username == '' ||
        password == ''
      ) {
        return res.json({
          success: false,
          result: 'Fill in all fields',
        });
      }
      const usernameValidation = await User.findOne({
        where: {
          username: username,
        },
      });
      if (!usernameValidation) {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          password: hash,
          role,
        });
        return res.json({
          success: true,
          result: 'User created',
        });
      } else {
        return res.json({
          success: false,
          result: 'This username already exists',
        });
      }
    } catch (error) {
      res.status(500);
      return res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },

  async edit(req, res) {
    try {
      const { id } = req.params;
      const { username } = req.body;
      if (!username || username == undefined || username == '') {
        return res.json({
          success: false,
          result: 'Fill in all fields',
        });
      }
      const idValidation = await User.findByPk(id);
      if (idValidation) {
        const usernameValidation = await User.findOne({
          where: {
            username: username,
          },
        });
        if (!usernameValidation) {
          const user = await User.update(
            { username: username },
            {
              where: {
                id: id,
              },
            }
          );
          return res.json({
            success: true,
            result: 'User edited',
          });
        } else {
          return res.json({
            success: false,
            result: 'This username already exists',
          });
        }
      } else {
        return res.json({
          success: false,
          result: 'This user does not exists',
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.destroy({
        where: {
          id: id,
        },
      });
      if (user) {
        res.clearCookie('Access-Token');
        return res.json({
          success: true,
          result: 'User deleted',
        });
      } else {
        return res.json({
          success: true,
          result: 'User does not exists',
        });
      }
    } catch (error) {
      return res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;
    if (
      !username ||
      !password ||
      username == undefined ||
      password == undefined ||
      username == '' ||
      username == ''
    ) {
      return res.json({
        success: false,
        result: 'Fill in all fields',
      });
    }
    try {
      const user = await User.findOne({
        where: {
          username: username,
        },
      });
      if (user) {
        const passwordValidation = await bcrypt.compare(
          password,
          user.password
        );
        if (passwordValidation) {
          try {
            const accsessToken = await jwt.sign(
              {
                id: user.id,
                username: user.username,
                role: user.role,
              },
              env.secret,
              { expiresIn: '5h' }
            );
            res.setHeader('Set-Cookie', [
              cookie.serialize('Access-Token', accsessToken, {
                httpOnly: true,
                maxAge: 60 * 59 * 3,
              }),
            ]);
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.json({
              success: true,
              result: {
                username: user.username,
                id: user.id,
                accessToken: accsessToken,
              },
            });
            res.end();
            return;
          } catch (error) {
            console.log(error);
            return res.status(500).json({
              success: false,
              result: 'Something wen wrong',
            });
          }
        } else {
          return res.json({
            success: false,
            result: 'Wrong username or password',
          });
        }
      } else {
        return res.json({
          success: false,
          result: 'Wrong username or password',
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },

  async logout(req, res) {
    try {
      res.clearCookie('Access-Token');
      return res.json({
        success: true,
        result: 'User logout',
      });
    } catch (error) {
      res.json({
        success: false,
        result: 'Something went wrong',
      });
    }
  },
};
