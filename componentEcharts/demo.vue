<template>
  <div>
    <div><span @click="change(1)">折线图</span>    <span  @click="change(2)">柱状图</span></div>
    <div class="echarts_con">
    <echarts ref="echarts" :data="echartsData" id="selectEcharts">
    </echarts>

    </div>
  </div>
</template>
<script>
import echarts from '@/views/components/componentEcharts/index'

export default {
  name: "timeLimitSaleList",
  data() {
    return {
      echartsData:{},
      echartsList:[],
      echartsType:'line',
      colors:[
        'rgb(38,188,213)',
        'rgb(254,67,101)',
        'rgb(255,232,130)',
        'rgb(252,157,154)',
        'rgb(62,188,202)',
        'rgb(148,41,35)',
      ]
      //   mydata
    };
  },
  components: {
    echarts,
  },
  created() {
  },
  methods: {
    change(val){
      if (val == 1) {
        this.echartsType = 'line'
      }else{
        this.echartsType = 'bar'
      
      }
      this.getEchartsData()
    },
    getEchartsData(){
      this.echartsList=[
        {
          title:'活动1',
          data:[
            {
              valueX:'10-1',
              valueY:100,
              name:'休闲保健'
            },
            {
              valueX:'10-2',
              valueY:132,
              name:'米面粮油'
            },
            {
              valueX:'10-3',
              valueY:1001,
              name:'饮料'
            },
          ]
        },
        {
          title:'活动2',
          data:[
            {
              valueX:'10-1',
              valueY:180,
              name:'休闲保健'
            },
            {
              valueX:'10-2',
              valueY:183,
              name:'米面粮油'
            },
            {
              valueX:'10-3',
              valueY:1091,
              name:'饮料'
            },
            
          ]
        }
      ]
      this.setEcharts(this.echartsList)
    },
    setEcharts(val){
      let that = this
      this.echartsData = []
      let legendData = []
      let series = []
      let xAxisData = []
      
      if (val&&val.length>0) {
        let maxlength = 0  //x轴数据 最大长度
        let maxlengthIndex = 0  //x轴数据 最大长度 对应的index
        if (that.echartsType == 'bar') { //设置柱状图
          let temVal = []
          let temList = []
          let temListX = []
          val.forEach((item,index)=>{
            
            
            // info.name = item.title
            let itemList = []
            item.data.forEach((info11,i)=>{
              
                
                temList.push(info11.valueY)
                temListX.push(info11.name)
              
            })
            
            // if (index ==0) {
              
              legendData.push(item.title)
              // series.push(info)
            // }
           })
           let info = {
              name: legendData[i],
              type: that.echartsType,
              itemStyle: {
                normal: {
                  show:true,
                  color: this.colors[0],
                  borderColor: 'rgba(0,136,212,0.2)',
                  borderWidth: 5

                }
              },
              data: []
            }
            info.data =temList
            series[0] = info
          //添加x轴数据
          // val[0].data.forEach((info)=>{
          //   xAxisData.push(info.valueX)
          // })
          xAxisData = temListX
  //         series=[
  //   {
  //     "data" : [
  //       100,180
  //     ],
  //     "type" : "bar",
  //     "itemStyle" : {
  //       "normal" : {
  //         "color" : "rgb(38,188,213)",
  //         "borderColor" : "rgba(0,136,212,0.2)",
  //         "borderWidth" : 5
  //       }
  //     }
  //   }
  // ]
          // temVal.push(val[0])
          // val = temVal
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
            info.name = item.title
            let temList = []
            item.data.forEach((info)=>{
              info.value = info.valueY
              temList.push(info)
            })
            if (item.data) {
              maxlengthIndex = item.data.length >maxlength?index:maxlengthIndex
              maxlength = item.data.length >maxlength?item.data.length:maxlength
            }
            
            info.data = temList
            legendData.push(item.title)
            series.push(info)
          })
          //添加x轴数据
          // if (this.pageType == pageTypeObj.userActivityEA) {
            val[maxlengthIndex].data.forEach((info,index)=>{
              xAxisData.push(info.valueX+'')
            })
            
          // }
        }
        
      }
      this.echartsData = {
        // title:this.getEchartsTitle(false),
        legendData:legendData,//显示的种类
        series:series,//数据
        xAxisData:xAxisData,//x轴
        echartsType:this.echartsType//
      }
      this.echartsData.isShowX = true
      if (that.echartsType != 'bar') {
        that.echartsData.tooltipFormatter = that.tooltipFormatterFunc
      }else{
        that.echartsData.tooltipFormatter = null
      }
      console.log(JSON.stringify(this.echartsData))
      
    },
    // myfunc
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .echarts_con{
    width: 100%;
    height: 500px;
    margin-bottom: 30px;
  }
</style>