
const subjectsEle = document.querySelector('.subjects')
subjectsEle.dataset.effectAllowed = 'move'

const subjects = subjectsEle.querySelectorAll('.subject')

subjects.forEach(sub => {
    sub.setAttribute('draggable', true)
    sub.dataset.effectAllowed = 'copy'
})

const tableEle = document.querySelector('.course')
const tds = tableEle.querySelectorAll('td')

tds.forEach(td => {
    td.dataset.effectAllowed = 'copy'
})

function clearDropZoneClass() {
    tds.forEach(td => {
        td.classList.remove('dropZone')
    })
    subjectsEle.classList.remove('dropZone')
}

function findDropZoneNode(node) {
    while (node) {
        if (node.dataset && node.dataset.effectAllowed) {
            return node
        }
        node = node.parentNode
    }
}


const container = document.querySelector('.container')

let source = null
// 利用事件委托监听最上层元素
container.addEventListener("dragstart", (event) => {
    // console.log('start', event.target)
    // event.dataTransfer.effectAllowed = "copy";
    source = event.target
    event.dataTransfer.effectAllowed = event.target.dataset.effectAllowed
});

container.addEventListener("dragover", (event) => {
    event.preventDefault()
    // console.log('over', event.target)
});

container.addEventListener("dragenter", (event) => {
    // console.log('enter', event.target)
    clearDropZoneClass()
    
    const dropZoneNode = findDropZoneNode(event.target)

    if (!dropZoneNode) {
        return
    }
    
    if (dropZoneNode?.dataset?.effectAllowed === source.dataset.effectAllowed) {
        // 修改样式
        dropZoneNode.classList.add('dropZone')
    }
});

container.addEventListener("drop", (event) => {
    // console.log('drop', event.target)
    clearDropZoneClass()
    const dropZoneNode = event.target
    
    if (source.dataset.effectAllowed !== dropZoneNode.dataset.effectAllowed) {
        return
    }
    // copy
    if (source.dataset.effectAllowed === 'copy') {
        const cloneNode = source.cloneNode(true)
        cloneNode.dataset.effectAllowed = 'move'
        dropZoneNode.innerHTML = ''
        dropZoneNode.appendChild(cloneNode)
    } else {
        source.remove()
    }

    // move
});