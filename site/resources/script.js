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
$(document).ready(() => {
  let getHighlightedJSON = json => {
    return json.replace(/("([a-zA-Z0-9]|[^"])*":?|\d+(?:\.\d*)?(?:\d+)?)/g, match => {
      let css = 'number'
      if (/^"/.test(match)) {
        css = /:$/.test(match) ? 'key' : 'string'
      }
      return `<span class="${css}">${match}</span>`
    })
  }

  $('form').submit(e => e.preventDefault())

  $('[link]').click(function () {
    window.open($(this).attr('link'))
  })

  let button = $('input[type="submit"]')

  button.click(() => {
    if (button.attr('value') != 'Hash it!') {
      return
    }
    if ($('#url').val() == '') {
      return
    }
    if (!/^(f|ht)tps?:\/\//i.test($('#url').val())) {
      $('#url').val("http://" + $('#url').val());
    }
    button.attr('value', 'Hashing...')
    button.addClass('hashing')
    $.ajax({
      type: 'GET',
      data: $('#form').serialize(),
      success: result => {
        let reset = () => {
          button.attr('value', 'Hash it!')
          button.removeClass('hashing')
        }
        if (result.hashes == null) {
          alert('Error occured. Error code: ' + result.code)
          reset()
          return
        }
        $('#hashes').remove()
        $('#json pre').remove()
        let hashes = result.hashes
        $('#form-wrapper').append('<div id="hashes">')
        hashes.forEach(hash => {
          let el = `<div class="hash-wrapper" ph-algo="${hash.algo.padEnd(6, '-')}"><span class="hash">${hash.hash}</span></div>`
          $('#hashes').append(el)
        })
        json = getHighlightedJSON(JSON.stringify(result, undefined, 2))
        $('#json').append(`<pre><span class="cmd">curl</span> "${window.location.href}?url=${$("#url").val()}"\n${json}</pre>`)
        reset()
      }
    })
  })
})