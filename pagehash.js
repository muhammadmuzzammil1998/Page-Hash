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
  // Test if URL contains http, add if not.
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    url = "http://" + url;
  }

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