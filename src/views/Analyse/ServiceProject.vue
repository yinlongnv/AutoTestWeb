<template>
  <div class="service-project-container">
    <el-row>
      <el-col :span="10">
        <el-date-picker
          v-model="timeArray"
          size="small"
          type="daterange"
          :value-format="'yyyy-MM-dd'"
          :format="'yyyy-MM-dd'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-col>
      <el-col :span="4">
        <el-select v-model="staff" placeholder="全部服务人员" size="small">
          <el-option
            v-for="item in staffList"
            :key="item.svc_staff_id"
            :label="item.name"
            :value="item.svc_staff_id"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="searchServiceItem">查看</el-button>
      </el-col>
    </el-row>
    <v-chart class="line-chart" :options="lineChart" />
    <div style="text-align:center">服务次数</div>
    <div class="flex-box">
      <div>
        <v-chart class="pie-chart" :options="pieChart1" />
        <div class="chart-text">{{ timeRange }}服务满意度评价比例</div>
      </div>
      <div>
        <v-chart class="pie-chart" :options="pieChart2" />
        <div class="chart-text">{{ timeRange }}服务项目比例</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceStaff, getServiceItem } from '@/api/user'
export default {
  data() {
    return {
      chartData: [],
      staff: '',
      staffList: [],
      timeArray: ['', ''],
      timeRange: ''
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
        }]
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
          radius: '55%',
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
          radius: '55%',
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
  created() {
    this.getServiceStaff()
    this.getServiceItem(this.timeArray[0], this.timeArray[1], 0)
  },
  methods: {
    async getServiceItem(begin, end, id) {
      const result = await getServiceItem({ 'begin': begin, 'end': end, 'svc_staff_id': id })
      console.log(result)
      this.chartData = result.data.data
    },
    async getServiceStaff() {
      const result = await getServiceStaff()
      console.log(result)
      this.staffList = result.data.data.svc_staff_list
    },
    searchServiceItem() {
      const id = this.staff || 0
      this.timeRange = `${this.timeArray[0]}~${this.timeArray[1]}`
      this.getServiceItem(this.timeArray[0], this.timeArray[1], id)
    }
  }

}
</script>

<style lang="scss" scoped>
.service-project-container{
  /deep/.el-input{
    width: 130px;
  }
  .line-chart {
    width: 800px;
    height: 500px;
    margin: 0 auto;
  }
  .flex-box{
    display: flex;
    justify-content: space-around;
  }
  .chart-text{
    text-align: center;
  }
  .pie-chart{
    width: 330px;
    height: 330px;
  }
}

</style>
