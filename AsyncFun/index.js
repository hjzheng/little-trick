function getData() {
  return fetch('http://127.0.0.1:9527')
}


function run(func) {
  let cache = []
  let i = 0
  const _origin_fetch = window.fetch
  
  window.fetch = (...args) => {
    if (cache[i]) {
      if (cache[i].status === 'fulfilled') {
        return cache[i].data
      } else if (cache[i].status === 'rejected') {
        return cache[i].err
      }
    }

    const result = {
      status: 'pending',
      data: null,
      err: null
    }

    cache[i++] = result

    // 发送请求
    let prom = _origin_fetch(...args)
      .then(resp => resp.json())
      .then(resp => {
        result.status = 'fulfilled'
        result.data = resp
      }, err => {
        result.status = 'rejected'
        result.err = err
      })

    // 报错
    throw prom
  }

  try {
    func()
  } catch (err) {
    if (err instanceof Promise) {
      const reRun = () => {
        i = 0
        func()
      }
      err.then(reRun, reRun)
    }
  }
}

let data = run(getData)

console.log(data)