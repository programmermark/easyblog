/**
 * 时间戳格式化
 * @param {Long} 时间戳
 * @param {String} 格式化, 如: yyyy-MM-dd
 */
function formatTime (timeMillis, pattern = 'yyyy-MM-dd hh:mm:ss') {
  let dateObj
  if (!isNaN(timeMillis)) {
    dateObj = new Date(Number(timeMillis))
  } else {
    let timeString = timeMillis.replace(/-/g, '/')
    dateObj = new Date(Date.parse(timeString))
  }
  return dformat(dateObj, pattern)
}

function dformat (date, fmt) {
  if (date instanceof Date) {
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  } else {
    return date
  }
}

export {
  formatTime
}