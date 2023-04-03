let i = 0 

function createId(channelName) {
  let key = `${channelName}-maxId`
  let channelId = localStorage.getItem(key)

  if (channelId) {
    channelId = +channelId + 1
  } else {
    channelId = i + 1
  }

  localStorage.setItem(key, channelId)

  return channelId
}


function createChannel(channelName) {
  const channel = new BroadcastChannel(channelName)
  
  channel.id = createId(channelName)
  channel.list = new Set()
  
  channel.addEventListener('message', (event) => {
    const { channelId, message } = event.data
    if (message === 'Hi') {
      channel.postMessage({channelId: channel.id, message: 'copy'})
      channel.list.add(channelId)
    } else if (message === 'copy') {
      channel.list.add(channelId)
    } else if (message === 'bye') {
      channel.list.delete(channelId)
    }
  })

  // 初始化的时候
  channel.postMessage({channelId: channel.id, message: 'Hi'})

  window.addEventListener('unload', () => {
    channel.postMessage({channelId: channel.id, message: 'bye'})
  })

  return channel
}