<template>
  <div class="page">
    <div class="page-hd"></div>
    <div class="page-bd">
      <div class="portalweb">
        <template>
          <el-row :gutter="10">
            <el-col :span="24">
              <div class="page-form">
                <el-form
                  class="demo-form-inline"
                  :inline="true"
                  ref="form"
                  :model="query"
                  size="small"
                  label-width="120px"
                  label-position="left"
                >
                  <el-form-item
                    label="网站菜单名称"
                    prop="menuName"
                    :rules="[
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                  ]"
                  >
                    <el-input placeholder="请输入菜单名称" v-model="query.menuName"></el-input>
                  </el-form-item>
                </el-form>
                <el-row>
                  <el-button type="primary" size="small" @click="formSubmit('form')">保存</el-button>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </template>
        <template>
          <el-row v-loading="loadding">
            <div class="edit-container">
              <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
              ></quill-editor>
            </div>
          </el-row>
          <!-- 图片上传组件辅助-->
          <el-upload
            :with-credentials="true"
            list-type="picture-card"
            class="avatar-uploader"
            name="honorImage"
            ref="upload"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            action="/qxiao-cms/action/mod-xiaojiao/region/addImage.do"
            :multiple="false"
            :show-file-list="false"
            :auto-upload="true"
            :on-success="handleImageOneSuccess"
            :before-upload="beforeImageUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
      </div>
    </div>
    <div class="page-ft"></div>
  </div>
</template>
<script>
import bus from "@/utils/bus";
import service from "@/api";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { toolbarOptions } from "@/utils/tools";
import { mapActions } from "vuex";

export default {
  name: "portalEdit",
  inject: ["reload"], //注入依赖
  components: {
    quillEditor
  },
  data() {
    return {
      menuId: this.$route.params.id,
      query: {},
      loadding: false,
      content: "",
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: value => {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.editor.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    onEditorBlur() {},
    onEditorFocus() {},
    onEditorChange() {},
    ...mapActions("tabs", ["removes"]),
    removeAction(route) {
      this.removes(route).then(res => {
        if (route.path === this.$route.path) {
          this.$router.push({ path: "/portalweb/menu/1" });
        }
      });
    },
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.query.contentText = [];
          let obj = { page: 1, content: this.content };
          this.query.contentText.push(obj);
          console.log(this.query);
          this.updatePortalWeb(this.query);
        }
      });
    },
    handleImageOneSuccess(res, file, fileList) {
      if (res.errorCode === 0) {
        this.loadding = false;
        let index = this.editor.getSelection().index;
        this.editor.insertEmbed(index, "image", res.data.url);
        this.editor.setSelection(length + 1);
        //插入成功后清除input的内容
        this.$refs.upload.clearFiles();
      } else {
        this.$message.error("图片插入失败");
      }
    },
    beforeImageUpload(file) {
      this.loadding = true;
    },
    //修改学校门户网站菜单内容
    async updatePortalWeb(params = {}) {
      let res = await service.updatePortalWeb(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$alert("菜单编辑成功", "提示", {
          confirmButtonText: "确定",
          showClose: false,
          type: "success"
        })
          .then(() => {
            this.removeAction(this.$route);
            setTimeout(() => {
              this.reload();
            }, 50);
          })
          .catch(error => {
            return false;
          });
      }
    },
    //查询学校门户网站菜单内容
    async queryPortalWebInfo(menuId) {
      let res = await service.queryPortalWebInfo({ menuId });
      if (res.errorCode === 0) {
        let { menuName, id, text } = res.data[0];
        this.query = Object.assign(
          {},
          { menuName, menuId: id, contentText: [] }
        );
        this.content = text;
      }
    }
  },
  activated() {
    this.queryPortalWebInfo(this.menuId);
  }
};
</script>
<style lang="less" scoped>
.page-form {
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
}
.quill-page {
  margin-bottom: 10px;
}
.portalweb {
  width: 1200px;
  margin: 0 auto;
  margin-bottom: 100px;
}
.edit-container {
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
}
.avatar-uploader {
  opacity: 0;
  display: none;
}
</style>
