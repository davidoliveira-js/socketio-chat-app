const jwt = require('jsonwebtoken');
const env = require('../config/process');
const cookie = require('cookie');
const UserData = require('../models/User');

async function UserAuth(req, res, next) {
  try {
    const id = req.params.id;
    const cks = req.headers;
    let cookies = undefined;

    try {
      cookies = await cookie.parse(cks.cookie);
    } catch (error) {
      cookies = await cookie.parse(cks['set-cookie'][0]);
    }

    const accessToken = cookies['Access-Token'];

    if (accessToken) {
      try {
        const info = await jwt.verify(accessToken, env.secret);
        if (info.id == id) {
          next();
          return;
        } else {
          res.clearCookie('Access-Token');
          return res.status(302).json({
            success: false,
            result: 'This user is not authorized',
          });
        }
      } catch (error) {
        res.clearCookie('Access-Token');
        return res.status(302).json({
          success: false,
          result: 'This user is not authorized',
        });
      }
    } else {
      res.clearCookie('Access-Token');
      return res.status(302).json({
        success: false,
        result: 'This user is not authorized',
      });
    }
  } catch (error) {
    res.clearCookie('Access-Token');
    return res.status(302).json({
      success: false,
      result: 'This user is not authorized',
    });
  }
}

module.exports = UserAuth;
