/**
 * MIT License
 * 
 * Copyright (c) 2019 Muhammad Muzzammil
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const express = require('express')
const pagehash = require("./pagehash")
const app = express()

console.log("Running in", app.get('env'), "mode")

let json = o => JSON.stringify(o, undefined, 2)

const PORT = process.env.PORT || 7800

app.get('/favicon.ico', (_req, res) => {
  res.sendFile(__dirname + "/site/resources/favicon.ico")
})

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