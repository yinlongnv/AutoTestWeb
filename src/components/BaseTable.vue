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
import request from '@/utils/request'
export default {
  name: 'DfTable',
  props: {
    pageSize: {
      type: Number,
      default: 20
    },
    method: {
      type: String,
      default: 'get'
    },
    searchParam: {
      type: Object,
      default: () => {}
    },
    url: {
      type: String,
      default: ''
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
    }
  },
  mounted() {
    this.onSearch()
    this.$watch(
      'searchParam',
      () => {
        this.tableKey++
        this.onSearch()
      },
      { deep: true }
    )
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    selectall(val) {
      this.$emit('selectall', val, 'all')
    },
    selectSingle(val) {
      this.$emit('selectSingle', val)
    },
    onSortChange(params) {
      this.$emit('onSortChange', params)
    },
    async onSearch(current = 1) {
      if (this.url) {
        this.loading = true
        try {
          this.pager.current = current
          const data = {
            ...this.searchParam,
            ps: this.pager.size,
            pn: this.pager.current
          }
          const result = await request({ url: this.url, params: data })
          console.log('result', result)
          this.tableData = result.data.data.list
          // if (result && result.resultList) {
          //   this.tableData = result.resultList
          //   this.pager.total = result.resultCount
          // }
          this.loading = false
        // eslint-disable-next-line no-empty
        } catch (e) {

        }
      }
    },
    async onChangePage(current) {
      this.onSearch(current)
      window.scrollTo({
        top: 0
        // behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  padding: 16px;
}

.live-pagination {
  margin-top: 40px;
}
</style>
