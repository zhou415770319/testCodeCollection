<template>
  <div>
    <el-form :size="size" ref="form" :label-width="label_width" :model="data" label-position="right" :rules="rules">
      <template v-for="(sections,i) in items">
        
        <div v-if="!sections.isHidden" :key="sections.sectionTitle">
          <div v-if="!sections.titleHidden" :class="i!=1&&sections.sectionClass?'hj-form-title '+sections.sectionClass:i!=1?'hj-form-title':sections.sectionClass?sections.sectionClass:'hj-form-title'" >
            {{sections.sectionTitle}}
          </div>
          <template v-for="(item,index) in sections.formItems">
            <ex-slot v-if="item.render" :render="item.render" :row="item" :index="index" :key="item.prop" />
            <el-form-item v-else-if="!item.isHidden" :label="item.label" :key="item.prop" :prop="item.prop" :rules="rules&&rules[item.prop]?rules[item.prop]:null" :label-width="item.label_width?item.label_width:null">
              <!-- 文字显示 -->
              <div v-if="item.type==='Text'" :style="'width:'+item.width+';'">{{item.textHandle?item.textHandle(data[item.prop]):data[item.prop]}}</div>
              <!-- 输入框 -->
              <el-input v-if="item.type==='Input'" :style="'width:'+item.width+';'" v-model="data[item.prop]" :placeholder="item.placeholder?item.placeholder:''" :oninput="item.oninput?item.oninput:null"  @change="item.change &&item.change(data[item.prop])">
              </el-input>
              <span v-if="item.type==='Input' &&item.maxlength">
                {{activityNameLength(data[item.prop])}}/{{item.maxlength}}
              </span>
              <span v-if="item.type==='Input' &&item.unit">
                {{item.unit}}
              </span>
              <!-- 规则输入框 -->
              <el-input v-if="item.type==='Textarea'" :style="'width:'+(item.width?item.width:'500px')+';'" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" v-model="data[item.prop]" :placeholder="item.placeholder?item.placeholder:''" :maxlength="item.maxlength?item.maxlength:null">

              </el-input>
              <span v-if="item.type==='Textarea' &&item.maxlength">
                {{data[item.prop].length}}/{{item.maxlength}}
              </span>
              <!-- 下拉框 -->
              <el-select v-if="item.type==='Select'" :style="'width:'+item.width+';'" v-model="data[item.prop]" :disabled="item.disabled?item.disabled:false" :placeholder="item.placeholder?item.placeholder:''" @change="item.change &&item.change(data[item.prop])">
                <template v-for="op in item.options">
                  <el-option  v-if="!op.isHidden" :label="item.optionProps?op[item.optionProps.label]:op.label" :value="item.optionProps?Number(op[item.optionProps.value]):Number(op.value)" :key="item.optionProps?op[item.optionProps.value]:op.value"></el-option>
                </template>
              </el-select>
              <!-- 时间 -->
              <el-time-select v-if="item.type==='Time'" :style="'width:'+item.width+';'" :placeholder="item.placeholder?item.placeholder:''" v-model="data[item.prop]">
              </el-time-select>
              <!-- 日期 -->
              <el-date-picker v-if="item.type==='Date'" :style="'width:'+item.width+';'" :placeholder="item.placeholder?item.placeholder:''" v-model="data[item.prop]" :value-format="item.format" >
              </el-date-picker>
              <!-- 日期时间 -->
              <el-date-picker v-if="item.type==='DateTime'" :style="'width:'+item.width+';'" :placeholder="item.placeholder?item.placeholder:''" type='datetime' v-model="data[item.prop]" :disabled="item.disable && item.disable(data[item.prop])" :value-format="item.format">
              </el-date-picker>
              <div v-if="item.type==='DateRange'">
                <el-date-picker :style="'width:'+item.width+';'" :placeholder="item.placeholders?item.placeholders[0]:''" v-model="data[item.props[0]]" :value-format="item.format" :disabled="item.disabled?item.disabled:false">
                </el-date-picker>
                至
                <el-date-picker :style="'width:'+item.width+';'" :placeholder="item.placeholders?item.placeholders[1]:''" v-model="data[item.props[1]]" :value-format="item.format" :disabled="item.disabled?item.disabled:false">
                </el-date-picker>
              </div>
              <el-date-picker v-if="item.type==='DateTimeRange'" v-model="data[item.prop]" @change="item.change && item.change(data[item.prop])" type="datetimerange"
                range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
                start-placeholder="点击选择时间" end-placeholder="点击选择时间">
              </el-date-picker>
              <!-- 单选 -->
              <el-radio-group v-if="item.type==='Radio'" v-model="data[item.prop]" @change="item.change && item.change(data[item.prop])">
                  <el-radio v-for="ra in item.radios" :label="Number(ra.label)" :key="ra.value">
                    {{ra.value}}
                  </el-radio>
              </el-radio-group>
              <!-- 单选按钮 -->
              <el-radio-group v-if="item.type==='RadioButton'" v-model="data[item.prop]" @change="item.change && item.change(data[item.prop])">
                  <el-radio-button v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio-button>
              </el-radio-group>
              <!-- 复选框 -->
              <el-checkbox-group v-if="item.type==='Checkbox'" v-model="data[item.prop]" >
                  <el-checkbox v-for="ch in item.checkboxs" :label="item.checkboxsProps?ch[item.checkboxsProps.value]:ch.value" :key="item.checkboxsProps?ch[item.checkboxsProps.value]:ch.value">{{item.checkboxsProps?ch[item.checkboxsProps.label]:ch.label}}</el-checkbox>
              </el-checkbox-group>
              <!-- 滑块 -->
              <!-- <el-slider v-if="item.type==='Slider'" v-model="data[item.prop]"></el-slider> -->
              <!-- 开关 -->
              <el-switch v-if="item.type==='Switch'" v-model="data[item.prop]" ></el-switch>

              <!-- 上传图片 -->
              <el-upload v-if="item.type==='Upload'" :style="'width:'+item.width+';'" style="display:inline-block"
                list-type="picture-card"
                :action="item.fileUrl"
                :show-file-list="false"
                :on-success="handleImageScucess"
                :before-upload="item.handleBeforeUpload?item.handleBeforeUpload:handleBeforeUpload"
                accept=".jpg,.jpeg,.png"
                name="imageFile"
                :multiple="false">
                <el-input v-model="data.img" v-show="false"></el-input>
                <img v-if="data.img" :src="data.img" width="200px" height="200px" />
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              
            </el-form-item>
            
          </template>
        </div>
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
export default {
  props:{
    //默认参数
    size:{
      type:String,
      default: "medium",
    },
    label_width:{
      type:String,
      default:"80px"
    },
    items:{
        type:Array,
        default:function(){
          return []
        }
    },
    data:{
        type:Object,
        default:function(){
          return {}
        }
    },
    rules:{
        type:Object,
        default:function(){
          return {}
        }
    }
  },
  components:{
    exSlot,
  },
  computed: {
    slots(){
      console.log("componentTable----"+this.$slots)
      return this.$slots
    }
  },
  mounted() {
    console.log(JSON.stringify(this.data))
    
  },
  methods: {

    validate(func){
      
      this.$refs.form.validate((valid)=>{
        func(valid)
      })
    },
    activityNameLength(str){
      let len = 0
      if (this.strlen(str)>0) {
        len = parseInt(this.strlen(str)/2)
      }
      return len

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
    handleBeforeUpload(file) {
      const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg' ||
      file.type == 'image/JPEG' || file.type == 'image/JPG' || file.type == 'image/PNG'
      const isLt100 = file.size / 1024 < 120
      if (!isJPG) {
        this.$message({ message: '上传的图片只能是 JPEG/JPG/PNG格式！', type: 'warning'})
        return false
      }
      if (!isLt100) {
        this.$message({ message: '上传的图片大小不能超过 120k！', type: 'warning'})
        return false
      }
      let _this = this
      const _URL = window.URL || window.webkitURL
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          let valid = this.width == 800 && this.height == 800
          if(!valid){
            _this.$message({ message: '请上传800*800px的图片！', type: 'warning'})
            reject()
          }else{
            resolve()
          }
        }
      })
    },
    //上传成功
    handleImageScucess(res, file, fileList) {
      const domain = res && _.get(res, 'content.domain') || ''
      const backdropImgUrl = res && _.get(res, 'content.imageUrl') || ''
      this.data.img =  domain + backdropImgUrl
    },
  },
}
</script>

<style lang="scss" scoped>
  .hj-form-title{
    margin-top: 20px;
  }
  .el-form-item{
    margin-top: 20px;
  }

</style>