<template>
  <div class="old-manage">
    <div class="header-line">接口管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createApi">创建接口</el-button>
      <el-button icon="el-icon-download" size="small" @click="handleDownload">下载模板</el-button>
      <!-- <el-button icon="el-icon-upload2" size="small" @click="handleUpload">批量导入</el-button> -->
      <el-button icon="el-icon-upload2" size="small" @click="dialogFormVisible = true">批量导入</el-button>
      <el-button icon="el-icon-delete" size="small" @click="onDelete(idList)">批量删除</el-button>
      <div style="text-align:right;width:100%">
        <el-cascader
          size="small"
          clearable
          v-model="value"
          placeholder="请选择业务方法"
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
            v-for="item in methodOptions"
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
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="接口名称" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">{{ scope.row.apiName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="接口路径" width="200" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.apiPath }}</div>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" width="100" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.reqMethod }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属业务" width="120" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.projectName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属分组" width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.apiGroup }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="150" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="editApi(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="copyApi(scope.row)">复制接口</el-button>
            <el-button
              type="text"
              size="small"
              style="color:#e6a23c"
              @click="onCreateCase(scope.row)"
            >创建用例</el-button>
            <el-button type="text" style="color:#67c23a" size="small">参数规则</el-button>
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

    <el-dialog title="批量导入" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="环境域名" :label-width="formLabelWidth">
          <el-select
            size="small"
            v-model="baseUrlOption"
            multiple
            filterable
            allow-create
            clearable
            default-first-option
            placeholder="例如：'http://localhost:8080'"
          >
            <el-option
              v-for="item in baseUrlOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList"
          ></el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleUpload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable";
import { statusFilter, reqMethodFilter } from "@/utils/filter";
import {
  deleteApis,
  createApi,
  getApiDetail,
  getfilterMap,
  getfilterBaseUrl,
  handleUpload
} from "@/api/api";
export default {
  components: { BaseTable },
  filters: {
    statusFilter,
    reqMethodFilter
  },
  data() {
    return {
      baseUrlOptions: [],
      value: [],
      options: [],
      formLabelWidth: "120px",
      searchObj: {
        projectName: "",
        apiGroup: "",
        reqMethod: "",
        apiName: ""
      },
      idList: [],
      type: "",
      methodOptions: [
        {
          value: "get",
          name: "get"
        },
        {
          value: "post",
          name: "post"
        }
      ]
    };
  },

  created() {
    this.getfilterMap();
    this.getfilterBaseUrl();
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
    async getfilterBaseUrl() {
      try {
        const result = await getfilterBaseUrl();
        this.baseUrlOptions = result.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 创建接口
    createApi(row) {
      sessionStorage.removeItem("apiDetail");
      this.$router.push({ path: "/api/edit", query: { type: 0 } });
    },
    //编辑接口
    editApi(row) {
      sessionStorage.setItem("apiDetail", JSON.stringify(row));
      this.$router.push({ path: "/api/edit", query: { type: 1 } });
    },
    //复制接口
    copyApi(row) {
      sessionStorage.setItem("apiDetail", JSON.stringify(row));
      this.$router.push({ path: "/api/edit", query: { type: 2 } });
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
    async handleUpload() {
      console.log(baseUrlOption);
      const result = await handleUpload({
        baseUrlOption
      });
      if (result.data.code === "00000") {
        console.log(result.data);
        sessionStorage.setItem("userInfo", JSON.stringify(result.data.data));
        if (result.data.data.role) {
          this.$router.push({ path: "/user/list" });
        } else {
          this.$router.push({ path: "/api/list" });
        }
      } else {
        this.$message.error(result.data.message);
      }
    },
    onCreateCase(row) {
      console.log("row.id是什么");
      console.log(row.id);
      this.$router.push({
        path: "/case/edit",
        query: { type: 0, apiId: row.id }
      });
    },

    goDetail(row) {
      this.$router.push({ path: "/api/detail", query: { id: row.id } });
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id);
      // console.log(this.idList);
    },
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
