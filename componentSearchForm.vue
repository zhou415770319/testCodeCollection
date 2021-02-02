<template>
  <div>
    <el-form :inline="inline?true:false" :size="size" :label-width="labelWidth">
      <template v-for="(item,index) in searchItems">
        <ex-slot v-if="item.render" :render="item.render" :row="item" :index="index" :key="item.prop"></ex-slot>
        <el-form-item v-if="!item.render" :label="item.label?item.label:''" :key="item.prop">
          <!-- 输入框 -->
          <el-input v-if="item.type==='Input'" :style="'width:'+item.width+';'" v-model="searchForm[item.prop]" :oninput="item.oninput?item.oninput:null"  :placeholder="item.placeholder?item.placeholder:''">
          </el-input>
          <!-- 下拉框 -->
          <el-select v-if="item.type==='Select'" :style="'width:'+item.width+';'" v-model="searchForm[item.prop]" :disabled="item.disabled?item.disabled:false" :placeholder="item.placeholder?item.placeholder:''" @change="item.change&&item.change(searchForm[item.prop])">
              <el-option v-for="op in item.options" :label="op[item.optionProps.label]" :value="op[item.optionProps.value]" :key="op[item.optionProps.value]"></el-option>
          </el-select>
          <!-- 级联选择器 -->
          <el-cascader v-if="item.type==='Cascader'" :style="'width:'+item.width+';'" :options="item.options" v-model="searchForm[item.prop]" :disabled="item.disabled?item.disabled:false" :placeholder="item.placeholder?item.placeholder:''" @change="item.change&&item.change(searchForm[item.prop])">
          </el-cascader>
          <!-- 时间 -->
          <el-time-select v-if="item.type==='Time'" :style="'width:'+item.width+';'" :placeholder="item.placeholder?item.placeholder:''" v-model="searchForm[item.prop]">
          </el-time-select>
          <!-- 日期 -->
          <el-date-picker v-if="item.type==='Date'" :style="'width:'+item.width+';'" :placeholder="item.placeholder?item.placeholder:''" v-model="searchForm[item.prop]" :value-format="item.format" >
          </el-date-picker>
          <!-- 日期时间 -->
          <el-date-picker v-if="item.type==='DateTime'" :style="'width:'+item.width+';'" :placeholder="item.placeholder?item.placeholder:''" type='datetime' v-model="searchForm[item.prop]" :disabled="item.disable && item.disable(searchForm[item.prop])" :value-format="item.format">
          </el-date-picker>
          <div v-if="item.type==='DateRange'" class="DateRangeCon">
            <el-date-picker :style="'width:'+item.width+';'" :placeholder="item.placeholders?item.placeholders[0]:''" v-model="searchForm[item.props[0]]" :value-format="item.format" :disabled="item.disabled?item.disabled:false">
            </el-date-picker>
            至
            <el-date-picker :style="'width:'+item.width+';'" :placeholder="item.placeholders?item.placeholders[1]:''" v-model="searchForm[item.props[1]]" :value-format="item.format" :disabled="item.disabled?item.disabled:false">
            </el-date-picker>
          </div>
          <el-date-picker v-if="item.type==='DateTimeRange'" :style="'width:'+item.width+';'" v-model="searchForm[item.prop]" @change="item.change && item.change(searchForm[item.prop])" @focus="item.focus && item.focus(searchForm[item.prop])" type="datetimerange"
            range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" :default-value="item.defaultValue?item.defaultValue:null"
            start-placeholder="点击选择时间" end-placeholder="点击选择时间" :picker-options="item.pickerOptions" :disabled="item.disabled?item.disabled:false">
          </el-date-picker>
          <!-- 单选 -->
          <el-radio-group v-if="item.type==='Radio'" v-model="searchForm[item.prop]">
              <el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
          </el-radio-group>
          <!-- 单选按钮 -->
          <el-radio-group v-if="item.type==='RadioButton'" v-model="searchForm[item.prop]" @change="item.change && item.change(searchForm[item.prop])">
              <el-radio-button v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio-button>
          </el-radio-group>
          <!-- 复选框 -->
          <el-checkbox-group v-if="item.type==='Checkbox'" v-model="searchForm[item.prop]" >
              <el-checkbox v-for="ch in item.checkboxs" :label="ch.value" :key="ch.value">{{ch.label}}</el-checkbox>
          </el-checkbox-group>
          <!-- 滑块 -->
          <!-- <el-slider v-if="item.type==='Slider'" v-model="searchForm[item.prop]"></el-slider> -->
          <!-- 开关 -->
          <el-switch v-if="item.type==='Switch'" v-model="searchForm[item.prop]" ></el-switch>
          <ex-item-slot v-if="item.itemRender" :render="item.itemRender" :row="item" :index="index" :key="item.prop" />
        </el-form-item>
      </template>
      <slot name="search"></slot>
    </el-form>
  </div>
</template>

<script>
// 自定义内容的组件
var exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    // column: {
    //   type: Object,
    //   default: null
    // }
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    }
    // if (data.props.column) params.column = data.props.column
    return data.props.render(h, params)
  }
}
// 自定义内容的组件
var exItemSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    // column: {
    //   type: Object,
    //   default: null
    // }
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    }
    // if (data.props.column) params.column = data.props.column
    return data.props.render(h, params)
  }
}
export default {
  props:{
    //默认参数
    size:{
      type:String,
      default: "medium",
    },
    labelWidth:{
      type:String,
      default:""
    },
    searchItems:{
        type:Array,
        default:function(){
          return []
        }
    },
    searchForm:{
        type:Object,
        default:function(){
          return {}
        }
    },
    inline:{
      type:Boolean,
      default:true
    }
  },
  components:{
    exSlot,
    exItemSlot
  },
  methods: {
    getForms(){
      return this.searchForm
    }
  },
  // watch: {
  //   searchItems(val) {
  //     debugger
  //     if (val&&val.length>0) {
  //       this.searchItems = val
  //     }
  //   }
  // },
}
</script>

<style lang="scss">
  .DateRangeCon{
    display: inline-block;
  }
</style>