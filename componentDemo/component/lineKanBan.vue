<template>
  <div class="kanban">
    <el-row :gutter="10">
        <el-col  :span="6" v-for="(item, index) in kanbanData" :key="index">
          <div class="kanBanItem">
            <span>{{item.name}}</span>
            
              <div v-for="(info,i) in item.items" :key="i">
                <span>{{info.title}}</span>
                <span>{{info.des}}</span>
              </div>
            
          </div>
          
        </el-col>
    </el-row>
    
  </div>
</template>

<script>
export default {
  props:{
    kanbanData:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  data() {
    return {
      
    }
  },
  watch: {
    // kanbanData(val){
    //   this.kanbanData
    //   debugger
    // }
  },
}
</script>

<style lang="scss">
  .kanban{
    width: 100%;
    height: 100px;
  }
  .kanBanItem{
    height: 100px;
    background-color: aqua;
  }
</style>