function toChineseNumber(num) {
  let tmp = num.toString().replace(/(?=(\d{4})+$)/g, ",")
  let strs = tmp.split(',')

  let char = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let unit = ['', '十', '百', '千']
  let bigUnit = ['', '万', '亿']
  
  let _translate = (str) =>  {
    let result = ''
    
    str.split('').forEach((i, index) => { 
      if (i === '0') { // 有零不加单位
        if(result.at(-1) !== char[0]) { // 前面的数字不是零的情况，才加零，保证只加一个零
          result += char[i]
        }
      } else {
        result += (char[i] + unit[str.length - index - 1])
      }
    })

    // 末尾为零的情况
    if (result.at(-1) === char[0]) {
      result = result.slice(0, -1)
    }

    return result
  }

  let res = ''
  
  strs.forEach((i, index) => {
      let c = _translate(i)
      // c 不存在，不加单位
      res += c ? c + bigUnit[strs.length - index -1] : ''
  })
  
  return res
}

test(1000022)