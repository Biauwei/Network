<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="header">
          <!-- <img class="logo" src="@/assets/logo.png" width="60" height="60"> -->
          <!-- <span class="title">Q校网业务综合管理后台</span> -->
        </div>
        <h3 class="desc">欢迎使用Q校网系统</h3>
      </div>
      <div class="login">
        <el-form size="medium" :rules="rules" ref="form" :model="form" @submit.native.prevent>
          <el-form-item prop="userName">
            <el-input
              type="text"
              name="userName"
              v-model="form.userName"
              placeholder="请输入用户名"
              :autofocus="true"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" name="password" v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width:100%;"
              type="primary"
              native-type="submit"
              @click="formSubmit"
            >登陆</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    formSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("qxuser/qxLoginByUsername", this.form)
            .then(res => {
              //登录成功
              if (res.errorCode === 0) {
                this.$router.replace({
                  path: "/"
                });
              } else if (res.errorCode === -1) {
                this.$message({ message: `${res.errorMsg}`, type: "warning" });
                return false;
              }
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  height: 100vh;
  background-color: rgb(240, 242, 245);
  background-image: url("../../assets/TVYTbAXWheQpRcWDaDMu.svg");
}
.content {
  padding: 112px 0 24px;
  .top {
    text-align: center;
  }
  .header {
    line-height: 60px;
  }
  .logo {
    vertical-align: top;
    margin-right: 16px;
  }
  .title {
    font-size: 30px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    position: relative;
  }
  .desc {
    color: rgba(0, 0, 0, 0.43);
    margin-bottom: 25px;
  }
}
.login {
  width: 360px;
  margin: 0 auto;
}
</style>
