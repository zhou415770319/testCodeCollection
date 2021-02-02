<template>
  <div>
    <searchForm :searchItems="searchItems" :searchForm="search">
      <div slot="search" class="search_con">
        <slot name="search"></slot>
      </div>
    </searchForm>
  </div>
</template>

<script>
import { queryIntegralList, operatorIntegral } from "@/api/integral";
import searchForm from "@/views/components/componentSearchForm"
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
    searchForm
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
      this.searchItems = [
        {type:'Select',label:'分公司',prop:'branchId', disabled:this.isDisabled, options:this.companyList,optionProps:{'label':'value','value':'id'},width:'170px',placeholder:'请选择'},
        {type:'Select',label:'客姿类型',prop:'selectActivityType', options:this.activityTypes,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择'},
        {type:'Select',label:'活动状态',prop:'activityStatus', options:this.statusList,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择'},
        {type:'Input',label:'套餐名称',prop:'activityName',width:'170px',placeholder:'在此输入文字'},
        {type:'Input',label:'套餐ID',prop:'id',width:'170px',placeholder:'在此输入数字'},
        {type:'DateRange',label:'活动周期',props:['activityStartTime','activityEndTime'],width:'170px',placeholders:['开始日期','结束日期'],format:'yyyy-MM-dd'},
      ]
    },

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