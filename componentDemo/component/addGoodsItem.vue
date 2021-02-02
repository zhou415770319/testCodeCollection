<template>
  <div>
    <div>
      <el-button type="primary" size="medium" @click="btnClick(clickType.configProduct)">配置商品
      </el-button>
      <el-button type="primary" size="medium" class="margin-l10" @click="bacthRemoveGoods">批量配置促销费用</el-button>
      <el-upload class="margin-l10" action="string" :file-list="fileList" name="file"
        accept=".xls,.xlsx" :on-success="handleUploadSuccess" :on-error="handleUploadError"
        :show-file-list="false" :http-request="(param)=>importGoodsFn(param,0)"
        style="display: inline-block">
        <el-button size="medium" type="primary">导入商品</el-button>
      </el-upload>
      <el-button class="margin-l10" type="primary" size="medium">
        <a :href="templateUrl">下载模板</a>
      </el-button>
    </div>
    <!-- <goodsTable
      :tableData="createForm.goodsVos"
      @handelMove="moveGoods"
      @handelSelection="handleSelectionChange"
    >
    </goodsTable> -->

  </div>
</template>
<script>
import goodsTable from "../../../discountCoupon/couponTemp/tableList/goodsTable"; //商品列表

export default {
  props:{
    createForm:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  components:{
    goodsTable
  },
  data() {
    return {
      
    }
  },
}
</script>

<style lang="scss">
  .margin-l10{
    margin-left: 10px;
  }
</style>