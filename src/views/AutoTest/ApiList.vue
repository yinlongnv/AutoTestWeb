<template>
  <div class="old-manage">
    <div style="padding:16px">接口管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createApi">创建接口</el-button>
      <el-button
        :loading="downloadLoading"
        icon="el-icon-download"
        size="small"
        @click="handleDownload"
      >下载模板</el-button>
      <el-button
        :loading="downloadLoading"
        icon="el-icon-upload2"
        size="small"
        @click="handleDownload"
      >批量导入</el-button>
      <el-button
        :loading="downloadLoading"
        icon="el-icon-delete"
        size="small"
        @click="onDelete(idList)"
      >批量删除</el-button>
      <div style="text-align:right;width:100%">
        <el-cascader
          size="small"
          clearable
          v-model="value"
          :options="options"
          @change="handleChange"
        ></el-cascader>
        <el-select
          v-model="searchObj.reqMethod"
          style="width:150px"
          placeholder="请选择请求方法"
          size="small"
          :no-data-text="'暂无数据'"
          clearable
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchObj.apiName"
          icon="el-icon-search"
          placeholder="搜索接口名称"
          size="small"
          style="width:130px"
        />
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/api/listWithSearch'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="接口名称" width="120">
        <!-- <template slot-scope="scope">
          <div>{{ scope.row.apiName }}</div>
        </template>-->
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">{{ scope.row.apiName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="接口路径" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.apiPath }}</div>
        </template>
      </el-table-column>

      <el-table-column label="请求方法" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.reqMethod }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属业务" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.projectName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属分组" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.apiGroup }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="onCreateCase(scope.row)">创建用例</el-button>
            <el-button type="text" size="small" @click="createApi(scope.row)">复制接口</el-button>
            <el-button
              type="text"
              style="color:#f56c6c"
              size="small"
              @click="onDelete(scope.row)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable";
import { statusFilter, reqMethodFilter } from "@/utils/filter";
import { deleteApis, createApi, getApiDetail, getfilterMap } from "@/api/api";
export default {
  components: { BaseTable },
  filters: {
    statusFilter,
    reqMethodFilter
  },
  data() {
    return {
      value: [],
      options: [],
      downloadLoading: false,
      rules: {
        name: [
          { required: true, message: "请输入正确的新密码", trigger: "blur" }
        ]
      },
      timeArray: [],
      form: {
        password: ""
      },
      formLabelWidth: "120px",
      searchObj: {
        projectName: "",
        apiGroup: "",
        reqMethod: "",
        apiName: ""
      },
      idList: [],
      type: "",
      role: "",
      roleOptions: [
        {
          value: "get",
          name: "get"
        },
        {
          value: "post",
          name: "post"
        }
      ],
      apiGroup: "",
      apiGroupOptions: [],
      reqMethod: "",
      reqMethodOptions: []
    };
  },

  created() {
    this.restaurants = this.loadAll();
    this.getfilterMap();
  },
  methods: {
    handleChange(val) {
      if (val.length === 0) {
        this.searchObj.projectName = "";
        this.searchObj.apiGroup = "";
      } else {
        this.searchObj.projectName = val[0];
        this.searchObj.apiGroup = val[1];
      }
    },
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        let options = result.data.options;
        for (let i of options) {
          for (let child of i.children) {
            delete child.children;
          }
        }
        this.options = result.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 顶部操作
    // 创建接口
    createApi(row) {
      if (row) {
        sessionStorage.setItem("apiDetail", JSON.stringify(row));
      }
      this.$router.push({ path: "/api/edit", query: { type: 0 } });
    },
    // 下载模板
    handleDownload() {
      this.downloadLoading = true;
      import("@/utils/Export2Excel").then(excel => {
        const tHeader = [
          "用户名",
          "身份证号",
          "账号角色",
          "登入IP",
          "账号操作",
          "操作界面",
          "操作时间"
        ];
        const filterVal = [
          "username",
          "id_number",
          "role",
          "login_ip",
          "action",
          "page",
          "time"
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    // 所属业务和请求方法
    handleSelect() {},
    // 搜索+选择
    loadAll() {
      return [{ value: "get" }, { value: "post" }, { value: "3" }];
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 列表操作
    onDelete(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.deleteApis(row);
          } else {
            const ids = [row.id];
            this.deleteApis(ids);
          }
        })
        .catch(() => {});
    },

    onCreateCase() {
      this.$router.push({ path: "/case/edit", query: { type: 0 } });
    },
    onEdit(row) {
      sessionStorage.setItem("apiDetail", JSON.stringify(row));
      this.$router.push({ path: "/api/edit", query: { type: 1 } });
    },
    goDetail(row) {
      this.$router.push({ path: "/api/detail", query: { id: row.id } });
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id);
      console.log(this.idList);
    },
    // 接口调用
    async deleteApis(apiIds) {
      try {
        await deleteApis({ apiIds: apiIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.old-manage {
  .flex-box {
    display: flex;
    align-items: center;
    > button {
      margin-left: 16px;
    }
  }
}
</style>
