<template>
  <h-container class="hj-advertisement-list">
    <div slot="center">
      <detail v-if="isDetails" :pageData="pageData"></detail>
      <createForm v-else-if="pageType == 'first'" ref="createForm" :isDetails="isDetails" :pageData="pageData" :branchCompanyList="branchCompanyList"></createForm>
      <createFormSecond v-else-if="pageType == 'end'" ref="createFormSecond" :isDetails="isDetails" :pageData="pageData"></createFormSecond>
    </div>

    <div v-if="!isDetails" class="hj-footer-btn">
      <el-button v-if="pageType == 'end'" type="primary" size="medium" @click="submit('2')">提交</el-button>
      <el-button v-else type="primary" size="medium" @click="next">下一步</el-button>
      <el-button v-if="pageType != 'first'" type="none" size="medium" @click="pre">上一步</el-button>
      <el-button type="none" size="medium" @click="cancel">取消</el-button>
    </div>
    <div v-else class="hj-footer-btn">
      <el-button type="none" size="medium" @click="cancel">返回</el-button>
    </div>
  </h-container>
</template>

<script>
import { queryCompanyList } from "@/api/label";

import detail from "./component/details"
import createForm from "./component/createForm"
import createFormSecond from "./component/createFormSecond"
import { createIntegral, queryIntegralDetail } from "@/api/integral";

export default {
  props:{},
  components:{
    createForm,
    createFormSecond,
    detail,
  },
  data() {
    return {
      //是否是详情页面
      isDetails:false,
      //请求参数
      pageData: {
        activityTime: [],
        startTime:'',
        endTime:'',
        selectCoupons: [],
        nameListType: 1,
        rebateType: "",
        activityName: "",
        activityType:"",
        resources:[],
        ladderListData: [], //阶梯列表
        goodsVos: [], //商品列表
        cateVos: [], // 品类列表
        brandVos: [], // 品牌列表
        branchId:'',
        orderId:2,
        session:[],
      },

      pageType:"first", //first 第一步 end 最后一步
      branchCompanyList:[],//公司列表
      companyObj:{},
      user:{},
    }
  },
  
  created(){
    let _department = this.$store.getters.department;
    _department ? (this.isDisabled = false) : (this.isDisabled = true);
    this.user = JSON.parse(localStorage.getItem("USER"));
    if (!_department) {
      this.pageData.branchId = this.user.branchId
    }
    
    this.getBranchCompany();
    
  },

  methods: {

    initPages(){
      
      let id = this.$router.currentRoute.params.id;
      let operator = this.$router.currentRoute.params.operator;
      if (id!="-1") {
        //   有数据
        console.log(operator);
        queryIntegralDetail({ id: this.$route.params.id }).then((res)=>{
          
          if (operator == "edit") {
            // 编辑
            // this.getCreateForm(this.pageData)
          } else if (operator == "copy") {
            // 复制
            // this.getCreateForm(this.pageData)
          }
          else if (operator == "details") {
            // 详情
            this.isDetails = true
          }
          this.$nextTick(()=>{
            this.pageData = res.content;
            
          })
        })
        .catch();
      }
    },

    // 获取分公司
    getBranchCompany() {
      let that = this
      queryCompanyList({
        orgId: this.user.or_org_id,
        branchOrgId: this.user.branchOrgId
      }).then(res => {
        console.log(res.content);
        this.branchCompanyList = [{ id: "", value: "全部" }];
        let obj = res.content;
        this.companyObj = obj;
        Object.keys(obj).map(key => {
          this.branchCompanyList.push({ id: Number(key), value: obj[key] });
        });
        this.initPages()
      });
    },
    submit(type) {
      this.loading = true;
      this.type = type;

      console.log(this.$refs.createFormSecond.createForms);
      // TODO: 提交逻辑
      this.$refs.createFormSecond.validate((valid) => {
        
        if (valid) {
          
          // let forms = this.$refs.createForm.getForms()
          // if (!this.validCreateForm()) {
          //   return
          // }
          // const data = this.getCreateForm();
          
          // createIntegral(data)
          //   .then((res) => {
          //     this.loading = false;
          //     let msg = "";
          //     if (this.type == 1) {
          //       msg = "暂存成功!";
          //     } else if (this.type == 2) {
          //       msg = "配置成功!";
          //     } else {
          //       msg = "请求成功!";
          //     }
          //     this.$message({
          //       type: "success",
          //       message: msg,
          //     });
          //     setTimeout(() => {
          //       this.handleDelView(this.$route)
          //     }, 1000);
          //   })
          //   .catch(() => {
          //     this.loading = false;
          //   });
        }
      });
    },
    cancel() {
      this.handleDelView(this.$route)
    },
    // 下一步
    next(){
      if (this.pageType == 'first') {
        let that = this
        this.$refs.createForm.validate((valid) => {
          if (valid) {
            
            that.pageType = 'end'
            let forms = this.$refs.createForm.getForms()
            // this.$set(that,'pageData',forms)
            that.pageData = forms
            
          }
        });
      }
    },
    pre(){
      if (this.pageType == 'end') {
        let that = this
        this.$refs.createFormSecond.validate((valid) => {
          if (valid) {
            
            this.pageType = 'first'
            console.log(JSON.stringify(this.pageData))
            let forms = this.$refs.createFormSecond.getForms()
            that.pageData = forms
        
          }
        });
        
      }
    }
  },
}
</script>