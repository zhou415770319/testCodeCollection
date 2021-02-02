<template>
  <div>
    <template v-for="(sections,i) in items">
      <div v-if="!sections.isHidden" :key="sections.sectionTitle">
        <div :class="i!=1&&sections.sectionClass?'hj-form-title '+sections.sectionClass:i!=1?'hj-form-title':sections.sectionClass?sections.sectionClass:'hj-form-title'">
          {{sections.sectionTitle}}
        </div>
        <template v-for="(item,index) in sections.formItems" >
            <ex-slot v-if="item.render" :render="item.render" :row="item" :index="index" :key="item.prop"/>
            <div class="details_item_content" v-else :key="item.prop">
                <span class="details_item_title" :style="item.label_width?'width:'+item.label_width+';':null">{{item.label}}</span>
                <img v-if="item.type == 'Upload'" :src="data[item.prop]" />
                <span v-else class="details_item_des">{{getDes(item)}}</span>
            </div>
        </template>
      </div>
    </template>
    <!-- 审核列表 -->
    <auditProcessTable class="audit_con" :auditData="data.auditProcess?data.auditProcess:[]"></auditProcessTable>
  </div>
</template>

<script>
import auditProcessTable from '@/views/components/auditProcessTable' // 审核信息列表

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
    auditProcessTable,
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
    getDes(item){
      let temStr = ''
      if (item.type == 'Select') {
        
      }else{
        temStr = this.data[item.prop]
      }
      return temStr
    },
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
  },
}
</script>

<style lang="scss" scoped>
.audit_con{
  margin-top: 20px !important;
}
.hj-form-title{
  margin-top: 20px;
}
.details_item_content{
  height: 16px;
  line-height: 16px;
  margin-top: 5px;
  margin-bottom: 5px;
  .details_item_title{
    display: inline-block;
    font-size: 12px;
    color: #333;
    text-align: right;
  }
  .details_item_des{
    display: inline-block;
    font-size: 12px;
    color: #666;
    margin-left: 10px;
  }
}
</style>