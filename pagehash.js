const request = require('request')
const crypto = require('crypto')

let hash = (data, algo) => crypto.createHash(algo).update(data).digest("hex")

module.exports = async url => {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve({
          url: url,
          hashes: [{
              algo: "sha256",
              hash: hash(body, 'sha256'),
            },
            {
              algo: "sha1",
              hash: hash(body, 'sha1'),
            },
            {
              algo: "md5",
              hash: hash(body, 'md5'),
            },
          ],
        })
        return
      }
      reject({
        url: url,
        hashes: null,
        ...error,
      })
    })
  })
}
