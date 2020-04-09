<template>
  <div class="table-container">
    <el-table
      ref="propsRef"
      v-loading="loading"
      :empty-text="'暂无数据'"
      :data="tableData"
      @selection-change="handleSelectionChange"
      @select-all="selectall"
      @select="selectSingle"
      @sort-change="onSortChange"
    >
      <slot />
    </el-table>
    <el-pagination
      v-show="pager.total > pager.size"
      ref="livePagination"
      class="live-pagination"
      :page-size="pager.size"
      :current-page="pager.current"
      :total="pager.total"
      layout="prev, pager, next,jumper"
      @current-change="onChangePage"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
const debounce = (function() {
  let timeout;
  return function(fn, delay) {
    let that = this;
    let args = arguments;
    clearTimeout(timeout);
    setTimeout(fn.apply(that, args), delay);
  };
})();
export default {
  name: "DfTable",
  props: {
    pageSize: {
      type: Number,
      default: 20
    },
    method: {
      type: String,
      default: "get"
    },
    searchParam: {
      type: Object,
      default: () => {}
    },
    url: {
      type: String,
      default: ""
    },
    ifShowPagination: {
      type: Boolean,
      default: true
    },
    hideNoResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      pager: {
        total: 0,
        current: 1,
        size: this.pageSize || 20
      },
      tableData: [],
      tableKey: 0
    };
  },
  mounted() {
    this.onSearch();
    this.$watch(
      "searchParam",
      () => {
        this.tableKey++;
        // debounce(this.onSearch, 500);
        this.onSearch();
      },
      { deep: true }
    );
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    selectall(val) {
      this.$emit("selectall", val, "all");
    },
    selectSingle(val) {
      this.$emit("selectSingle", val);
    },
    onSortChange(params) {
      this.$emit("onSortChange", params);
    },
    async onSearch(current = 1) {
      if (this.url === "/record/list") {
        // 模拟下载excel数据
        this.tableData = [
          {
            username: "aaa",
            id_number: "12344",
            role: "管理员",
            login_ip: "127.1.1",
            action: "哈哈哈",
            page: "测试",
            time: "2020-4-1 11:00:01"
          }
        ];
        this.$emit("tableLoaded", this.tableData);
      } else if (this.url) {
        this.loading = true;
        try {
          this.pager.current = current;
          const data = {
            ...this.searchParam,
            ps: this.pager.size,
            page: this.pager.current
          };
          const result = await request({ url: this.url, params: data });
          console.log("result", result);
          this.tableData = result.data.records;
          // if (result && result.resultList) {
          //   this.tableData = result.resultList
          //   this.pager.total = result.resultCount
          // }
          this.$emit("tableLoaded", this.tableData);
          this.loading = false;
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    },
    async onChangePage(current) {
      this.onSearch(current);
      window.scrollTo({
        top: 0
        // behavior: 'smooth'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-container {
  padding: 16px;
}

.live-pagination {
  margin-top: 40px;
}
</style>
