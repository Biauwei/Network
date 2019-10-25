<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <div class="exception-content">
        <img src="@/assets/basic-not-found.png" alt style="max-width: 260px;">
        <div>
          <h3>抱歉，你访问的页面不存在</h3>
          <p>您要找的页面没有找到，请返回首页继续浏览</p>
        </div>
      </div>
    </div>
    <div class="page-ft"></div>
  </div>
</template>
<script>
export default {
  name: "page404",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.exception-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  img {
    margin-right: 50px;
  }
  h3 {
    color: rgb(51, 51, 51);
    font-size: 24px;
    margin: 20px 0;
  }
  p {
    color: rgb(102, 102, 102);
    font-size: 16px;
  }
}
</style>
