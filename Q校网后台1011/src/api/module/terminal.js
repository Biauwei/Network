import ax from '../axios';

//接收控制指令
export function action(params) {
  return ax.post('/action/mod-xiaojiao/terminal/action.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//蓝牙信息接收
export function bluetooth(params) {
  return ax.post('/action/mod-xiaojiao/terminal/bluetooth.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//屏端定时取得服务器命令
export function client(params) {
  return ax.post('/action/mod-xiaojiao/terminal/client.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//得到终端播放频道内容
export function content(params) {
  return ax.post('/action/mod-xiaojiao/terminal/content.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//接收终端截屏
export function snapshot(params) {
  return ax.post('/action/mod-xiaojiao/terminal/snapshot.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//获取最后时刻的截图
export function snapshot_last(params) {
  return ax.post('/action/mod-xiaojiao/terminal/snapshot_last.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//打卡上传
export function punchCard(params) {
  return ax.post('/action/mod-xiaojiao/terminal/punchCard.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
