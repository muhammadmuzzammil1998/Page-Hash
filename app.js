const express = require('express')
const pagehash = require("./pagehash")
const app = express()

console.log("Running in", app.get('env'), "mode")

let json = o => JSON.stringify(o, undefined, 2)

const PORT = 7800

app.get('/', (req, res) => {
  url = req.query.url
  web = typeof req.query.web !== 'undefined'
  body = req.query.body || false
  if (typeof url === 'undefined' || url == '') {
    app.use(express.static('site/resources'))
    res.sendFile(__dirname + '/site/index.html')
    return
  }
  res.set('Content-Type', 'application/json')
  starttime = +new Date()
  pagehash(url)
    .then(result => {
      res.send(json({
        load: +new Date() - starttime,
        ...result,
      }))
      console.log("Crawled page", url, "at", +new Date(), (web ? "from website" : ""))
    }, err => {
      res.send(json(err))
      console.log("Error occured for page", url, "\nDump:\n Timestamp:", +new Date(), "\n Queries:", req.query, "\n Error:", err)
    })
})

app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`))
