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

  $('[link]').click(() => window.open($(this).attr('link')))

  let button = $('input[type="submit"]')

  button.click(() => {
    if (button.attr('value') != 'Hash it!') {
      return
    }
    if ($('#url').val() == '') {
      return
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
        $('#json').append(`<pre>curl "${window.location.href}?url=${$("#url").val()}"\n${json}</pre>`)
        reset()
      }
    })
  })
})
