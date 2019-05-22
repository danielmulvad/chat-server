const Data = require('./data')

class User {
  getAllUsers (req, res) {
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err })
      return res.json({ success: true, data: data })
    })
  }

  getUser (req, res) {
    console.log(req.params.user)
    Data.find((err, data) => {
      if (err) return res.json({ success: false, error: err })
      return res.json({ success: true, data: data })
    })
  }

  register (req, res) {
    let data = new Data()
    console.log(req.body)
    const { username, password } = req.body

    if ((!username && username !== 0) || !password) {
      return res.json({
        success: false,
        error: 'INVALID INPUTS'
      })
    }

    data.username = username
    data.password = password

    data.save(err => {
      if (err) return res.json({ success: false, error: err })
      return res.json({ success: true })
    })
  }
}

module.exports = User
