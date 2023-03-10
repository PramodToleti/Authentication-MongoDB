require("dotenv").config()

const { urlencoded } = require("express")
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const router = require("./routes/routes")

const app = express()
const port = process.env.PORT || 8000
const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongdoDB")
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.log(`Error: ${err}`)
  })

app.use(express.json())
app.use(morgan("dev"))
app.use(express(urlencoded({ extended: false })))
app.use("/api/", router)
