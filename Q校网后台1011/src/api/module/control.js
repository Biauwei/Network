import Axios from "axios";

// 设置开关时间
export function deviceOnAndOff(params) {
  return Axios.post('/action/mod-xiaojiao/device/deviceOnAndOff.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
