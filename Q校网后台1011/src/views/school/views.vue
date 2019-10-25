<template>
   <div class="page">
       <div class="qx-card">
           <div class="qx-card-head">
               <div class="qx-card-head-wrapper">
                   <div class="qx-card-head-title">学校信息详情</div>
               </div>
           </div>
           <div class="qx-card-body">
               <el-row :gutter="10">
                   <el-col :span="8">
                       <div class="qx-trem">学校名称</div>
                       <div class="qx-detail">{{ info.name }}</div>
                   </el-col>
                   <el-col :span="8">
                       <div class="qx-trem">学校性质</div>
                       <div class="qx-detail">{{ info.propertyName }}</div>                       
                   </el-col>
                   <el-col :span="8">
                       <div class="qx-trem">学校类型</div>
                       <div class="qx-detail">{{ info.typeName }}</div>                           
                   </el-col>
                   <el-col :span="8">
                       <div class="qx-trem">区域</div>
                       <div class="qx-detail">{{ info.regionName }}</div>                           
                   </el-col>    
                   <el-col :span="8">
                       <div class="qx-trem">详细地址</div>
                       <div class="qx-detail">{{ info.address }}</div>                           
                   </el-col>  
                   <el-col :span="8">
                       <div class="qx-trem">办学元年</div>
                       <div class="qx-detail">{{ info.firstYear }}</div>                           
                   </el-col>   
                   <el-col :span="8">
                       <div class="qx-trem">学校标语</div>
                       <div class="qx-detail">{{ info.slogan }}</div>                           
                   </el-col>       
                   <el-col :span="8">
                       <div class="qx-trem">班级数量</div>
                       <div class="qx-detail">{{ info.classNumber }}</div>                           
                   </el-col>   
                   <el-col :span="8">
                       <div class="qx-trem">学校人数</div>
                       <div class="qx-detail">{{ info.studentNumber }}</div>                           
                   </el-col>  
                   <el-col :span="8">
                       <div class="qx-trem">校长</div>
                       <div class="qx-detail">{{ info.masterName }}</div>                           
                   </el-col>       
                   <el-col :span="8">
                       <div class="qx-trem">校长电话</div>
                       <div class="qx-detail">{{ info.masterPhone }}</div>                           
                   </el-col>   
                   <el-col :span="8">
                       <div class="qx-trem">校长邮箱</div>
                       <div class="qx-detail">{{ info.masterEmail }}</div>                           
                   </el-col>     
                  <el-col :span="8">
                       <div class="qx-trem">负责人</div>
                       <div class="qx-detail">{{ info.headName }}</div>                           
                   </el-col>       
                   <el-col :span="8">
                       <div class="qx-trem">负责人电话</div>
                       <div class="qx-detail">{{ info.headPhone }}</div>                           
                   </el-col>   
                   <el-col :span="8">
                       <div class="qx-trem">负责人邮箱</div>
                       <div class="qx-detail">{{ info.headEmail }}</div>                           
                   </el-col>                                                                                                     
               </el-row>
               <el-row :gutter="10">
                   <el-col :span="24">
                       <div class="qx-trem">学校标签</div>
                       <div class="qx-detail">
                           <span v-for="(tag, index) in info.labelName" :key="index">{{ tag.labelName }}</span>
                       </div>
                   </el-col>
               </el-row>
               <el-row :gutter="10">
                   <el-col :span="24">
                       <div class="qx-trem">学校描述</div>
                       <div class="qx-detail">{{ info.description }}</div>
                   </el-col>
               </el-row>
               <template v-if="info.linkMan">
                    <el-table :data="info.linkMan" border stripe size="mini" style="width: 100%">
                        <el-table-column prop="linkMan" label="联系人姓名"></el-table-column>
                        <el-table-column prop="phone" label="联系人电话"></el-table-column>
                        <el-table-column prop="email" label="联系人邮箱"></el-table-column>
                    </el-table>
               </template>
               <el-row :gutter="10">
                   <el-col :span="12" v-for="(item, index) in info.honourImg" :key="index">
                       <div class="qx-honour" :style="{ backgroundImage: `url(${item.smallUrl})` }"></div>
                   </el-col>
               </el-row>
           </div>
       </div>
   </div> 
</template>
<script>
import service from "@/api";
export default {
  name: "schoolDetails",
  data() {
    return {
      schoolId: this.$route.params.id,
      info: {}
    };
  },
  computed: {},
  methods: {
    async schoolInfo(id) {
      let res = await service.querySchoolInfo({ schoolId: id });
      if (res.errorCode === 0) {
        this.info = Object.assign({}, res.data);
      }
    }
  },
  mounted() {},
  activated() {
    this.schoolInfo(this.schoolId);
  }
};
</script>
<style lang="less" scoped>
.qx-card {
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  border-radius: 2px;
  position: relative;
}
.qx-card-head {
  font-size: 16px;
  font-weight: 500;
  min-height: 48px;
  padding: 0 32px;
  border-bottom: 1px solid #e8e8e8;
  border-radius: 2px 2px 0 0;
}
.qx-card-head-wrapper {
  display: flex;
}
.qx-card-head-title {
  display: inline-block;
  flex: 1 1;
  overflow: hidden;
  padding: 16px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qx-card-body {
  padding: 24px 32px;
  transition: padding 0.3s;
}
.qx-trem {
  display: table-cell;
  white-space: nowrap;
  line-height: 20px;
  padding-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  &::after {
    content: ":";
    margin: 0 8px 0 2px;
    position: relative;
    top: -0.5px;
  }
}
.qx-detail {
  display: table-cell;
  line-height: 22px;
  padding-bottom: 16px;
  color: #409eff;
  //color: rgba(0, 0, 0, 0.65);
  span {
    color: #fff;
    padding: 1px 10px;
    font-size: 12px;
    margin-right: 3px;
    display: inline-block;
    background: -webkit-gradient(
      linear,
      0% 0%,
      0% 100%,
      from(#3c8ce7),
      to(#0396ff)
    );
  }
}
.qx-honour {
  width: 446px;
  height: 240px;
  margin-top: 10px;
  background-size: cover;
}
</style>
