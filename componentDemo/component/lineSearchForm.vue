<template>
  <div>
    <searchForm :searchItems="searchItems" :searchForm="search" :inline="false">
      <div slot="search" class="search_con">
        <slot name="search"></slot>
      </div>
    </searchForm>
    <el-dialog :visible.sync="activityVisible" title="选择活动">
      <div>测试</div>
    </el-dialog>
  </div>
</template>

<script>
import { queryIntegralList, operatorIntegral } from "@/api/integral";
import searchForm from "@/views/components/componentSearchForm"
import kanban from "./lineKanBan"
export default {
  name: "timeLimitSaleForm",
  props: {
    update: {
      type: Function,
    },
    branchCompanyList:{
      type:Array,
      default:function(){
        return {}
      }
    }
  },
  components:{
    searchForm,
    kanban
  },
  data() {
    return {
      search: {
        pageNum: 1,
        pageSize: 10,
        branchId: "",
        activityName: "",
        activityStatus: "",
        activityTarget: "",
        activityType: [3, 6],
        couponActivityType: 0,
        id: "",
        startTime: "",
        endTime: "",
        validTime: [],
        selectActivityType: "", //选择的类型
        activityStartTime: "",
        activityEndTime: ""
      },
      searchItems:[
        
      ],
      user: {},
      isDisabled: false,
      activityTypes: [
        { id: "", name: "全部" },
        { id: "3", name: "累计支付" },
        { id: "6", name: "满返" }
      ],
      statusList: [
        //状态 1:草稿 2:待审核 3:审核中 4:审核不通过 5:审核通过 99:已作废 ,
        { id: "", name: "全部" },
        { id: 1, name: "草稿" },
        { id: 2, name: "待审核" },
        { id: 3, name: "审核中" },
        { id: 4, name: "审核不通过" },
        { id: 5, name: "审核通过" },
        { id: 99, name: "已作废" }
      ],
      companyList:[],//显示的公司列表

      activityVisible:false,
      kanbanData:[],
      echartsData:[],
      // TODO: mydata
    }
  },

  created() {
    this.initPage()

  },

  methods: {
    // 初始化页面
    initPage() {
      let _department = this.$store.getters.department;
      _department ? (this.isDisabled = false) : (this.isDisabled = true);
      if (!_department) {
        this.user = JSON.parse(localStorage.getItem("USER"));
        this.search.branchId = this.user.branchId;
      }
    },
    
    setSearchItems(){
      let that = this
      this.searchItems = [
        {type:'Select',label:'业务主体',prop:'branchId', disabled:this.isDisabled, options:this.companyList,optionProps:{'label':'value','value':'id'},width:'170px',placeholder:'请选择'},
        {type:'Select',label:'活动类型',prop:'selectActivityType', options:this.activityTypes,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择',itemRender:function(h,params){
            return h('el-button',{
              attrs:{
                type: 'text',
                // disabled:'true'
              },
              style:{
                display:"inline-block",
                'margin-left':'20px',
                'color':'#06f',
              },
              on:{
                click:()=>that.selectActivity(params.row)
              },
              domProps:{innerHTML:'选择活动'}
            },
            
            )
          }
        },
        
        {type:'DateRange',label:'活动时间',props:['activityStartTime','activityEndTime'],width:'170px',placeholders:['开始日期','结束日期'],format:'yyyy-MM-dd',itemRender:function(h,params){
            return h('el-button',{
              attrs:{
                type: 'primary',
                // disabled:'true'
              },
              style:{
                display:"inline-block",
                'margin-right':'20px',
                'float':'right'
              },
              on:{
                click:()=>that.analyse(params.row)
              },
              domProps:{innerHTML:'开始分析'}
            },
            
            )
          }},

        {kanbanData:that.kanbanData,
          render:function(h,params){
            return h(kanban,
              {
                attrs:{
                  
                },
                props: {
                  kanbanData :params.row.kanbanData,
                  // isCreate:false
                },
                ref:'kanban'
              }
            )
          },
        },
      ]
    },
    // 选择活动
    selectActivity(row){
      this.activityVisible = true
      
    },
    // 开始分析
    analyse(row){
      // 请求数据
      setTimeout(() => {
        this.kanbanData = this.getKanBanData()
        this.echartsData = this.getEchartsData()
        this.setSearchItems()
        // 折线图数据传递到父组件
        this.update(this.echartsData)
      }, 500);
    },
    //获取看板数据
    getKanBanData(){
      return [
        {
          name:'用户',
          items:[
            {title:'领用总人数',des:'11188'},
            {title:'下单用户数',des:'11188'},
          ]
        },
        {
          name:'订单',
          items:[
            {title:'订单数',des:'11188'},
            {title:'下单用户数',des:'11188'},
          ]
        },
        {
          name:'优惠券',
          items:[
            {title:'领用总人数',des:'11188'},
            {title:'下单用户数',des:'11188'},
          ]
        },
        {
          name:'优惠券',
          items:[
            {title:'优惠券',des:'5500'},
            {title:'单均优惠',des:'34.4'},
            {title:'费率',des:'3.5%'},
          ]
        }
      ]
    },
    // 获取折线图数据
    getEchartsData(){
      return[
        {
          type:'休闲保健',
          data:[
            {
              index:0,
              time:'10-1',
              value:100
            },
            {
              index:1,
              time:'10-2',
              value:113
            },
            {
              index:2,
              time:'10-3',
              value:213
            },
            {
              index:3,
              time:'10-4',
              value:109
            },
            {
              index:4,
              time:'10-4',
              value:109
            },
            {
              index:5,
              time:'10-4',
              value:109
            },
          ]
        },
        {
          type:'酒类',
          data:[
            {
              index:0,
              time:'10-15',
              value:160
            },
            {
              index:1,
              time:'10-16',
              value:134
            },
            {
              index:2,
              time:'10-17',
              value:213
            }
          ]
        },
        {
          type:'xxss',
          data:[
            {
              index:0,
              time:'10-1',
              value:123
            },
            {
              index:1,
              time:'10-12',
              value:145
            },
            {
              index:2,
              time:'10-23',
              value:224
            },
            {
              index:3,
              time:'10-30',
              value:289
            },
          ]
        }
      ]
    }
    //TODO: myfunc

    
  },
  watch: {
      branchCompanyList(){
        // 数组转化一下，id需要是数字负责select显示的是数字不是对应的value
        this.companyList = []
        this.branchCompanyList.map((company)=>{
          this.companyList.push({ id: Number(company.id), value: company.value });
        })
        this.setSearchItems()
      }
    },
}
</script>

<style lang="scss" scoped>
.search_con{
  display: inline-block;
  // float: right;
}
</style>