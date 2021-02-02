<template>
  <div>
    <componentForm ref="createForm" :items="items" :data="createForms" :rules="createRules" label_width="90px"></componentForm>
  </div>
</template>

<script>
import { uploadUrl } from '@/api/coupon'

import componentDetails from "@/views/components/componentDetails"
import componentForm from "@/views/components/componentForm"
import couponCrowdConfig from "../../../couponCrowd/component/couponCrowdConfig";
import addGoods from "./addGoodsItem"
export default {
  props:{
    pageData:{
      type:Object,
      default:function(){
        return {}
      }
    },
    isDetails:Boolean,
    branchCompanyList:{
      type:Array,
      default:function(){
        return []
      }
    }

  },
  components:{
    componentForm,
    componentDetails,
    addGoods,
  },
  data(){
    var validateActivityName = (rule, value, callback, e) => {
      // 可兌換上限

      if (!value) {
        callback(new Error("活动名称不能为空"));
      } else if (this.strlen(value) > 12) {
        callback(new Error("不得超过6中文汉字!"));
      } else {
        callback();
      }
    };
    return {
      isDisabled:false,
      branchId:'',
      createRules:{
        activityTime: [{ required: true, message: "请选择有效时间范围" }],
        activityName:[
          { required: true, validator: validateActivityName, trigger: "blur" }
        ],
        activityType: [
          { required: true, message: "必须选择活动类型", trigger: "blur" },
        ],
      },
      createForms: {
        
      },
      items:[],//form表单
      details:[],//详情页
    }
  },
  created(){
    this.getCreateForm(this.pageData)    
  },
  watch: {
    pageData(){
      this.getCreateForm(this.pageData)
    }
  },
  
  methods: {

    
    updateItems(){
      let that = this
      let isCreat = false
      console.log("this.createForms"+JSON.stringify(this.createForms))
      
        this.items = [
          {
            sectionTitle:"商品信息",
            formItems:[
              
              {createForm:that.createForms,
                render:function(h,params){
                  return h(couponCrowdConfig,
                    {
                      attrs:{
                        
                      },
                      props: {
                        createForm :params.row.createForm,
                        // isCreate:false
                      },
                      ref:'couponCrowdConfig'
                    }
                  )
                },
              },
              {type:'Textarea',label:'描述',prop:'activityName',width:'300px',placeholder:'请填写活动描述',},
              
            ],
          },
          // {
          //   sectionTitle:"用户群信息",
          //   formItems:[
          //     {createForm:that.createForms,
          //       render:function(h,params){
          //         return h(couponCrowdConfig,
          //           {
          //             attrs:{
                        
          //             },
          //             props: {
          //               createForm :params.row.createForm,
          //               // isCreate:false
          //             },
          //             ref:'couponCrowdConfig'
          //           }
          //         )
          //       },
          //     },
          //   ],
          // },
          
        ]
      // }
      
    },
    getUploadUrl(){
      uploadUrl()
    },
    validate(func){
      
      this.$refs.createForm.validate((valid)=>{
        func(valid)
      })
    },
    crowTypeChange(val){
      console.log(val)
    },
    activityTypeChange(val){
      
      console.log(val)
      this.updateItems()
      // 活动类型改变
      // if (val == 3) {
      //   // 累计支付
      //   this.createForm.nameListType = 1;
      //   this.createForm.rebateType = 4;//返利形式固定值
      //   this.createForm.goodsVos = [];//商品
      //   this.createForm.cateVos = [];//分类
      //   this.createForm.brandVos = [];//品牌
      //   this.createForm.ladderListData = [];//阶梯
      //   // this.createForm.auditTime = "";//阶梯
      //   this.$set(this.createForm,'userParticipateCount','')
      //   this.$set(this.createForm,'participateCount','')

      // } else if (val == 6) {
      //   // 满返
      //   this.createForm.nameListType = 1;

      //   this.createForm.rebateType = 1;//发券条件 按整体金额
      //   this.createForm.goodsVos = [];//商品
      //   this.createForm.cateVos = [];//分类
      //   this.createForm.brandVos = [];//品牌
      //   this.createForm.ladderListData = [];//阶梯
      //   // this.createForm.auditTime = "";//阶梯
      // }
    },
    activityTimeChange(val) {
      // 活动时间时间改变
      if (val) {
        // this.auditTimeDisabled = false;
      }
    },
    // 获取编辑后 请求参数
    getForms(){
      
      // this.$refs.createForm.$refs.couponCrowdConfig.createForm 
      // this.$refs.createForm.$refs.addGoods.createForm 
      
      return this.createForms
    },
    // 获取详情信息 组装form参数
    getCreateForm(pageData){
      
      let para = {...pageData};
        para.activityTime = []
        para.activityTime[0] = pageData.startTime;
        para.activityTime[1] = pageData.endTime;
        if (pageData.startTime) {
          this.auditTimeDisabled = false;

        }
        //用户群
        para.type = pageData.crowdType;
        if (pageData.crowdType == 1&&pageData.crowdVos&&pageData.crowdVos.length>0) {
          let temList = [];
          pageData.crowdVos.map((item) => {

            temList.push(item);
          });
          para.crowdlist = temList;
        } else if (pageData.crowdType == 2&&pageData.labels) {
          let temList = [];
          pageData.labels.map((item) => {
            let teminfos = [];
            if (item) {
              item.map((info) => {
                if (info) {
                  teminfos.push(info.tagCode);
                }
              });
            }
            temList.push({ labelCodes: teminfos });
          });
          para.labels = temList;
        } else if (pageData.crowdType == 3) {
          para.memberIds = pageData.memberIds;
        }

        if (!pageData.nameListType) {
          para.nameListType = 1
        }

        if (pageData.rebateType == 5) {//百分比
          // para.ladderListData = pageData.ladders
          let tempObj = {}
          if (pageData.templateVos) {
            pageData.templateVos.map((item)=>{
              tempObj[item.templateId]=item
            })
          }
          
          if (pageData.ladders) {
            para.ladderListData = pageData.ladders
          }
          if (pageData.templateVos) {
            para.resources = pageData.templateVos
          }
        }else{
          let tempObj = {}
          if (pageData.templateVos) {
            pageData.templateVos.map((item)=>{
              tempObj[item.templateId]=item
            })

          }
          let temResources = []
          if (pageData.resources) {
            pageData.resources.map((item)=>{
              let temItem = Object.assign(item,tempObj[item.templateId])
              temResources.push(temItem)
            })

          }
          para.ladderListData = temResources

        }
        let temCates = []
        if (pageData.cateVos) {
          pageData.cateVos.map((item)=>{
            // item.cateName1 = item.pidName
            temCates.push(item)
          })
        }
        para.cateVos = temCates
        this.createForms = para
        this.updateItems()
    },

    strlen(str) {
      var len = 0;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      return len;
    },
    
    //TODO:myfunc
  },
}
</script>

<style lang="scss" scoped>
/deep/ .activityTitle{
  color: aqua !important;
}
</style>