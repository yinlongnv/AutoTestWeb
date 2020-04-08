<template>
  <div class="chart-dialog-container">
    <el-dialog :visible.sync="dialogVisible" width="650px">
      <v-chart class="line-chart" :options="lineChart" />
      <div style="text-align:center">服务次数</div>
      <div class="flex-box">
        <div>
          <v-chart class="pie-chart" :options="pieChart1" />
          <div class="chart-text">服务满意度评价比例</div>
        </div>
        <div>
          <v-chart class="pie-chart" :options="pieChart2" />
          <div class="chart-text">服务项目比例</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: this.visible
    }
  },
  computed: {
    lineChart() {
      const svcCntList = this.chartData.svc_cnt_list || []
      const lineChartData = svcCntList.map(f => f.svc_cnt)
      const lineChartAxis = svcCntList.map(f => f.date)
      const option = {
        title: {
          left: 'center',
          text: '1月1日至1月31日全部服务项目比例'
        },
        xAxis: {
          type: 'category',
          data: lineChartAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: lineChartData,
          type: 'line'
        }],
        grid: {
          top: 40
        }
      }
      return option
    },
    pieChart1() {
      const pieChartData1 = []
      const scoreRateList = this.chartData.score_rate_list || []
      scoreRateList.forEach(f => {
        pieChartData1.push({ 'name': f.score, 'value': f.cnt })
      })
      const option = {
        series: [{
          type: 'pie',
          radius: '100%',
          center: ['50%', '50%'],
          data: pieChartData1,
          animation: false,
          label: {
            position: 'inner',
            alignTo: 'none',
            bleedMargin: 5
          }
        }]
      }
      return option
    },
    pieChart2() {
      const pieChartData2 = []
      const svcRateList = this.chartData.svc_item_rate_list || []
      svcRateList.forEach(f => {
        pieChartData2.push({ 'name': f.name, 'value': f.cnt })
      })

      const option = {
        series: [{
          type: 'pie',
          radius: '100%',
          center: ['50%', '50%'],
          data: pieChartData2,
          animation: false,
          label: {
            position: 'inner',
            alignTo: 'none',
            bleedMargin: 5
          }
        }]
      }
      return option
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible(newVal) {
      this.$emit('visibleChange', newVal)
    }
  }

}
</script>

<style lang="scss" scoped>
.chart-dialog-container{
  .flex-box{
    display: flex;
    justify-content: space-around;
  }
  .line-chart{
    height: 280px;
  }
  .pie-chart{
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  .chart-text{
    margin-top: 16px;
  }
}
</style>
