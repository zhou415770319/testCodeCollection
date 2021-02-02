<template>
  <div class="details_con">
    <componentDetails :items="items" :data="createForms"  label_width="80px"></componentDetails>
  </div>
</template>

<script>
import { uploadUrl } from '@/api/coupon'
import componentDetails from "@/views/components/componentDetails"

export default {
  props:{
    pageData:{
      type:Object,
      default:function(){
        return {}
      }
    },
    branchCompanyList:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  components:{
    componentDetails,
  },
  data() {
    return {
      createForms: {
        
      },
      pageDatas:{},
      items:[],//form表单
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
      let fileUrl = this.getUploadUrl()
      
      console.log("this.createForms"+JSON.stringify(this.createForms))
      
        this.items = [
          {
            sectionTitle:"基本信息",
            sectionClass:"hj-form-title-first",
            formItems:[
              {label:'所属设备',prop:'typeName',label_width:'60px'},
              {label:'分公司',prop:'branchName',label_width:'60px'},
              {label:'所属部门',prop:'orderId',label_width:'60px'},
              {label:'所属仓库',prop:'storeType',label_width:'60px'},
              {label:'客姿类型',prop:'personType',label_width:'60px'},
            ],
          },
          {
            sectionTitle:"活动信息",
            formItems:[
              {label:'套餐名称',prop:'activityName',label_width:'60px'},
              {label:'活动周期',prop:'activityTime',label_width:'60px'},
              {label:'场次',prop:'session',label_width:'60px'},
              {label:'可销售上限',prop:'sale',label_width:'60px'},
              {label:'限购条件',prop:'limitType',label_width:'60px'},
              {label:'描述',prop:'des',label_width:'60px'},              
              {type:'Upload',label:'图片选择',prop:'img',label_width:'60px'},
              
            ],
          },
          
        ]      
    },
    getUploadUrl(){
      return uploadUrl()
    },
    // 获取详情信息 组装form参数
    getCreateForm(pageData){
      
      let para = {...pageData};
      if ((pageData.startTime&&pageData.startTime!='')&&(pageData.endTime&&pageData.endTime!='')) {
        para.activityTime = []
        para.activityTime[0] = pageData.startTime;
        para.activityTime[1] = pageData.endTime;
      }
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
        let temSession = []
        if (pageData.session) {
          pageData.session.map((item)=>{
            temSession.push(item)
          })
        }
        para.session = temSession
        para.cateVos = temCates
        this.createForms = para
        this.updateItems()
    },
  },
}
</script>

<style lang="scss" scoped>
  .details_con{
    text-align: left;
  }
</style>