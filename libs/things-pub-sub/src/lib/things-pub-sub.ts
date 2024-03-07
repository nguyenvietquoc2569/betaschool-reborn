import { io } from 'socket.io-client'
import md5 from 'md5'
import { ESIEvent, ESIMessageType } from './socket-type'

let socket = null
let messageDirectCallBackQueue = []
let channelCbHash = {}

export function siInitConnection (host, id) {
  if (!socket) {
    socket = io(host, {
      reconnectionDelayMax: 5000,
      path: '/things',
      query: {
        id,
        secret: md5(id + 'beta')
      }
    })
    socket.on('connect', () => {
      console.log('connected to : ', host, ' id: ', id)
    });
    socket.on('message', function (data) {
      if (data.type === ESIMessageType.DIRECT) {
        for (const cb of messageDirectCallBackQueue) {
          cb(data)
        }
      } else if (data.type === ESIMessageType.VIACHANNEL) {
        const channel = data.toChannel
        if (channelCbHash[channel]) {
          for (const cb of channelCbHash[channel]) {
            cb(data)
          }
        }
      }
    })
  }
}

export function siDisconnectAndDeleteTheCB () {
  if (socket) {
    socket.disconnect()
    console.log('disconnected socket IO with purpose')
  }
  socket = null
  messageDirectCallBackQueue = []
  channelCbHash = {}
}

// Khi connect bi dut thi subcrible khong hoat dong laij
export function siSubscribleChannel(channel, cb, config:{host?: string, id?: string}={}) {
  if (!socket) {
    if (config.host && config.id) {
      siInitConnection(config.host, config.id)
    } else {
      throw new Error('socket is null for now, please use siInitConnection to connect')
    }
    // siInitConnection(config.host, config.id)
    // throw new Error('socket is null for now, please use siInitConnection to connect')
  }
  if (!channelCbHash[channel]) {
    channelCbHash[channel] = []
    socket.emit(ESIEvent.subscribe, {
      channel: channel,
      enable: true
    })
  }
  if (!channelCbHash[channel].includes(cb)) {
    channelCbHash[channel].push(cb)
  }
}

export function siSubscribleDirectMessage(cb, config:{host?: string, id?: string}={}) {
  if (!socket) {
    if (config.host && config.id) {
      siInitConnection(config.host, config.id)
    } else {
      throw new Error('socket is null for now, please use siInitConnection to connect')
    }
    // siInitConnection(config.host, config.id)
    // throw new Error('socket is null for now, please use siInitConnection to connect')
  }
  if (!messageDirectCallBackQueue.includes(cb))
  { 
    messageDirectCallBackQueue.push(cb)
  }
}

export function siSendDirectMesage(id, data) {
  if (!socket) {
    throw new Error('socket is null for now, please use siInitConnection to connect')
  }
  socket.emit(ESIEvent.message,{
    toId: id,
    data: data
  })
}

export function siSendToChannel(channel, data) {
  if (!socket) {
    throw new Error('socket is null for now, please use siInitConnection to connect')
  }
  socket.emit(ESIEvent.message,{
    toChannel: channel,
    data: data
  })
}
