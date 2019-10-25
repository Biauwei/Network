export const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
}

export const hours = () => {
  const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
  const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
  return [start, end];
}

//quill编辑器配置
export const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{
    header: 1
  }, {
    header: 2
  }],
  [{
    list: "ordered"
  }, {
    list: "bullet"
  }],
  [{
    header: [1, 2, 3, 4, 5, 6, false]
  }],
  [{
    color: []
  }, {
    background: []
  }],
  [{
    align: []
  }],
  ["image"],
  ["clean"]
]
