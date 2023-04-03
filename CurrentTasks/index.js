function timeout(time) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(true)
    }, time)
  })
} 

class SupperTask {
  constructor(size) {
    this.size = size || 2
    this.queue = []
    this.runningCount = 0
  }

  add(fn) {
    return new Promise((reslove, reject) => {
      this.queue.push({fn, reslove, reject})
      this._run()
    })
  }

  _run() {
    while (this.runningCount < this.size && this.queue.length) {
      const {fn, reslove, reject} = this.queue.shift()
      
      this.runningCount++

      fn().then(reslove, reject).finally(() => {
        this.runningCount--
        this._run()
      })
    }
  }
}

const supperTask = new SupperTask();

function addTask(time, name) {
  supperTask
  .add(() => timeout(time))
  .then(() => {
    console.log(`${time}ms后,任务${name}完成`)
  })
}

addTask(10000, 1)
addTask(5000, 2)
addTask(3000, 3)
addTask(4000, 4)
addTask(5000, 5)