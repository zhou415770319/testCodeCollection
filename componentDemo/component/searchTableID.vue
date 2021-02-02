<template>
  <div>
    <el-tooltip placement="right" effect="light">
      <div slot="content" class="temName-box">
        <p class="template-name">券模版信息</p>
        <p>
          <span class="temName-title">券模版ID：</span>
          <span class="range-box" v-if="data.id">{{ data.id?data.id:"" }}</span>
        </p>
        <p>
          <span class="temName-title">券类型：</span>
          <span class="range-box" v-if="data.templateVos">{{ data.templateVos?types[data.templateVos[0].type]:"" }}</span>
        </p>
        <p>
          <span class="temName-title">面值：</span>
          <span class="range-box" v-if="data.templateVos">{{ data.templateVos?data.templateVos[0].value:"" }}</span>
        </p>
        <p>
          <span class="temName-title">所需积分：</span>
          <span class="range-box" v-if="data.integral">{{ data.integral?data.integral:"" }}</span>
        </p>
        <p>
          <span class="temName-title">剩余数量：</span>
          <span class="range-box" v-if="data.surplusNum">{{ data.surplusNum?data.surplusNum:"" }}</span>
        </p>
      </div>
      <el-button type="text" >{{ data.id }}</el-button>
    </el-tooltip>

  </div>
</template>

<script>
export default {
  props:{
    data:{
      type:Object,
      default:{}
    }
  },
  created() {
     
  },
}
</script>