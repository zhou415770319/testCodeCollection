<template>
    
  <div :class="className" :id="id" class="charts"></div>
      
</template>

<script>
import echarts from 'echarts'

import {options} from './default'
export default {
  props: {
    data:{
      type:Object,
      default:function(){
        return {}
      }
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    
  },
  components:{
  },
  data() {
    return {
      legendData:[],//显示的种类
      series:[],//数据
      xAxisData:[],//x轴
      tooltipFormatter:Function,//悬浮框显示
      chartCon:null,
      chart:null,
    }
  },
  created() {

    
  },
  mounted() {
    this.chartCon = document.getElementById(this.id)
    this.chart = echarts.init(document.getElementById(this.id))
    
    this.initChart()
  },
  
  watch: {
    data:function(){
      console.log(JSON.stringify(this.data))
      this.$nextTick(()=>{
      
        if (this.data) {
          this.initChart()
          
        }

      })
    }
  },
  
  methods: {
    
    
    initChart() {
      this.chart.clear();
      if (this.data.series&&this.data.series.length>0) {
        // this.chartCon.dispose()
        // let myOptions = Object.assign(options, {})
        let myOptions = JSON.parse(JSON.stringify(options))
        myOptions.title.text = this.data.title
        if (this.data.echartsType&&this.data.echartsType != 'bar') {
          myOptions.tooltip.formatter = this.data.tooltipFormatter
          myOptions.tooltip.backgroundColor = "#fff"
          
        }else{
          delete myOptions.tooltip.formatter
          delete myOptions.tooltip
        }
        if (this.data.echartsType&&this.data.echartsType == 'bar') {
          myOptions.xAxis[0].boundaryGap = true
          myOptions.xAxis[0].axisLabel.interval = 0
          myOptions.xAxis[0].axisLabel.rotate = -15
          
        }else{
          myOptions.xAxis[0].boundaryGap = false
          // myOptions.xAxis[0].axisLabel = null
          myOptions.xAxis[0].axisLabel.interval = 'auto'
          myOptions.xAxis[0].axisLabel.rotate = 0
        }
        if (this.data.isShowX) {
          myOptions.xAxis[0].axisLabel.show = true
        }else{
          myOptions.xAxis[0].axisLabel.show = false
        }
        if (this.data.echartsType&&this.data.echartsType == 'bar') {
          // 柱状图
          myOptions.legend.data = []
          myOptions.legend.tooltip.show = false

          myOptions.xAxis[0].data = this.data.legendData
        }else{
          // 折线图
          myOptions.legend.data = this.data.legendData
          myOptions.legend.tooltip.show = true
          myOptions.legend.tooltip.formatter = this.legendTooltipFormatter
          myOptions.legend.formatter = this.legendFormatter

          myOptions.xAxis[0].data = this.data.xAxisData

        }
        // this.data.series.markLine.data=[{ type: 'average', name: '平均值' }]
      
        myOptions.series = this.data.series
        
        this.$nextTick(()=>{
          this.chart.setOption(myOptions)
        })  
      }else{

      }
    },
    legendTooltipFormatter(para){
      let temstr = ''
      if (para) {
        console.log(JSON.stringify(para.name)+"---->")
        temstr+='<div style="background-color:#fff;color:#333333;fontSize:10px;padding:11px;">'
        
        temstr+='<p class="tooltip-title" style="margin:0;padding:0;">'
        +para.name
        +'</p>'
        temstr+='</div>'
      }
      return temstr
    },
    legendFormatter(name){
      let temstr = ""
      if (name&&name.length>4) {
        temstr = name.substring(0,4)+"…"
      }else{
        temstr = name
      }
      return temstr
    }
  }
}
</script>
<style lang="scss" scoped>
  .charts{
    width: 100%;
    height: 100%;
  }
</style>