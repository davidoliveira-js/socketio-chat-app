class HomeController {
  async index(req, res) {
    return res.json({
      success: true,
      result: 'Chat app',
    });
  }
  async validate(req, res) {
    res.send('ok');
  }
}

module.exports = new HomeController();
