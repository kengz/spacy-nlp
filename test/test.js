const Promise = require('bluebird')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const should = chai.should()
const spacyNLP = require('../index')

describe('start poly-socketio', () => {
  spacyNLP.server().then(() => {
    global.ioPromise.should.be.fulfilled
  })

  it('resolve global.ioPromise when all joined', () => {
    var globalClient = spacyNLP.nlp
    return global.ioPromise
  })
})
