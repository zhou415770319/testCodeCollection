<template>
  <h-container class="hj-advertisement-list">
    <div slot="center">
      <div class="header-con">
        
        <lineSearchForm ref="form" :update="formUpdate" :branchCompanyList="branchCompanyList">
          
        </lineSearchForm>
      </div>
      <div class="select_con">
        <searchForm ref="selectForm" :searchItems="searchItems" :searchForm="search" :labelWidth="'100px'" :inline="true">
          <div slot="search" class="search_con">
            <slot name="search"></slot>
          </div>
        </searchForm>
      </div>
      <div class="echarts_con">

        <echarts ref="echarts" :data="echartsData">

        </echarts>
      </div>
      
    </div>
  </h-container>
</template>

<script>
import { queryCompanyList } from "@/api/label";

import timeLimitSaleTable from "./component/searchTable"
import lineSearchForm from "./component/lineSearchForm";
import echarts from '../componentEcharts/index'
import searchForm from "@/views/components/componentSearchForm"

export default {
  name: "timeLimitSaleList",
  data() {
    return {
      branchCompanyList: [], //分公司
      companyObj: {}, //分公司
      
      user:{},
      listData: [], //页面列表数据
      total: "",
      timeVisible: false,
      selection:true, //支持多选
      echartsData:{},
      echartsList:[],
      legendData:[],//显示的种类
      series:[],//数据
      xAxisData:[],//x轴
      tooltipFormatter:Function,//悬浮框显示
      search: {
        type:'1',
        seriesType:'0',
        timeType:'0',
        targetType:'0',
        timeType:'0',
      },
      searchItems:[
        
      ],
      seriesTypes:[
        
      ],
      types:[
        
      ],
      tagets:[
        
      ],
      timesType:[
        
      ],
      colors:[
        'rgb(38,188,213)',
        'rgb(254,67,101)',
        'rgb(255,232,130)',
        'rgb(252,157,154)',
        'rgb(62,188,202)',
        'rgb(148,41,35)',
      ],
      echartsType:'line'
      //   mydata
    };
  },
  components: {
    lineSearchForm, 
    timeLimitSaleTable,
    echarts,
    searchForm
  },
  created() {
    let _department = this.$store.getters.department;
    _department ? (this.isDisabled = false) : (this.isDisabled = true);
    this.user = JSON.parse(localStorage.getItem("USER"));
    if (!_department) {
      this.search.branchId = this.user.branchId;
    }
    // 获取公司信息
    this.getBranchCompany();
    // 获取选择项
    this.getTypes();
  },
  methods: {
    
    // 获取分公司
    getBranchCompany() {
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
      });
    },

    getTypes(){
      // 请求数据
      setTimeout(() => {

        this.seriesTypes=[
          {id:'0',name:'折线图'},
          {id:'1',name:'柱状图'},
        ];
        this.types=[
          {id:'0',name:'不分组'},
          {id:'1',name:'按一级品类'},
          {id:'2',name:'按一级品类(非饮)'},
          {id:'3',name:'按品牌'},
          {id:'4',name:'按商品'},
        ]
        this.tagets=[
          {id:'0',name:'所有指标'},
          {id:'1',name:'订单金额'},
          {id:'2',name:'客单金额'},
          {id:'3',name:'订单数'},
          {id:'4',name:'优惠金额'},
        ];
        this.timesType=[
          {id:'0',name:'按天'},
          {id:'1',name:'按周'},
          {id:'2',name:'累计'},
        ];
        
      }, 500);
    },
    
    // 初始化后更新数据
    formUpdate(val) {
      this.echartsList = val
      this.setEcharts(val)
      this.setSearchItems()
    },

    setEcharts(val){
      let that = this
      if (val&&val.length>0) {
        this.legendData = []
        this.series = []
        this.xAxisData = []
        let maxlength = 0  //x轴数据 最大长度
        let maxlengthIndex = 0  //x轴数据 最大长度 对应的index
        if (that.echartsType == 'bar') { //设置柱状图
          val.forEach((item,index)=>{
            if (index==0) {
              
              let info = {
                name: '',
                type: that.echartsType,
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color:this.colors[index]
                  }
                },
                
                itemStyle: {
                  normal: {
                    color: this.colors[index],
                    borderColor: 'rgba(0,136,212,0.2)',
                    borderWidth: 5
    
                  }
                },
                data: []
              }
              info.name = item.type
              let temList = []
              item.data.forEach((info)=>{
                temList.push(info)
              })
              if (item.data) {
                maxlengthIndex = item.data.length >maxlength?index:maxlengthIndex
                maxlength = item.data.length >maxlength?item.data.length:maxlength
              }
              
              info.data = temList
              this.legendData.push(item.type)
              this.series.push(info)
            }
          })
        }else{

          val.forEach((item,index)=>{
            let info = {
              name: '',
              type: that.echartsType,
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1,
                  color:this.colors[index]
                }
              },
              
              itemStyle: {
                normal: {
                  color: this.colors[index],
                  borderColor: 'rgba(0,136,212,0.2)',
                  borderWidth: 5
  
                }
              },
              data: []
            }
            info.name = item.type
            let temList = []
            item.data.forEach((info)=>{
              temList.push(info)
            })
            if (item.data) {
              maxlengthIndex = item.data.length >maxlength?index:maxlengthIndex
              maxlength = item.data.length >maxlength?item.data.length:maxlength
            }
            
            info.data = temList
            this.legendData.push(item.type)
            this.series.push(info)
          })
        }
        //添加x轴数据
        val[maxlengthIndex].data.forEach((info)=>{
          this.xAxisData.push(info.index)
        })
      }
      this.echartsData = {
        title:'按一级分类-订单金额',
        legendData:this.legendData,//显示的种类
        series:this.series,//数据
        xAxisData:this.xAxisData,//x轴
        tooltipFormatter:this.tooltipFormatterFunc
      }
    },
    tooltipFormatterFunc(param) {
      
      let temstr = ''
      
      if (param&&param.length>0) {
        
        param.forEach((item,index)=>{
          temstr+=item.seriesName+'<br/>'
          temstr+='时间'+item.data.time+'金额'+item.data.value
          if (index != param.length-1) {
            temstr+='<br/>'
          }
        })
        
      }
      return temstr
    },
    setSearchItems(){
      let that = this
      //TODO: prop ,options需重新设置
      
      that.searchItems = [
        {type:'Select', prop:'seriesType', options:that.seriesTypes,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择',change:that.seriesTypeChange},
        {type:'Select',prop:'type', options:that.types,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择'
        },
        {type:'Select',prop:'targetType', options:that.tagets,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择'
        },
        {type:'Select',prop:'timeType', options:that.timesType,optionProps:{'label':'name','value':'id'},width:'170px',placeholder:'请选择'
        },
      ]
      
    },
    //折线图/柱状图选择
    seriesTypeChange(val){
      this.series = []
      if (val == 0) {//折线图
        this.echartsType = 'line'
      }else if (val == 1) {//柱状图
        this.echartsType = 'bar'
      }
      this.setEcharts(this.echartsList)
    }
    // myfunc
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.echarts_con{
  width: 100%;
  height: 500px;
}
.width170 {
  width: 170px;
}
.width260 {
  width: 300px;
}
.width176 {
  width: 176px;
}

.dialog-footer {
  height: 50px !important;
}
.top20 {
  margin-top: 20px;
}
/deep/ .el-dialog .el-dialog__body {
  padding-bottom: 10px !important;
}
.table-top-btn {
  margin-bottom: 20px;
}
.marginT20 {
  margin-top: 20px;
}
.el-message-box__headerbtn .el-message-box__close {
  color: #fff;
}
.page-wrap {
  text-align: right;
}
.dialog-text-box {
  text-align: center;
  line-height: 70px;
}

.operate-dialog {
  span {
    height: 22px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #666666;
    line-height: 19px;
    display: block;
    text-align: center;
  }
  .dialog-bottom {
    margin-bottom: 20px;
  }
}
</style>
