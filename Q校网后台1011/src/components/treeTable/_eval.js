import Vue from 'vue';

export default function treeToArray(data, children = 'children') {
  let tmp = [];
  data.forEach((item, index) => {
    Vue.set(item, '_index', index);
    tmp.push(item);
    if (item[children] && item[children].length > 0) {
      const res = treeToArray(item[children], children);
      tmp = tmp.concat(res);
    }
  });
  return tmp;
}
