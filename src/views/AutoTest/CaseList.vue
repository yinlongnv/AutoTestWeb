<template>
  <div class="old-manage">
    <div class="header-line">用例管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createCase">创建用例</el-button>
      <el-button icon="el-icon-download" size="small" @click="handleDownload">下载模板</el-button>
      <!-- <el-button icon="el-icon-upload2" size="small" @click="dialogFormVisible = true">批量导入</el-button> -->
      <el-button icon="el-icon-upload2" size="small" @click="handleImport">批量导入</el-button>
      <el-button icon="el-icon-delete" size="small" @click="onDelete(idList)">批量删除</el-button>
      <div style="text-align:right;width:100%">
        <el-cascader
          v-model="value"
          size="small"
          clearable
          placeholder="请选择关联接口信息"
          :options="options"
          @change="handleChange($event, 'searchObj')"
        />
        <el-select
          v-model="searchObj.executeStatus"
          style="width:200px"
          placeholder="请选择执行状态"
          size="small"
          clearable
          :no-data-text="'暂无数据'"
        >
          <el-option
            v-for="item in executeStatusOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchObj.caseDescription"
          icon="el-icon-search"
          placeholder="搜索用例描述"
          size="small"
          style="width:200px"
        />
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/case/listWithSearch'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="关联接口名称" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goDetail('/api/detail', scope.row)"
          >{{ scope.row.apiName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用例描述" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goDetail('/case/detail', scope.row)"
          >{{ scope.row.caseDescription }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行人" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.lastExecuteTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.executeStatus" type="success">
            {{
            scope.row.executeStatus | executeStatusFilter
            }}
          </el-tag>
          <el-tag v-else type="warning">
            {{
            scope.row.executeStatus | executeStatusFilter
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行次数" align="center" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.executeCount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="editOrCopy(1, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="editOrCopy(2, scope.row)">复制用例</el-button>
            <el-button
              type="text"
              style="color:#67c23a"
              size="small"
              @click="onExecute(scope.row)"
            >执行</el-button>
            <el-button
              type="text"
              style="color:#f56c6c"
              size="small"
              @click="onDelete([scope.row.id])"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>
    <el-dialog title="批量导入" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="关联接口信息" :label-width="formLabelWidth">
          <el-cascader
            v-model="importValue"
            size="small"
            clearable
            placeholder="请选择关联接口信息"
            :options="options"
            @change="handleChange($event, 'importObj')"
          />
        </el-form-item>
        <el-form-item label="上传文件" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-exceed="handleExceed"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
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
import { executeStatusFilter } from "@/utils/filter";
import { deleteCases, getfilterMap, handleUpload, execute } from "@/api/case";
export default {
  components: { BaseTable },
  filters: {
    executeStatusFilter
  },
  data() {
    return {
      value: [],
      importValue: [],
      options: [],
      timeArray: [],
      formLabelWidth: "120px",
      apiName: "",
      searchObj: {
        caseDescription: "",
        executeStatus: "",
        projectName: "",
        apiGroup: "",
        apiMerge: ""
      },
      importObj: {
        projectName: "",
        apiGroup: "",
        apiMerge: ""
      },
      idList: [],
      fileList: [],
      dialogFormVisible: false,
      type: "",
      role: "",
      executeStatusOptions: [
        {
          name: "未执行",
          value: 0
        },
        {
          name: "已执行",
          value: 1
        }
      ],
      apiGroup: "",
      apiGroupOptions: [],
      reqMethod: "",
      reqMethodOptions: []
    };
  },
  created() {
    this.getfilterMap();
  },
  methods: {
    handleImport() {
      this.importValue = [];
      this.fileList = [];
      this.dialogFormVisible = true;
    },
    // 下载模板
    handleDownload() {
      import("@/utils/Export2Excel").then(excel => {
        const tHeader = ["用例内容", "用例描述", "预期响应"];
        const filterVal = ["caseBody", "caseDescription", "caseResponse"];
        const list = [
          {
            caseBody: `{"username": "dadalong", "password": "123456"}`,
            caseDescription: "测试用户登录正常场景",
            caseResponse: `{"code": "00000","message": "登录成功","data": {"id": 1,"username": "root","name": "root","idCard": "","mobile": "","status": "enable","email": "","createTime": "1552999848000","roleIds": [1],"roleNames": ["超级管理员"],"provnce": ["北京市","浙江省"]}}`
          }
        ];
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "case"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    handleExceed(files, fileList) {
      this.$message.warning("当前限制选择 1个文件");
    },
    beforeUpload(file) {
      const isHtml =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isHtml) {
        this.$message.error("上传的文件只能是.xlsx");
      }
      return isHtml;
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    handleChange(val, type) {
      if (val.length === 0) {
        this[type].projectName = "";
        this[type].apiGroup = "";
        this[type].apiMerge = "";
      } else {
        this[type].projectName = val[0];
        this[type].apiGroup = val[1];
        this[type].apiMerge = val[2];
      }
    },
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        this.options = result.data.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    goDetail(path, row) {
      if (path === "/api/detail") {
        this.$router.push({ path, query: { id: row.apiId } });
      } else if (path === "/case/detail") {
        this.$router.push({ path, query: { id: row.id } });
      }
    },
    createCase(row) {
      sessionStorage.removeItem("caseDetail");
      this.$router.push({ path: "/case/edit", query: { type: 0 } });
    },
    editOrCopy(type, row) {
      sessionStorage.setItem("caseDetail", JSON.stringify(row));
      this.$router.push({ path: "/case/edit", query: { type } });
    },
    onDelete(idList) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteCases(idList);
        })
        .catch(() => {});
    },
    onExecute(row) {
      this.$confirm("确定要执行该条用例嘛?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.execute(row.id);
        })
        .catch(() => {});
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id);
    },
    async deleteCases(caseIds) {
      const result = await deleteCases({ caseIds });
      if (result.data.code === "00000") {
        this.$refs.tableRef.onSearch();
        this.$message.success("删除成功");
      } else {
        this.$message.error("操作失败，请重试");
      }
    },
    async handleUpload() {
      if (this.importObj.apiMerge && this.fileList[0]) {
        const userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
        const formData = new FormData();
        formData.append("file", this.fileList[0].raw);
        formData.append("projectName", this.importObj.projectName);
        formData.append("apiGroup", this.importObj.apiGroup);
        formData.append("apiMerge", this.importObj.apiMerge);
        formData.append("userId", userId);
        const result = await handleUpload(formData);
        if (result.data.code === "00000") {
          this.$message.success(result.data.message);
          this.$refs.tableRef.onSearch();
        } else {
          this.$message.error(result.data.message);
        }
        this.dialogFormVisible = false;
      } else {
        this.$message.error("请输入关联接口信息和上传文件");
      }
    },
    async execute(caseId) {
      const result = await execute({ caseId });
      if (result.data.code === "00000") {
        this.$message.success(result.data.message);
        setTimeout(() => this.$refs.tableRef.onSearch(), 15000);
      } else {
        this.$message.error(result.data.message);
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
