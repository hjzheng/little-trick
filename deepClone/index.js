const deepClone1 = (obj) => JSON.parse(JSON.stringify(obj))

let obj = { a:1, b:2 }
obj['c'] = obj

// 无法处理循环依赖
// deepClone1(obj)

const deepClone2 = (obj) => {

  const objectMap = new Map()

  function _deepClone(value) {
    let type = typeof value

    if (type !== 'object' || type === null) {
      return value
    }

    if (objectMap.has(value)) {
      return objectMap.get(value)
    }

    const result = Array.isArray(value) ? [] : {}
    objectMap.set(value, result)

    for (let key in value) {
      result[key] = _deepClone(value[key])
    }

    return result
  }
  
  return _deepClone(obj)
}


const deepClone3 = (obj) => {
  return new Promise((reslove, reject) => {
    const { port1, port2 } = new MessageChannel()
    port2.postMessage(obj)
    port1.onmessage = function (e) {
      reslove(e.data)
    }
  })
}

console.log(deepClone2(obj))

deepClone3(obj).then((data) => console.log(data))