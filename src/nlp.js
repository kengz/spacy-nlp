// assuming server is started and ready
const polyIO = require('poly-socketio')
/* istanbul ignore next */
process.env.IOPORT = process.env.IOPORT || 6466

// call the python spacy nlp parser via socketIO
// output: [{text, len, tokens, noun_phrases, parse_tree, parse_list}]
/* istanbul ignore next */
function parse(text) {
  polyIO.client({ port: process.env.IOPORT })
  var msg = {
    input: text,
    to: 'nlp.cgkb-py',
    intent: 'parse'
  }
  return global.client.pass(msg)
    .then((reply) => {
      return reply.output
    })
}

// parse('Bob Brought the pizza to Alice.')
//   .then((output) => {
//     console.log(output)
//     console.log(JSON.stringify(output[0].parse_tree, null, 2))
//       // console.log(JSON.stringify(output[0].parse_list, null, 2))
//   })

module.exports = {
  parse: parse
}
