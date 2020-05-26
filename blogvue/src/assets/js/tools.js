/**
 * 时间戳格式化
 * @param {Long} 时间戳
 * @param {String} 格式化, 如: yyyy-MM-dd
 */
function formatTime (timeMillis = '1585734546', pattern = 'yyyy-MM-dd hh:mm:ss') {
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

/**
 * 格式化时间为文字：如10分钟前
 * @param {*} time
 * @param {*} isTimeStamp
 */
const formatDate = (time, isTimeStamp = false)=>{
  let timeString = ''
  if (time) {
    let intervalTime = ''
    if (!isTimeStamp) {
      intervalTime = Math.floor((Date.now() - Date.parse(time)) / 1000)
    } else {
      intervalTime = Math.floor(Date.now() / 1000) - time
    }
    if (intervalTime < 60) {
      timeString = '1分钟前'
    } else if (intervalTime >= 60 && intervalTime < 3600) {
      timeString = Math.floor(intervalTime / 60) + '分钟前'
    } else if (intervalTime >= 3600 && intervalTime < 3600 * 24) {
      timeString = Math.floor(intervalTime / 3600) + '小时前'
    } else if (intervalTime >= 3600 * 24 && intervalTime < 3600 * 24 * 7) {
      timeString = Math.floor(intervalTime / (3600 * 24)) + '天前'
    } else if (intervalTime >= 3600 * 24 * 7 && intervalTime < 3600 * 24 * 30) {
      timeString = Math.floor(intervalTime / (3600 * 24 * 7)) + '周前'
    } else if (intervalTime >= 3600 * 24 * 30 && intervalTime < 3600 * 24 * 365) {
      timeString = Math.floor(intervalTime / (3600 * 24 * 30)) + '个月前'
    } else if (intervalTime >= 3600 * 24 * 365) {
      timeString = Math.floor(intervalTime / (3600 * 24 * 365)) + '年前'
    }
  } else {
    timeString = '缺少时间参数'
  }
  return timeString
}

export {
  formatTime,
  formatDate
}
