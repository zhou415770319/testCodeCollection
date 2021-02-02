<template>
  <h-container class="hj-advertisement-list">
    <div slot="center">
      <div class="header-con">
        <div class="hj-btn-inner">
          <el-button type="primary" size="medium" @click="createActivity">
            创建限时抢购
          </el-button>
          <el-button type="primary" size="medium" @click="setTime">
            时间段维护
          </el-button>
        </div>

        <timeLimitSaleForm ref="form" :update="formUpdate" :branchCompanyList="branchCompanyList">
          <div slot="search">
            <el-button type="primary" size="medium" @click="searchList">
              查询
            </el-button>
            <el-button type="primary" size="medium" @click="exportItem">
              导出
            </el-button>
          </div>
        </timeLimitSaleForm>
      </div>

      <timeLimitSaleTable ref="table" :update="tableUpdate" :data="listData" :total="total" :selection="selection">
      </timeLimitSaleTable>

      <el-dialog :visible.sync="timeVisible" title="时间段维护">
        <div>测试</div>
      </el-dialog>
    </div>
  </h-container>
</template>

<script>
import { queryIntegralList } from "@/api/integral";
import { queryCompanyList } from "@/api/label";

import timeLimitSaleTable from "./component/searchTable"
import timeLimitSaleForm from "./component/searchForm";
export default {
  name: "timeLimitSaleList",
  data() {
    return {
      branchCompanyList: [], //分公司
      companyObj: {}, //分公司
      search: {
        // pageNum: 1,
        // pageSize: 10,
      },
      user:{},
      listData: [], //页面列表数据
      total: "",
      timeVisible: false,
      selection:true, //支持多选
      //   mydata
    };
  },
  components: {
    timeLimitSaleForm, 
    timeLimitSaleTable
  },
  created() {
    let _department = this.$store.getters.department;
    _department ? (this.isDisabled = false) : (this.isDisabled = true);
    this.user = JSON.parse(localStorage.getItem("USER"));
    if (!_department) {
      this.search.branchId = this.user.branchId;
    }
    this.getBranchCompany();
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
        this.searchList()
      });
    },
    // 积分兑换配置
    createActivity() {
      this.$router.push({ name: "addOrderActivity" ,params: { id: "-1", operator: "create" }});
    },
    // 时间段维护
    setTime() {
      this.timeVisible = true;
    },
    // 初始化后更新数据
    formUpdate() {
      this.searchList();
    },
    //导出
    exportItem(){
      //获取选择项
      let selectItems = this.$refs.table.getSelectItems()
      // 导出
    },
    //搜索
    searchList() {
      this.getSearchForm();
      this.getIntegralList();
    },
    //获取请求参数
    getSearchForm() {
      const data = {
        ...this.$refs.form.search
      };
      //TODO:参数修改
      if (data.selectActivityType == "") {
        data.activityType = [3, 6];
      } else if (data.selectActivityType == "3") {
        data.activityType = [3];
      } else if (data.selectActivityType == "6") {
        data.activityType = [6];
      }
      this.$refs.table.pageNum = 1
      this.search = data;
    },
    getIntegralList() {
      this.$refs.table.loading = true
      this.search.pageNum = this.$refs.table.pageNum;
      this.search.pageSize = this.$refs.table.pageSize;
      //TODO:请求接口修改
      queryIntegralList(this.search)
        .then(res => {
          this.$refs.table.loading = false
          this.listData = res.content.data;

          this.total = res.content.total;
        })
        .catch(() => {
          this.$refs.table.loading = false

        });
    },
    tableUpdate() {
      
      this.getIntegralList();
    }

    // myfunc
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
