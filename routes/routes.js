const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const Model = require("../models/model")

//Middleware to get the data by id
const getData = async (req, res, next) => {
  try {
    const data = await Model.findOne({ username: req.body.username })
    if (data === null) {
      res.status(404).json("Error: user Not Found")
    } else {
      res.data = data
      next()
    }
  } catch (err) {
    res.status(500).json({ Message: err.message })
  }
}

router.get("/login", getData, async (req, res) => {
  const { password } = req.body
  const isPasswordCorrect = await bcrypt.compare(password, res.data.password)
  if (isPasswordCorrect === true) {
    res.status(200).json("Login Successful")
  } else {
    res.status(400).json("Error: Incorrect Password")
  }
})

router.post("/register", async (req, res) => {
  const { username, password, email, country } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const data = new Model({
    username,
    password: hashedPassword,
    email,
    country,
  })

  const checkUser = await Model.findOne({ username })
  if (checkUser !== null) {
    res.status(400).json("Error: User Already Exists")
  } else {
    if (password.length < 5) {
      res.status(400).json("Error: Password must be at least 5 characters")
    } else {
      try {
        const newData = await data.save()
        res.status(201).json("Registration Successful")
      } catch (err) {
        res.status(400).json({ Message: err.message })
      }
    }
  }
})

module.exports = router
