const zmq = require('zeromq')
let sock = zmq.socket('sub')
const outsock = zmq.socket('pub')

const BITCOIN_CONFIG = {
  rpc: {
    protocol: 'http',
    user: 'root',
    pass: 'bitcoin',
    host: '127.0.0.1',
    port: 8332,
    limit: 15
  },
  zmq: {
    host: '127.0.0.1',
    port: 28332
  }
}
const PLANA_CONFIG = {
  zmq: {
    host: '0.0.0.0',
    port: 28339,
  }
}

exports.listen = () => {
  sock.connect('tcp://' + BITCOIN_CONFIG.zmq.host + ':' + BITCOIN_CONFIG.zmq.port)
  sock.subscribe('hashtx')
  sock.subscribe('hashblock')
  console.log('Subscriber connected to port ' + BITCOIN_CONFIG.zmq.port)
  
  console.log("BindSync ", "tcp://*:" + PLANA_CONFIG.zmq.port)
  outsock.bindSync('tcp://*:' + PLANA_CONFIG.zmq.port)
  console.log('Started publishing to tcp://*:' + PLANA_CONFIG.zmq.port)
  
  // Listen to ZMQ
  sock.on('message', async function(topic, message) {
    console.log('zmq message', topic, message)
    if (topic.toString() === 'hashtx') {
      let hash = message.toString('hex')
      console.log('New tx hash from ZMQ = ', hash)
    } else if (topic.toString() === 'hashblock') {
      let hash = message.toString('hex')
      console.log('New block hash from ZMQ = ', hash)
    }
  })
}