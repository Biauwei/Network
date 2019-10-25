<template>
  <div class="page">
    <div class="page-hd">
      <!-- 表单 -->
      <template>
        <el-row :gutter="10">
          <el-col :span="24">
            <div class="page-form">
              <h3 style="color:#409EFF">{{ schoolName }}</h3>
              <div>
                <el-button
                  :disabled="disabled === 1"
                  size="small"
                  icon="el-icon-plus"
                  type="primary"
                  @click="dialogChannel = true"
                >新增</el-button>
                <el-button
                  :disabled="disabled === 1"
                  size="small"
                  type="primary"
                  @click="handleUpdateTerminal"
                >更新表单到终端</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </div>
    <div class="page-bd">
      <template>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-tabs class="qx-page-tabs" type="border-card" @tab-click="handleTabClick">
              <el-tab-pane label="内容播放" name="0">
                <!-- 表格数据 -->
                <template>
                  <el-table :data="tableData" style="width: 100%" size="mini">
                    <el-table-column width="400" label="播放时段">
                      <template slot-scope="scope">
                        <template v-if="scope.row.show">
                          <el-time-picker
                            @change="handleChangeTime"
                            is-range
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            v-model="value4"
                            size="mini"
                            :clearable="false"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                          ></el-time-picker>
                        </template>
                        <template v-else>
                          <p>{{ scope.row.playStartTime }} - {{ scope.row.playEndTime }}</p>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="栏目名称" prop="channelId">
                      <template slot-scope="scope">
                        <template v-if="scope.row.show">
                          <el-select
                            v-model="scope.row.channelId"
                            placeholder="请选择"
                            size="mini"
                            @change="select => handleChannelChange(select, scope.row)"
                          >
                            <el-option
                              v-for="item in channelList"
                              :key="item.channelId"
                              :value="item.channelId"
                              :label="item.name"
                            ></el-option>
                          </el-select>
                        </template>
                        <template v-else>
                          <p>{{scope.row.channelName}}</p>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="播放优先级" prop="priority">
                      <template slot-scope="scope">
                        <template v-if="scope.row.show">
                          <el-select v-model="scope.row.priority" placeholder="请选择" size="mini">
                            <el-option
                              v-for="item in priorityList"
                              :key="item.value"
                              :value="item.value"
                              :label="item.label"
                            ></el-option>
                          </el-select>
                        </template>
                        <template v-else>
                          <p>{{scope.row.priority}}</p>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="栏目有效期" prop="validType">
                      <template slot-scope="scope">
                        <template v-if="scope.row.show">
                          <p class="simInput" @click="handleValiditySelect(scope.row)">
                            <span v-if="scope.row.validType === 0">长期有效</span>
                            <span
                              v-else
                            >{{ scope.row.validStartTime }} 至 {{ scope.row.validEndTime }}</span>
                          </p>
                          <el-dialog
                            width="40%"
                            center
                            title="选择栏目有效期"
                            append-to-body
                            :visible.sync="dialogValidity"
                            @close="handleValidityHide(scope.row)"
                          >
                            <template>
                              <template>
                                <el-radio-group v-model="radio">
                                  <el-radio :label="0">长期</el-radio>
                                  <el-radio :label="1">按时段有效</el-radio>
                                </el-radio-group>
                              </template>
                            </template>
                            <div style="margin:20px 0 0 20px"></div>
                            <template v-if="radio == 1">
                              <el-row>
                                <el-date-picker
                                  value-format="yyyy-MM-dd"
                                  format="yyyy-MM-dd"
                                  v-model="validityData"
                                  size="mini"
                                  :clearable="false"
                                  type="daterange"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  :picker-options="pickerOptions"
                                ></el-date-picker>
                              </el-row>
                            </template>
                            <div slot="footer" class="dialog-footer">
                              <el-button size="small" @click="dialogValidity = false">取消</el-button>
                              <el-button
                                size="small"
                                type="primary"
                                @click="handleValiditySave(scope.row)"
                              >确定</el-button>
                            </div>
                          </el-dialog>
                        </template>
                        <template v-else>
                          <p v-if="scope.row.validType === 0">长期有效</p>
                          <p v-else>{{ scope.row.validStartTime }} 至 {{ scope.row.validEndTime }}</p>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="播放内容" prop="content">
                      <template slot-scope="scope">
                        <template v-if="scope.row.show">
                          <p class="simInput" @click="handleViewPlayData(scope.row)">查看播放内容</p>
                        </template>
                        <template v-else>
                          <el-popover placement="left" trigger="hover">
                            <el-table :data="scope.row.contents" border stripe size="mini">
                              <el-table-column
                                width="260"
                                property="title"
                                label="播放内容"
                                :show-overflow-tooltip="true"
                              >
                                <template slot-scope="scope">
                                  <a
                                    href="javascript:;"
                                    style="color:#409EFF"
                                    @click="handleViewInfo(scope.row)"
                                  >{{ scope.row.title }}</a>
                                </template>
                              </el-table-column>
                            </el-table>
                            <a href="javascript:;" style="color:#409EFF" slot="reference">查看</a>
                          </el-popover>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          :disabled="scope.row.state === 0"
                          size="mini"
                          type="success"
                          @click="handleSave(scope.row)"
                          v-show="scope.row.show"
                        >保存</el-button>
                        <el-button
                          :disabled="scope.row.state === 0"
                          size="mini"
                          v-show="scope.row.show"
                          @click="handleCancel(scope.row)"
                        >取消</el-button>
                        <el-button
                          :disabled="scope.row.state === 0"
                          size="mini"
                          type="primary"
                          @click="handleEdit(scope.row)"
                          v-show="!scope.row.show"
                        >编辑</el-button>
                        <el-button
                          :disabled="scope.row.state === 0"
                          size="mini"
                          type="danger"
                          @click="handleDelete(scope.row)"
                          v-show="!scope.row.show"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
              <el-tab-pane label="滚动通知" name="1">
                <!-- 表格数据 -->
                <el-table :data="scrollData" style="width: 100%" size="mini">
                  <el-table-column label="内容标题" prop="title"></el-table-column>
                  <el-table-column label="通知内容" prop="content"></el-table-column>
                  <el-table-column label="播放有效期" prop="validType">
                    <template slot-scope="scope">
                      <template v-if="scope.row.show">
                        <el-date-picker
                          value-format="yyyy-MM-dd"
                          format="yyyy-MM-dd"
                          v-model="validityScrollData"
                          size="mini"
                          :clearable="false"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions"
                        ></el-date-picker>
                        <!-- <p class="simInput">
                        <span>{{ scope.row.validStartTime }} 至 {{ scope.row.validEndTime }}</span>
                        </p>-->
                      </template>
                      <template v-else>
                        <p>{{ scope.row.validStartTime }} 至 {{ scope.row.validEndTime }}</p>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        :disabled="scope.row.state === 0"
                        size="mini"
                        type="success"
                        @click="handleSaveScroll(scope.row)"
                        v-show="scope.row.show"
                      >保存</el-button>
                      <el-button
                        :disabled="scope.row.state === 0"
                        size="mini"
                        v-show="scope.row.show"
                        @click="handleCancelScroll(scope.row)"
                      >取消</el-button>
                      <el-button
                        :disabled="scope.row.state === 0"
                        size="mini"
                        type="primary"
                        @click="handleEditScroll(scope.row)"
                        v-show="!scope.row.show"
                      >编辑</el-button>
                      <el-button
                        :disabled="scope.row.state === 0"
                        size="mini"
                        type="danger"
                        @click="handleDeleteScroll(scope.row)"
                        v-show="!scope.row.show"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </template>
    </div>
    <div class="page-ft"></div>

    <!-- 查看上传详情信息 -->
    <template>
      <el-dialog width="60%" title="查看上传详情信息" top="40px" :visible.sync="dialogView">
        <el-row :gutter="10" type="flex" class="row-bg">
          <div class="one">
            <div class="image-box" v-if="info.showType == 3">
              <el-carousel height="589px" :autoplay="false">
                <el-carousel-item v-for="(item, index) in info.images" :key="index">
                  <img :src="item.url" class="image" width="400" height="589" :alt="item.name">
                </el-carousel-item>
              </el-carousel>
            </div>
            <template v-if="info.showType === 4">
              <div class="video-box">
                <video :src="info.videoUrl" controls width="400" height="230"></video>
              </div>
            </template>
            <div class="image-box" v-if="info.showType == 4 || info.showType == 5">
              <el-carousel height="359px" :autoplay="false">
                <el-carousel-item v-for="(item, index) in info.images" :key="index">
                  <img :src="item.url" class="image" width="400" height="359" :alt="item.name">
                </el-carousel-item>
              </el-carousel>
            </div>
            <template v-if="info.showType === 5">
              <div class="video-box">
                <video :src="info.videoUrl" controls width="400" height="230"></video>
              </div>
            </template>
          </div>
          <div class="two">
            <div class="list">
              <p>
                标题：
                <span>{{ info.title }}</span>
              </p>
              <p>
                内容类型：
                <span v-if="info.contentType === 0">全屏播放</span>
                <span v-else>滚动播放</span>
              </p>
              <template v-if="info.contentType === 0">
                <p>
                  内容属性：
                  <span v-if="info.contentProperty === 0">原创</span>
                  <span v-else>摘要</span>
                </p>
                <p>
                  作者：
                  <span v-if="info.author">{{ info.author }}</span>
                  <span v-else>无</span>
                </p>
                <p>
                  播放时长：
                  <span>{{ info.durationTime }}</span>
                </p>
                <p>
                  展示类型：
                  <span v-if="info.showType === 0">纯海报方式</span>
                  <span v-else-if="info.showType === 1">上视频下海报方式</span>
                  <span v-else-if="info.showType === 2">上海报下视频方式</span>
                  <span v-else-if="info.showType === 3">纯图片</span>
                  <span v-else-if="info.showType === 4">上视频下图片</span>
                  <span v-else>上图片下视频</span>
                </p>
              </template>
              <template v-else>
                <p>
                  播放有效期：
                  <span>{{ info.playTime }} - {{ info.endTime }}</span>
                </p>
                <p v-if="info.contentType === 1">
                  滚动内容：
                  <span>{{ info.rollContent }}</span>
                </p>
              </template>
            </div>
          </div>
        </el-row>
      </el-dialog>
    </template>
    <!-- 播放内容 -->
    <template>
      <el-dialog
        :close-on-click-modal="false"
        title="播放内容"
        :visible.sync="dialogContent"
        @open="showPlayContent"
      >
        <el-table
          @selection-change="handleSelectCheckbox"
          ref="playCon"
          :data="playContendata"
          style="width: 100%"
          border
          stripe
          size="mini"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="title" label="播放内容"></el-table-column>
          <el-table-column property="postTime" label="发布时间"></el-table-column>
          <el-table-column property="duration" label="单次播放时长"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogContent = false">取消</el-button>
          <el-button size="small" type="primary" @click="handleToggleSelection">确定</el-button>
        </div>
      </el-dialog>
    </template>
    <!-- 新增学校播放频道 -->
    <template>
      <el-dialog top="40px" title="新增学校播放频道" :visible.sync="dialogChannel">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          status-icon
          size="small"
          :label-width="formLabelWidth"
        >
          <el-form-item label="栏目名称" prop="channelId">
            <el-select
              v-model="form.channelId"
              placeholder="请选择"
              style="width:100%;"
              @change="handleQueryContents"
            >
              <el-option
                v-for="item in channelList"
                :key="item.channelId"
                :value="item.channelId"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="播放优先级" prop="priority">
            <el-select v-model="form.priority" style="width:100%;" placeholder="请选择">
              <el-option
                v-for="item in priorityList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="播放时段" prop="playTime">
            <el-time-picker
              is-range
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="form.playTime"
              :clearable="false"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="栏目有效期" prop="validType">
            <el-select v-model="form.validType" style="width:100%;" @change="handleValidType">
              <el-option
                v-for="item in validTypelist"
                :key="item.value"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="日期选择"
            prop="validTime"
            :rules="form.validType === 1 ? validTimeRules : []"
          >
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="form.validTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="播放内容" prop="contents">
            <el-select
              v-model="form.contents"
              style="width:100%;"
              value-key="contentId"
              multiple
              collapse-tags
              placeholder="请选择播放内容"
            >
              <el-option
                v-for="item in contentsList"
                :key="item.contentId"
                :label="item.title"
                :value="item.contentId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogChannel = false">取消</el-button>
          <el-button size="small" type="primary" @click="formSubmit('form')">保存</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import service from "@/api";
import { scrollType, priority, validType } from "@/mixins";
import { disabledDate, hours } from "@/utils/tools";
export default {
  name: "playformShow",
  mixins: [scrollType, priority, validType],
  data() {
    return {
      disabled: 0,
      dialogView: false,
      dialogContent: false,
      dialogChannel: false,
      dialogValidity: false,
      formLabelWidth: "100px",
      radio: 0,
      value4: hours(),
      isChangeTime: false, //用户是否修改了播放时段
      validityData: [],
      validityScrollData: [],
      schoolId: this.$route.params.id,
      schoolName: "",
      info: {},
      rules: {
        channelId: [
          { required: true, message: "请选择栏目名称", trigger: "blur" }
        ]
      },
      form: {
        channelId: null,
        validType: 0,
        priority: 1,
        playTime: ["00:00:00", "23:59:59"],
        validTime: [],
        contents: []
      },
      pickerOptions: {
        disabledDate
      },
      countCheckbox: [], //记录选择的行数checkbox
      playContendata: [],
      currPlayConten: [],
      contentsList: [],
      channelList: [],
      scrollData: [],
      tableData: []
    };
  },
  computed: {
    validTimeRules() {
      return [{ required: true, message: "请选择有效期", trigger: "blur" }];
    }
  },
  methods: {
    //滚动内容相关操作
    handleSaveScroll(row) {
      let { contentId } = row;
      let obj = Object.assign(
        {},
        {
          contentId,
          validStartTime: this.validityScrollData[0],
          validEndTime: this.validityScrollData[1]
        }
      );
      console.log(obj);
      this.updateScroolContent(obj);
    },
    handleCancelScroll(row) {
      this.querySchoolScroolContent(this.schoolId);
    },
    handleEditScroll(row) {
      this.validityScrollData = [row.validStartTime, row.validEndTime];
      this.handleRowEditor(row, { show: true, state: 1 });
    },
    handleDeleteScroll(row) {
      let { schoolId, contentId } = row;
      this.$confirm(`确定要删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteScroolContent({ schoolId, contentId });
        })
        .catch(error => {
          return false;
        });
    },
    //设置表格单行可以编辑状态
    handleRowEditor(row, params = {}) {
      for (let o in params) {
        this.$set(row, o, params[o]);
      }
    },
    handleRowAll(params = {}) {
      let tableData = this.tableData;
      tableData.forEach((elem, index) => {
        if (!elem.show) {
          for (let o in params) {
            this.$set(elem, o, params[o]);
          }
        }
      });
    },
    handleTabClick(tab) {
      if (tab.name == 0) {
        this.querySchoolPlayChannel(this.schoolId);
      } else {
        this.querySchoolScroolContent(this.schoolId);
      }
    },
    handleValidType(value) {
      if (value === 0) {
        this.$refs.form.clearValidate(["validTime"]);
      }
    },
    handleChangeTime(value) {
      this.isChangeTime = true;
    },
    handleSave(row) {
      let content = [];
      let countCheckbox = this.countCheckbox; //选中的数据
      let { show, state, channelName, postTime, contents, ...args } = row;
      if (countCheckbox.length) {
        content = countCheckbox.map(item => {
          return { contentId: item.contentId };
        });
      }
      //如果播放时段改变了
      if (this.isChangeTime) {
        args.playStartTime = this.value4[0];
        args.playEndTime = this.value4[1];
      }
      let obj = Object.assign({}, args, { contents: content });
      console.log(obj);
      this.updateSchoolPlayChannel(obj);
    },
    handleCancel(row) {
      this.disabled = 0;
      this.querySchoolPlayChannel(this.schoolId);
    },
    //栏目选择改变
    async handleChannelChange(select, row) {
      let res = await this.queryChannelContents(
        {
          schoolId: this.schoolId,
          channelId: row.channelId
        },
        "edit"
      );
      if (res.length) {
        console.log("res");
        let result = res.map(item => {
          return { title: item.title, contentId: item.contentId };
        });
        row.contents = result;
      } else {
        //如何栏目下没有内容，则为空
        row.contents = [];
      }
    },
    //编辑
    handleEdit(row) {
      console.log(row);
      let { playStartTime, playEndTime, schoolId, itemId } = row;
      this.value4 = [playStartTime, playEndTime];
      this.disabled = 1;
      this.handleRowEditor(row, { show: true, state: 1 });
      this.handleRowAll({ show: false, state: 0 });
      this.queryPlayContent({ schoolId, itemId });
    },
    //删除
    handleDelete(row) {
      let { itemId, schoolId } = row;
      this.$confirm(`确定要删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteSchoolPlayChannel({ itemId, schoolId });
        })
        .catch(error => {
          return false;
        });
    },
    //查看播放内容信息
    handleViewInfo(row) {
      this.queryContentByContentId(row.contentId);
    },
    //
    handleSelectCheckbox(selection) {
      console.log(selection);
      this.countCheckbox = [].concat(selection);
    },
    handleToggleSelection() {
      this.dialogContent = false;
      console.log(this.countCheckbox);
    },
    //查看播放的内容
    handleViewPlayData(row) {
      this.dialogContent = true;
      let { contents } = row;
      let playContendata = this.playContendata;
      let rows = [];
      for (let i = 0; i < contents.length; i++) {
        for (let j = 0; j < playContendata.length; j++) {
          if (contents[i].contentId === playContendata[j].contentId) {
            rows.push(playContendata[j]);
          }
        }
      }
      this.currPlayConten = rows;
    },
    //选中播放的内容
    showPlayContent() {
      this.$nextTick(() => {
        this.$refs.playCon.clearSelection();
        this.currPlayConten.forEach(col => {
          this.$refs.playCon.toggleRowSelection(col);
        });
      });
    },
    //更新到终端
    handleUpdateTerminal() {
      this.updatePlayList(this.schoolId);
    },
    //查询栏目内容
    handleQueryContents(value) {
      this.queryChannelContents({ schoolId: this.schoolId, channelId: value });
    },
    //选择栏目有效期
    handleValiditySelect(row) {
      this.dialogValidity = true;
      if (row.validType) {
        this.validityData = [row.validStartTime, row.validEndTime];
      }
      return row.validType === 0 ? (this.radio = 0) : (this.radio = 1);
    },
    //栏目有效期选择保存
    handleValiditySave(row) {
      let radio = this.radio;
      if (radio) {
        row.validStartTime = this.validityData[0];
        row.validEndTime = this.validityData[1];
        row.validType = 1;
      } else {
        row.validType = 0;
        row.validStartTime = "";
        row.validEndTime = "";
      }
      this.dialogValidity = false;
    },
    handleValidityHide() {},
    //表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //表单提交
    formSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let schoolId = parseInt(this.schoolId);
          let validStartTime = "";
          let validEndTime = "";
          let playStartTime = "";
          let playEndTime = "";
          let one = [];
          let { playTime, validTime, validType, contents, ...args } = this.form;

          this.contentsList.forEach(oldItem => {
            if (
              contents.find(newItem => {
                return oldItem.contentId == newItem;
              })
            ) {
              one.push({ contentId: oldItem.contentId });
            }
          });

          if (validType === 1) {
            validStartTime = validTime[0];
            validEndTime = validTime[1];
          }
          if (playTime.length) {
            playStartTime = playTime[0];
            playEndTime = playTime[1];
          }
          let obj = Object.assign({}, args, {
            schoolId,
            validType,
            contents: one,
            validStartTime,
            validEndTime,
            playStartTime,
            playEndTime
          });
          console.log(obj);
          this.addSchoolPlayChannel(obj);
        }
      });
    },
    //查询栏目名称
    async queryChannelAll() {
      let res = await service.queryChannelAll({});
      if (res.errorCode === 0) {
        this.channelList = res.data;
      }
    },
    async queryChannelContents(params = {}, str = "add") {
      let res = await service.queryChannelContents(params);
      if (res.errorCode === 0) {
        if (str === "add") {
          this.form.contents = [];
          this.contentsList = res.data;
        } else {
          this.playContendata = res.data;
          return res.data;
        }
      }
    },
    //查询栏目对应播放内容列表
    async queryPlayContent(params = {}) {
      let res = await service.queryPlayContent(params);
      if (res.errorCode === 0) {
        this.playContendata = res.data;
      }
    },
    //更新表单播放列表
    async updatePlayList(schoolId) {
      let res = await service.updatePlayList({ schoolId });
      if (res.errorCode === 0) {
        this.$message({ message: `${res.errorMsg}`, type: "success" });
      } else if (res.errorCode === -1) {
        this.$message({ message: `${res.errorMsg}`, type: "warning" });
      }
    },
    //新增学校播放频道
    async addSchoolPlayChannel(params = {}) {
      let res = await service.addSchoolPlayChannel(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.dialogChannel = false;
        this.resetForm("form");
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.querySchoolPlayChannel(this.schoolId);
      }
    },
    //编辑学校播放频道
    async updateSchoolPlayChannel(params = {}) {
      let res = await service.updateSchoolPlayChannel(params, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.errorCode === 0) {
        this.disabled = 0;
        this.countCheckbox = [];
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.querySchoolPlayChannel(this.schoolId);
      }
    },
    //删除学校播放频道
    async deleteSchoolPlayChannel(params = {}) {
      let res = await service.deleteSchoolPlayChannel(params);
      if (res.errorCode === 0) {
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.querySchoolPlayChannel(this.schoolId);
      }
    },
    //查询学校全屏播放内容
    async querySchoolPlayChannel(schoolId) {
      let res = await service.querySchoolPlayChannel({ schoolId });
      if (res.errorCode === 0) {
        this.tableData = res.data;
      }
    },
    //查询学校滚动播放内容
    async querySchoolScroolContent(schoolId) {
      let res = await service.querySchoolScroolContent({ schoolId });
      if (res.errorCode === 0) {
        this.scrollData = res.data;
      }
    },
    //查看播放内容信息
    async queryContentByContentId(contentId) {
      let res = await service.queryContentByContentId({ contentId });
      if (res.errorCode === 0) {
        this.info = Object.assign({}, res.data);
        this.dialogView = true;
      }
    },
    //编辑滚动内容
    async updateScroolContent(params = {}) {
      let res = await service.updateScroolContent(params);
      if (res.errorCode === 0) {
        this.$message({ message: `${res.errorMsg}`, type: "success" });
        this.querySchoolScroolContent(this.schoolId);
      }
    },
    //删除滚动内容
    async deleteScroolContent(params = {}) {
      let res = await service.deleteScroolContent(params);
      if (res.errorCode === 0) {
        this.querySchoolScroolContent(this.schoolId);
      }
    },
    async querySchoolInfo(schoolId) {
      let res = await service.querySchoolInfo({ schoolId });
      if (res.errorCode === 0) {
        this.schoolName = res.data.name;
      }
    }
  },
  activated() {},
  mounted() {
    this.querySchoolInfo(this.schoolId);
    this.querySchoolPlayChannel(this.schoolId);
    this.queryChannelAll();
  }
};
</script>
<style lang="less" scoped>
.page-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-align: left;
  // background-color: #fff;
}
</style>
