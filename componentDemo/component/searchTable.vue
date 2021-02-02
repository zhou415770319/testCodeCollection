<template>
  <div>

    <componentTable ref="componentTable" :data="listData" :items="colums" :loading="loading" :selection="selection">
      
    </componentTable>
    <el-pagination class="page-wrap top20" v-if="total > 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next,jumper" :total="total" :background="true">
    </el-pagination>

    <el-dialog :title="dialogTitle + '确认'" :visible.sync="dialogVisible" class="operate-dialog" width="410px" center>
        <div v-if="type == 4" class="align-center f14">
          <span>您确定要删除本项内容么?</span>
          <span class="dialog-bottom">删除后将清空本项目数据！</span>
          <span>点击“确定”执行删除操作</span>
          <span>点击“取消”终止删除操作</span>
        </div>
        <div v-else-if="type == 5" class="align-center f14">
          <span>您确定要作废本项内容么？</span>
          <span class="dialog-bottom">作废过程不可逆，且未完成的流程将会全部终止！</span>
          <span>点击“确定”执行作废操作</span>
          <span>点击“取消”终止作废操作</span>
        </div>
        <div v-else-if="type == 6" class="align-center f14">
          <span>您确定要停用本项内容么？</span>
          <span class="dialog-bottom">停用后将不会影响已经发生的业务流程！</span>
          <span>点击“确定”执行停用操作</span>
          <span>点击“取消”终止停用操作</span>
        </div>
        <div v-else-if="type == 7" class="align-center f14">
          <span>您确定要启用本项内容么？</span>
          <span class="dialog-bottom">启用后本项审核将跳往下一节点或者通过本项审核！</span>
          <span>点击“确定”执行启用操作</span>
          <span>点击“取消”终止启用操作</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="medium" type="primary" class="submit-btn" @click="operator">确 定</el-button>
          <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import componentTable from "@/views/components/componentTable"
import { operatorIntegral} from "@/api/integral";
import searchTableID from "./searchTableID"
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    total:"",
    update:Function,
    selection:Boolean,
  },
  components:{
    componentTable,
    searchTableID
  },
  data() {
    return {
      listData: [],
      loading:false,
      status: {
        0: "全部",
        1: "草稿",
        2: "待审核",
        3: "审核中",
        4: "审核不通过",
        5: "审核通过",
        10:"停用",
        99: "已作废"
      },
      pageNum: 1,
      pageSize: 10,
      showTable:true,
      dialogVisible: false, //弹框提示
      dialogTitle: "",
      type:"",
      id:"",
      colums:[]
    }

  },
  created() {
    this.initPage()
  },
  
  watch: {
    data(){
      this.listData = this.data
    }
  },
  methods: {

    initPage(){
      let that = this
      this.colums = [
        {
          label:"活动ID",
          width:"60",
          render:function(h,params){
            return h(searchTableID,{
              props:{
                data:params.row
              }
            })
          },
        },
        {
          label:"分公司",
          prop:"branchName",
          width:"180",
        },
        
        {
          label:"客姿类型",
          width:"120",
          render:function(h,params){
            return h('span',that.status[params.row['activityStatus']])
          },
        },
        
        {
          label:"活动时间",
          prop:"startTime",
          render:function(h,params){
            return h('div',
            {class:{activityTime:true}},
            [
              h('span',params.row['startTime']),
              h('span',"~"+params.row['endTime'])
            ])
          },
        },
        
        {
          label:"操作",
          width:"220",
          fixed:'right',
          render:function(h,params){
            let btnList = []
            if (params.row.activityStatus != 1) {
              btnList =[
                h('el-button',
                {
                  attrs: {
                    type: 'text'
                  }, 
                  on:{
                    click:()=>that.viewFn(params.row)
                  },
                  domProps:{innerHTML:'详情'}
                }),
                h('el-button',
                {
                  attrs: {
                    type: 'text'
                  }, 
                  on:{
                    click:()=>that.opratorFn(params.row,'copy')
                  },
                  domProps:{innerHTML:'复制'}
                }),
                h('el-button',
                {
                  attrs: {
                    type: 'text'
                  }, 
                  on:{
                    click:()=>that.opratorFn(params.row, 'edit')
                  },
                  domProps:{innerHTML:'费用单'}
                }),
              ]
            }else{
              [
                h('el-button',
                {
                  attrs: {
                    type: 'text'
                  }, 
                  on:{
                    click:()=>that.opratorFn(params.row, 'edit')
                  },
                  domProps:{innerHTML:'费用单'}
                }),
                
              ]
            }
            if (params.row.activityStatus == 5 || params.row.activityStatus == 10) {
              if (params.row.activityStatus == 5) {
                btnList.push(
                  h('el-button',
                  {
                    attrs: {
                      type: 'text'
                    }, 
                    on:{
                      click:()=>that.opratorFn(params.row, 'startOrStop')
                    },
                    domProps:{innerHTML:'启用'}
                  })
                )
              }else{
                btnList.push(
                  h('el-button',
                  {
                    attrs: {
                      type: 'text'
                    }, 
                    on:{
                      click:()=>that.opratorFn(params.row, 'startOrStop')
                    },
                    domProps:{innerHTML:'停用'}
                  })
                )
              }
              btnList.push(
                h('el-button',
                {
                  attrs: {
                    type: 'text'
                  }, 
                  on:{
                    click:()=>that.opratorFn(params.row, 'void')
                  },
                  domProps:{innerHTML:'作废'}
                })
              )
            }
            return h('div',
            {class:{activityTime:true}},btnList
            )
          },
        },
        
      ]
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.update()
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.update()
    },


    viewFn(row) {
      // 查看integralDetail
      this.$router.push({ name: "orderActivityDetail" ,params: { id: row.id, operator: "details" }});

    },

    opratorFn(row, type) {
      // 操作
      if (type == "copy") {
        // 复制
        this.$router.push({
          name: "addOrderActivity",
          params: { id: row.id, operator: "copy" }
        });
      } else if (type == "edit") {
        // 编辑
        this.$router.push({
          name: "addOrderActivity",
          params: { id: row.id, operator: "edit" }
        });
      } else if (type == "delete") {
        // 删除
        this.type = 4;
        this.id = row.id;
        this.dialogTitle = "删除";
        this.dialogVisible = true;
      } else if (type == "startOrStop") {
        // 启用/停用
        this.id = row.id;
        if (row.activityStatus == 5) {
          //停用操作
          this.type = 6;
          this.dialogTitle = "停用";
          this.dialogVisible = true;
        } else if (row.activityStatus == 10) {
          //启用操作
          this.type = 7;
          this.dialogTitle = "启用";
          this.dialogVisible = true;
        }
        this.dialogVisible = true;
      } else if (type == "void") {
        // 作废
        this.id = row.id;
        this.type = 5;
        this.dialogTitle = "作废";
        this.dialogVisible = true;
      } else {
        //
      }
    },

    operator() {
      //dialog点击确认

      const userInfo = JSON.parse(localStorage.getItem("USER"));
      const data = {
        result: this.type,
        id: this.id
      };
      if (this.type == 2) {
        data.opinion = this.opinion || "";
      }

      data.branchId = _.get(userInfo, "branchId") || "";
      data.gwId = _.get(userInfo, "roleid") || "";
      data.uorId = _.get(userInfo, "uor_id") || "";
      data.userId = _.get(userInfo, "user_id") || "";
      data.userName = _.get(userInfo, "user_name") || "";

      operatorIntegral(data).then(res => {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.update()
        this.dialogVisible = false;
      });
    },
    getSelectItems(){
      return this.$refs.componentTable.multipleSelection
    },
    //TODO:myfunc
  }
}
</script>

<style lang="scss" scoped>
.top20 {
  margin-top: 20px;
}
</style>