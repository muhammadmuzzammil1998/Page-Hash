const request = require('request')
const crypto = require('crypto')

let hash = (data, algo) => crypto.createHash(algo).update(data).digest("hex")

/**
 * Generates hashes of a resource from given URL.
 * 
 * Hashes generated:
 *  - SHA256
 *  - SHA1
 *  - MD5
 * 
 * Example:
 * 
 *      pagehash("https://domain.tld/file.pdf").then(result => {
 *        console.log("Result\n", result)
 *      }, error => {
 *        console.log("Error\n", error)
 *      })
 * 
 * @param url
 * URL of the resource (LIMIT: 10MB). Example: https://domain.tld/file.pdf
 * 
 * @returns
 * A promise with hashes and error details as 
 * objects when resolves or gets rejected respectively.
 * 
 * Full documentation: https://github.com/muhammadmuzzammil1998/Page-Hash#documentation
 */
module.exports = async url => {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: "HEAD"
    }, (_error, res, _body) => {
      if (typeof res === "undefined") {
        return
      }
      if (res.headers['content-length'] != undefined && res.headers['content-length'] > 10000000) {
        reject({
          url: url,
          hashes: null,
          code: "MAX_LIMIT_EXCEEDED",
        })
      }
    })
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
