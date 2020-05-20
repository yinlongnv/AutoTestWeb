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
      :style="'text-align:center'"
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
const debounce = (function() {
  let timer = 0
  return function(func, delay) {
    clearTimeout(timer)
    timer = setTimeout(func, delay)
  }
})()
export default {
  name: 'DfTable',
  props: {
    pageSize: {
      type: Number,
      default: 10
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
        size: this.pageSize
      },
      tableData: []
    }
  },
  mounted() {
    this.onSearch()
    this.$watch(
      'searchParam',
      () => {
        debounce(() => {
          this.onSearch()
        }, 1000)
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
        const userId = JSON.parse(sessionStorage.getItem('userInfo')).id
        try {
          this.pager.current = current
          const data = {
            userId,
            ...this.searchParam,
            ps: this.pager.size,
            page: this.pager.current
          }
          const result = await request({ url: this.url, params: data })
          console.log('result', result)
          this.tableData = result.data.data.tbody
          this.pager.total = result.data.data.pageInfo.total
          this.$emit('tableLoaded', this.tableData)
          this.loading = false
        } catch (error) {
          this.$message.error(error)
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
