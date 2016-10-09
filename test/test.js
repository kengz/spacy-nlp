const Promise = require('bluebird')
const chai = require('chai')
const should = chai.should()
const spacyNLP = require('../index')

describe('start poly-socketio', () => {
  spacyNLP.server()

  it('resolve global.ioPromise when all joined', () => {
    globalClient = spacyNLP.nlp
    return global.ioPromise
  })
})
