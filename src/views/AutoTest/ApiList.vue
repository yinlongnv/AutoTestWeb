<template>
  <div class="old-manage">
    <div class="header-line">接口管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createApi">创建接口</el-button>
      <el-button icon="el-icon-download" size="small" @click="handleDownload">下载模板</el-button>
      <el-button icon="el-icon-upload2" size="small" @click="handleImport">批量导入</el-button>
      <el-button icon="el-icon-delete" size="small" @click="onDelete(idList)">批量删除</el-button>
      <div style="text-align:right;width:100%">
        <el-cascader
          v-model="value"
          size="small"
          clearable
          placeholder="请选择业务方法"
          :options="options"
          @change="handleChange"
        />
        <el-select
          v-model="searchObj.reqMethod"
          style="width:200px"
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
          style="width:200px"
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
      <el-table-column label="接口名称" width="170">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">
            {{
            scope.row.apiName
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="接口路径" width="280" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.apiPath }}</div>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" width="80" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.reqMethod }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属业务" width="160" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.projectName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属分组" width="120" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.apiGroup }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="120" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="editOrCopy(1, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="editOrCopy(2, scope.row)">复制接口</el-button>
            <el-button
              type="text"
              size="small"
              style="color:#e6a23c"
              @click="onCreateCase(scope.row)"
            >创建用例</el-button>
            <el-button
              type="text"
              style="color:#67c23a"
              size="small"
              @click="showParams(scope.row)"
            >参数规则</el-button>
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
    <el-dialog title="参数规则" :visible.sync="dialogParams" width="1000px">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="参数名" width="150" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" disabled size="small" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否必需" width="150" align="center">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.required" size="small">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>-->
        <el-table-column label="数据类型" width="170" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" clearable size="small" placeholder="请选择数据类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="最小值" width="120" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.min"
              :disabled="Boolean(scope.row.options) || Boolean(scope.row.model)"
              size="small"
              placeholder="最小值"
              style="width:100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="最大值" width="120" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.max"
              :disabled="Boolean(scope.row.options) || Boolean(scope.row.model)"
              size="small"
              placeholder="最大值"
              style="width:100px"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否为数组" width="150" align="center">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.isArray" size="small">
              <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>-->
        <el-table-column label="类型" width="150" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.model"
              :disabled="Boolean(scope.row.max) || Boolean(scope.row.min) || Boolean(scope.row.options)"
              size="small"
              clearable
              placeholder="请选择类型"
            >
              <el-option
                v-for="item in modelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="选项内容" width="200" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.options"
              :disabled="Boolean(scope.row.max) || Boolean(scope.row.min) || Boolean(scope.row.model)"
              size="small"
              placeholder="请输入选项内容"
              style="width:170px"
            />
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogParams = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmParams">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量导入" :visible.sync="dialogFormVisible">
      <el-form ref="importForm" :model="form">
        <el-form-item label="环境域名" :label-width="formLabelWidth">
          <el-select
            v-model="baseUrlOption"
            size="small"
            :style="inputWidth"
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
            />
          </el-select>
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
import { statusFilter, reqMethodFilter } from "@/utils/filter";
import {
  deleteApis,
  getfilterMap,
  getfilterBaseUrl,
  handleUpload,
  getReqBody,
  putCaseRules
} from "@/api/api";
export default {
  components: { BaseTable },
  filters: {
    statusFilter,
    reqMethodFilter
  },
  data() {
    return {
      dialogParams: false,
      tableData: [],
      form: {},
      fileList: [],
      baseUrlOption: "",
      dialogFormVisible: false,
      baseUrlOptions: [],
      value: [],
      options: [],
      inputWidth: "width:360px",
      formLabelWidth: "120px",
      searchObj: {
        projectName: "",
        apiGroup: "",
        reqMethod: "",
        apiName: ""
      },
      idList: [],
      type: "",
      typeOptions: [
        {
          value: "int",
          label: "int"
        },
        {
          value: "string",
          label: "string"
        },
        {
          value: "other",
          label: "other"
        }
      ],
      modelOptions: [
        {
          value: "phone",
          label: "phone"
        },
        {
          value: "email",
          label: "email"
        },
        {
          value: "idNumber",
          label: "idNumber"
        },
        {
          value: "other",
          label: "other"
        }
      ],
      methodOptions: [
        {
          value: "GET",
          name: "GET"
        },
        {
          value: "POST",
          name: "POST"
        }
      ]
    };
  },

  created() {
    this.getfilterMap();
    this.getfilterBaseUrl();
  },
  methods: {
    handleImport() {
      this.baseUrlOption = "";
      this.fileList = [];
      this.dialogFormVisible = true;
    },
    confirmParams() {
      console.log(this.tableData);
      this.putCaseRules();
      this.dialogParams = false;
    },
    showParams(row) {
      this.apiId = row.id;
      this.getReqBody(row.id);
    },
    // 下载模板
    handleDownload() {
      import("@/utils/Export2Excel").then(excel => {
        const tHeader = [
          "所属业务",
          "所属分组",
          "接口名称",
          "接口路径",
          "请求方法",
          "接口描述",
          "请求头",
          "请求参数",
          "请求体",
          "用例规则",
          "响应信息"
        ];
        const filterVal = [
          "projectName",
          "apiGroup",
          "apiName",
          "apiPath",
          "reqMethod",
          "apiDescription",
          "reqHeaders",
          "reqQuery",
          "reqBody",
          "caseRules",
          "apiResponse"
        ];
        const list = [
          {
            projectName: "靶场inner",
            apiGroup: "用户中心",
            apiName: "获取用户信息",
            apiPath: "/range-user/api/inner/user/info",
            reqMethod: "POST",
            apiDescription: "通过用户id获取用户信息",
            reqHeaders: `[{"name":"Content-Type","value":"application/x-www-form-urlencoded","required":"1","example":"","desc":""}]`,
            reqQuery: `[{"name": "tagId", "required": "1", "example": "", "desc": ""}]`,
            reqBody: `[{"name": "snapshotName", "type": "string", "required": "0"}, {"name": "summary", "type": "string", "required": "0"}, {"name": "trainId", "type": "integer", "required": "0"}]`,
            caseRules: `[{"name":"username","required":"1","type":"string","min":"6","max":"10","options":"","isArray":"0","model":""},{"name":"password","required":"1","type":"string","min":"6","max":"10","options":"","isArray":"0","model":""},{"name":"email","required":"1","type":"string","min":"","max":"","options":"","isArray":"0","model":"email"}]`,
            apiResponse: `{"code": "00000","message": "","data": {"id": 7,"trainId": 1,"profile": "1","visits": 0,"creatorId": 59,"createdTime": 1575250698063,"hasUpload": true,"hasBug": true,"uploads": [{"code": "95386d42b07af57bc7c8d84b86587184","name": "人员画像.mp4","url": "http://192.168.37.150/group1/M00/00/0A/wKgll13g2EuAXAKVAWVKCVOeYz8504.mp4"}]}}`
          }
        ];
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "api"
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
      const isHtmlOrXlsx =
        file.type === "text/html" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isHtmlOrXlsx) {
        this.$message.error("上传的文件只能是.html或.xlsx");
      }
      return isHtmlOrXlsx;
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
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
        const options = result.data.data.options;
        for (const i of options) {
          for (const child of i.children) {
            delete child.children;
          }
        }
        this.options = result.data.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    async getfilterBaseUrl() {
      try {
        const result = await getfilterBaseUrl();
        this.baseUrlOptions = result.data.data.baseUrlOptions;
      } catch (error) {
        this.$message.error(error);
      }
    },
    async getReqBody(apiId) {
      try {
        const result = await getReqBody({ apiId });
        if (result.data.code === "00000") {
          this.tableData = result.data.data;
          for (const item of this.tableData) {
            item.type = "";
          }
          this.dialogParams = true;
        } else {
          this.$message.error(result.data.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    async putCaseRules() {
      try {
        const apiId = this.apiId;
        console.log(apiId);
        const result = await putCaseRules({
          caseRulesList: this.tableData,
          apiId
        });
        if (result.data.code === "00000") {
          this.$message.success(result.data.message);
        } else {
          this.$message.error(result.data.message);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    createApi(row) {
      sessionStorage.removeItem("apiDetail");
      this.$router.push({ path: "/api/edit", query: { type: 0 } });
    },
    editOrCopy(type, row) {
      sessionStorage.setItem("apiDetail", JSON.stringify(row));
      this.$router.push({ path: "/api/edit", query: { type } });
    },
    onDelete(idList) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => this.deleteApis(idList))
        .catch(() => {});
    },
    async handleUpload() {
      if (this.baseUrlOption && this.fileList[0]) {
        const userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
        const formData = new FormData();
        formData.append("file", this.fileList[0].raw);
        formData.append("baseUrl", this.baseUrlOption);
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
        this.$message.error("请输入环境域名和上传文件");
      }
    },
    onCreateCase(row) {
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
    },
    async deleteApis(apiIds) {
      const result = await deleteApis({ apiIds: apiIds });
      if (result.data.code === "00000") {
        this.$refs.tableRef.onSearch();
        this.$message.success("删除成功");
      } else {
        this.$message.error("操作失败，请重试");
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
