<template>
  <div>   
    <el-select clearable :disabled="pdisabled === 1" v-model="province" @change="handleProvince" placeholder="选择省" style="width:150px;">
      <el-option v-for="item in provinceList" :key="item.pId" :label="item.pName" :value="item.pId"></el-option>
    </el-select>  
    <el-select clearable :disabled="cdisabled === 1" v-model="city" @change="handleCity" placeholder="选择市" style="width:150px;">
      <el-option v-for="item in cityList" :key="item.cId" :label="item.cName" :value="item.cId"></el-option>
    </el-select>      
    <el-select clearable :disabled="adisabled === 1" v-model="area" @change="handleArea" placeholder="选择区" style="width:150px;">
      <el-option v-for="item in areaList" :key="item.aId" :label="item.aName" :value="item.aId"></el-option>
    </el-select>                                         
  </div>     
</template>
<script>
import service from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "qxRegion",
  props: {
    scopeType: {
      type: Number
    }
  },
  data() {
    return {
      province: null,
      city: null,
      area: null,
      pdisabled: 0,
      cdisabled: 0,
      adisabled: 0,
      provinceList: [],
      cityList: [],
      areaList: []
    };
  },
  computed: {
    ...mapGetters(["distpickerData"]) //省市区数据
  },
  watch: {
    province(newValue, oldValue) {},
    city(newValue, oldValue) {}
  },
  methods: {
    handleProvinceCityArea() {
      let _provinceList = []; //省
      let _cityList = []; //市
      let _areaList = []; //区
      for (let p = 0; p < this.distpickerData.length; p++) {
        let pName = this.distpickerData[p].name;
        let pId = this.distpickerData[p].id;
        let pChild = this.distpickerData[p].children;
        _provinceList.push({ pName, pId });
        for (let c = 0; c < pChild.length; c++) {
          let cName = pChild[c].name;
          let cId = pChild[c].id;
          let cChild = pChild[c].children;
          _cityList.push({ cName, cId });
          for (let a = 0; a < cChild.length; a++) {
            let aName = cChild[a].name;
            let aId = cChild[a].id;
            _areaList.push({ aName, aId });
          }
        }
      }
      switch (this.scopeType) {
        case 0:
          this.pdisabled = 1;
          this.provinceList = _provinceList;
          this.queryRegion(this.provinceList[0].pId, 1);
          break;
        case 1:
          this.pdisabled = 1;
          this.cdisabled = 1;
          this.provinceList = _provinceList;
          this.cityList = _cityList;
          this.queryRegion(this.cityList[0].cId, 2);
          break;
        case 2:
          this.pdisabled = 1;
          this.cdisabled = 1;
          this.adisabled = 1;
          this.provinceList = _provinceList;
          this.cityList = _cityList;
          this.areaList = _areaList;
          break;
        default:
          this.provinceList = _provinceList;
      }
      this.handleInit();
    },
    handleInit() {
      if (this.provinceList.length && this.scopeType != null) {
        this.province = this.provinceList[0].pId;
      }
      if (this.cityList.length === 1) {
        this.city = this.cityList[0].cId;
      }
      if (this.areaList.length === 1) {
        this.area = this.areaList[0].aId;
      }
    },
    handleProvince(value) {
      //不触发点击清空时的调用
      if (typeof value === "number") {
        this.queryRegion(value, 1); //查省份下的市
        this.handleEmit(value, 0); //0查省份
      } else if (typeof value === "string") {
        this.cityList.length = 0;
        this.areaList.length = 0;
        this.handleEmit("", ""); //如果清空了省，则传空字符串
      }
      this.city = null;
      this.area = null;
    },
    handleCity(value) {
      if (typeof value === "number") {
        this.queryRegion(value, 2); //查市级下的区
        this.handleEmit(value, 1); //查市级
      } else if (typeof value === "string") {
        this.areaList.length = 0;
        this.handleEmit(this.province, 0);
      }
      this.area = null;
    },
    handleArea(value) {
      if (typeof value === "number") {
        this.handleEmit(value, 2); //查区级
      } else if (typeof value === "string") {
        this.handleEmit(this.city, 1);
      }
    },
    //emit
    handleEmit(queryId, queryType) {
      this.$emit("regionChange", queryId, queryType);
    },
    async queryRegion(queryId, queryType) {
      let res = await service.queryRegion({ queryId, queryType });
      if (res.errorCode === 0) {
        let data = res.data;
        if (queryType === 0) {
        } else if (queryType === 1) {
          this.cityList = data.map((elem, index) => {
            return {
              cName: elem.name,
              cId: elem.id
            };
          });
        } else if (queryType === 2) {
          this.areaList = data.map((elem, index) => {
            return {
              aName: elem.name,
              aId: elem.id
            };
          });
        }
      }
    }
  },
  mounted() {
    this.handleProvinceCityArea();
  }
};
</script>
<style lang="less" scoped>
</style>
