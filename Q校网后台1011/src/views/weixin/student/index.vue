<template>
  <div class="page">
    <div class="page-hd">
      <div class="page-form">
        <el-form
          class="demo-form-inline"
          :inline="true"
          :model="query"
          size="small"
          label-width="70px"
          label-position="left"
        >
          <el-form-item label="班级">
            <el-select v-model="query.classId" placeholder="选择班级">
              <el-option
                v-for="item in classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学生姓名">
            <el-input v-model="query.studentName" placeholder="请输入学生姓名" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd">录入</el-button>
            <el-upload
              class="upload-excel"
              ref="excel"
              list-type="text"
              :multiple="false"
              :with-credentials="true"
              :show-file-list="false"
              action
              accept=".xls, .xlsx"
              :before-upload="beforeUpload"
            >
              <el-button size="small" icon="el-icon-plus" type="primary">文件导入上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="page-bd">
      <el-table :data="tableData" style="width: 100%" size="small">
        <el-table-column label="序号" prop="studentId"></el-table-column>
        <el-table-column label="学生姓名" prop="studentName"></el-table-column>
        <el-table-column label="年级" prop="gradeName"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
        <el-table-column label="家长" prop="linkMan">
          <template slot-scope="scope">
            <p v-for="link in scope.row.linkMan" :key="link.relation">
              <span>手机号: {{ link.tel }}</span>
              <span>
                关系:
                <template v-if="link.relation == 1">妈妈</template>
                <template v-else-if="link.relation == 2">爸爸</template>
                <template v-else-if="link.relation == 3">爷爷</template>
                <template v-else-if="link.relation == 4">奶奶</template>
                <template v-else-if="link.relation == 5">外公</template>
                <template v-else>外婆</template>
              </span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="600">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
            <el-button size="mini" type="danger" @click="handleAddNFC(scope.row)">绑定NFC</el-button>
            <el-button size="mini" type="danger" @click="handleNFC(scope.row)">解绑NFC</el-button>
            <el-button size="mini" type="danger" @click="handleAddIBEACON(scope.row)">绑定IBEACON</el-button>
            <el-button size="mini" type="danger" @click="handleIBEACON(scope.row)">解绑IBEACON</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-ft">
      <div class="qx-pagination" v-if="totalCount">
        <el-pagination
          background
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.page"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增 or 编辑 -->
    <el-dialog top="40px" title :visible.sync="dialogFormVisible">
      <span slot="title" class="dialog-title">{{ isShow ? '新增': '编辑' }}</span>
      <el-form
        :rules="rules"
        ref="form"
        :model="form"
        status-icon
        size="small"
        :label-width="formLabelWidth"
      >
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="form.studentName" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="选择性别">
            <el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-select v-model="form.classId" placeholder="选择班级">
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" size="mini" type="primary" @click="handleAddlinkMan">新增家长</el-button>
        </el-form-item>
        <!-- for -->
        <el-row :gutter="5" v-for="(item,index) in form.linkMan" :key="index">
          <el-col :span="8">
            <el-form-item :label="`家长手机号`" :prop="`linkMan.${index}.tel`" :rules="linkmanRules.tel">
              <el-input v-model="item.tel" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="`关系`" :prop="`relation`">
              <el-select v-model="item.relation" placeholder="请选择学生与家长关系">
                <el-option
                  v-for="item in relationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button
                size="mini"
                icon="el-icon-delete"
                circle
                type="danger"
                @click="handleRemoveLinkMan(index)"
              ></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
      </span>
    </el-dialog>

    <!-- 操作删除NFC -->
    <el-dialog top="40px" title :visible.sync="dialogFormVisibleNFC">
      <span slot="title" class="dialog-title">解绑NFC</span>
      <el-form :model="formNFC" ref="dynamicValidateForm" label-width="auto" class="demo-dynamic">
        <el-form-item prop="studentName" label="学生姓名">
          <el-input v-model="formNFC.studentName" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formNFC.studentNfc"
          label="卡片ID号"
          :key="index"
          :prop="'studentNfc.' + index"
        >
          <el-input :value="item.nfcId" disabled></el-input>
          <el-button @click="delForm(item.nfcId,index)">删除</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 操作绑定NFC -->
    <el-dialog top="40px" title :visible.sync="dialogFormVisibleAddNFC">
      <span slot="title" class="dialog-title">绑定NFC</span>
      <el-form :model="formNFC" ref="dynamicValidateForm" label-width="auto" class="demo-dynamic">
        <el-form-item prop="studentName" label="学生姓名">
          <el-input v-model="formNFC.studentName" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formNFC.nfcIds"
          label="卡片ID号"
          :key="index"
          :prop="'nfcIds.' + index"
        >
          <el-input v-model="item.nfcId" type="number"></el-input>
          <!-- <el-button @click="delFormNFC(index)">查询</el-button> -->
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增NFC</el-button>
          <el-button type="primary" @click="submitFormNFC('dynamicValidateForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 绑定IBEACON--wei -->
    <el-dialog top="40px" title :visible.sync="dialogFormVisibleAddIBEACON">
      <span slot="title" class="dialog-title">绑定IBEACON</span>
      <el-form :model="formNFC" ref="dynamicValidateForm" label-width="auto" class="demo-dynamic">
        <el-form-item prop="studentName" label="学生姓名">
          <el-input v-model="formNFC.studentName" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formNFC.nfcIds"
          label="卡片ID号"
          :key="index"
          :prop="'nfcIds.' + index"
        >
          <el-input ref="IbeaconNumber" v-model="item.nfcId" type="number"></el-input>
          <!-- <el-button @click="fineFormIBEACON(index)">查询</el-button> -->
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">新增IBEACON</el-button>
          <el-button type="primary" @click="submitFormIBEACON('dynamicValidateForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 解绑IBEACON--wei -->

    <el-dialog top="40px" title :visible.sync="dialogFormVisibleDleIBEACON">
      <span slot="title" class="dialog-title">解绑IBEACON</span>
      <el-form :model="formNFC" ref="dynamicValidateForm" label-width="auto" class="demo-dynamic">
        <el-form-item prop="studentName" label="学生姓名">
          <el-input v-model="formNFC.studentName" disabled></el-input>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formNFC.studentNfc"
          label="卡片ID号"
          :key="index"
          :prop="'studentNfc.' + index"
        >
          <el-input :value="item.beaconName" disabled></el-input>
          <el-button @click="delForm2(item.id,index)">删除</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api";
import { sex, relation } from "@/mixins";
import pageMixins from "@/mixins/page";
import { isPhone } from "@/utils/validator";
export default {
  name: "student",
  mixins: [sex, relation, pageMixins],
  data() {
    return {
      query: {
        grade: 0,
        classId: 0,
        studentName: "",
        schoolId: this.$route.params.id
      },
      studentId: "",
      dialogFormVisibleNFC: false,
      dialogFormVisibleAddNFC: false,
      // 添加与解绑IBEACON
      dialogFormVisibleAddIBEACON: false,
      dialogFormVisibleDleIBEACON: false,

      formNFC: {
        studentName: "",
        nfcIds: [
          {
            nfcId: ""
          }
        ]
      },
      form: {
        studentName: "",
        classId: null,
        sex: 1,
        tel: "",
        linkMan: []
      },
      linkMan: [{ tel: "", relation: 1, patriarchId: 0 }],
      linkmanRules: {
        tel: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            required: true,
            validator: isPhone,
            trigger: "blur"
          }
        ]
      },
      rules: {
        studentName: [
          {
            required: true,
            message: "请输入学生姓名",
            trigger: "blur"
          }
        ],
        sex: [
          {
            required: true,
            message: "选择性别",
            trigger: "blur"
          }
        ],
        classId: [
          {
            required: true,
            message: "选择班级",
            trigger: "blur"
          }
        ]
      },
      classList: []
    };
  },
  methods: {
    //上传文件之前
    async beforeUpload(file) {
      let schoolId = this.$route.params.id; //微信端学校Id
      let fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "xls";
      const extensions = fileName[fileName.length - 1] === "xlsx";
      if (!extension && !extensions) {
        this.$message({
          message: "文件只能是xls、xlsx格式!",
          type: "warning"
        });
      }
      if (extension || extensions) {
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        let uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("schoolId", schoolId);
        let res = await service.batchStudents(uploadForm, config);
        if (res.errorCode === 0) {
          this.$alert("导入成功", "提示", {
            confirmButtonText: "确定",
            type: "success"
          });
          this.queryStudent(this.query);
        }
      }
      return extension || extensions;
    },
    handleSearch() {
      this.queryStudent(this.query);
    },
    handleCurrentChange(curr) {
      this.query.page = curr;
      this.queryStudent(this.query);
    },
    handleSizeChange(size) {
      this.query.pageSize = size;
      this.queryStudent(this.query);
    },
    handleAddlinkMan() {
      this.form.linkMan.push({ tel: "", relation: 1, patriarchId: 0 });
    },
    handleRemoveLinkMan(index) {
      return this.form.linkMan.splice(index, 1);
    },
    handleAdd() {
      this.isShow = true;
      this.dialogFormVisible = true;
      this.form = {
        linkMan: [{ tel: "", relation: 1, patriarchId: 0 }]
      };
    },
    handleEdit(row) {
      this.isShow = false;
      this.dialogFormVisible = true;
      this.form = Object.assign({}, row);
    },
    handleDel(row) {
      console.log(row);
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteStudent(row.studentId);
        })
        .catch(error => {
          return false;
        });
    },

    // 绑定NFC20191005
    handleAddNFC(row) {
      this.dialogFormVisibleAddNFC = true;
      this.formNFC = Object.assign({}, row, {
        nfcIds: [
          {
            nfcId: ""
          }
        ]
      });
    },
    // 添加NFC20191005
    addDomain() {
      this.formNFC.nfcIds.push({
        nfcId: ""
      });
    },
    // 删除20191005 NFC
    delFormNFC(index) {
      // console.log(index);
    },

    // 删除IBEACON
    async delForm2(id, index) {
      let data = {
        id
      };
      let res = await service.deleteStudentBeaconMac(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({
          message: "删除成功",
          type: "warning"
        });
        console.log(this.formNFC.studentNfc.splice(index, 1));
      }
    },

    // 绑定IBEACON弹框---wei
    handleAddIBEACON(row) {
      this.dialogFormVisibleAddIBEACON = true;
      this.formNFC = Object.assign({}, row, {
        nfcIds: [
          {
            nfcIds: ""
          }
        ]
      });
    },

    // 提交新增NFC20191005
    submitFormNFC() {
      this.formNFC.nfcIds = this.formNFC.nfcIds.filter(
        item => item.nfcId != ""
      );
      if (this.formNFC.nfcIds.length === 0) {
        this.$message({
          message: "请添加nfcId",
          type: "warning"
        });
        this.formNFC.nfcIds = [
          {
            nfcId: ""
          }
        ];
        return false;
      } else {
        this.addNfc(this.formNFC);
      }
    },
    async addNfc(formNFC) {
      let data = {
        studentId: this.formNFC.studentId,
        nfcIds: this.formNFC.nfcIds
      };
      let res = await service.addNfc(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({
          message: "绑定成功",
          type: "warning"
        });
        this.dialogFormVisibleAddNFC = false;
      } else {
        this.$message({
          message: res.errorMsg,
          type: "warning"
        });
      }
    },

    // 提交绑定IBEACON ---wei--
    submitFormIBEACON() {
      let beaconNumber = this.$refs.IbeaconNumber[0].value;
      // console.log(beaconNumber);
      if (beaconNumber !== "") {
        this.addBeacon(this.formNFC);
      } else {
        this.$message({
          message: "请添加IBEACON",
          type: "warning"
        });
      }
    },
    async addBeacon(formNFC) {
      let data = {
        beaconId: this.$refs.IbeaconNumber[0].value,
        studentId: this.formNFC.studentId + ""
      };
      let res = await service.addBeacon(data, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.$message({
          message: "绑定成功",
          type: "warning"
        });
        this.dialogFormVisibleAddIBEACON = false;
      } else {
        if (res.errorMsg == null) {
          this.$message({
            message: res.errorMsg,
            type: "warning"
          });
        } else {
          this.$message({
            message: res.errorMsg,
            type: "warning"
          });
        }
      }
    },

    //查看NFC列表20191005
    handleNFC(row) {
      this.queryNfcList(row);
    },
    async queryNfcList(row) {
      let res = await service.queryNfcList(
        {
          studentId: row.studentId
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log(res);
      if (res.errorCode === 0) {
        this.dialogFormVisibleNFC = true;
        this.formNFC = Object.assign({}, row, {
          studentNfc: res.data
        });
      }
    },

    // 查询学生beacon信息 --wei
    async handleIBEACON(row) {
      let res = await service.queryBeaconByStudentId(
        {
          studentId: row.studentId
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.dialogFormVisibleDleIBEACON = true;
        this.formNFC = Object.assign({}, row, {
          studentNfc: res.data
        });
      }
    },

    // 解绑NFC20191005
    async delForm(nfcId, index) {
      let res = await service.deleteNfcId(
        { nfcId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.formNFC.studentNfc.splice(index, 1);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let schoolId = this.$route.params.id;
          Object.assign(this.form, { schoolId });
          if (this.isShow) {
            this.addStudent(this.form);
          } else {
            this.updateStudent(this.form);
          }
        }
      });
    },

    //查询学生列表（微信端）
    async queryStudent(params = {}) {
      let res = await service.queryStudent(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.tableData = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    },
    //录入学生信息（微信端）
    async addStudent(params = {}) {
      let res = await service.addStudent(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryStudent(this.query);
      } else {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    },
    //编辑学生信息（微信端）
    async updateStudent(params) {
      let res = await service.updateStudent(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogFormVisible = false;
        this.$refs.form.resetFields();
        this.queryStudent(this.query);
      }
    },
    //删除学生信息（微信端）
    async deleteStudent(studentId) {
      let res = await service.deleteStudent(
        { studentId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.queryStudent(this.query);
      }
    },
    //查询班级列表（微信端）
    async querySchoolClass() {
      let schoolId = this.$route.params.id;
      let res = await service.querySchoolClass(
        { schoolId },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      if (res.errorCode === 0) {
        this.classList = res.data;
      }
    }
  },
  activated() {
    this.queryStudent(this.query);
    this.querySchoolClass();
    console.log(11111);
  }
};
</script>
<style lang="less" scoped>
.upload-excel {
  display: inline-block;
  margin-left: 10px;
}
</style>
