<template>
  <div class="service-user-container">
    <el-row>
      <el-col :span="4">
        <el-select v-model="communityId" placeholder="全部社区" size="small" :no-data-text="'暂无数据'" @change="selectCommunity">
          <el-option
            v-for="item in communityList"
            :key="item.community_id"
            :label="item.name"
            :value="item.community_id"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="subdistrictId" placeholder="全部小区" size="small" :no-data-text="'暂无数据'" @change="selectSubdistrict">
          <el-option
            v-for="item in subdistrictList"
            :key="item.subdistrict_id"
            :label="item.name"
            :value="item.subdistrict_id"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="searchService">查看</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:16px">
      <el-col :span="6">
        <div class="user-num">
          <div class="flex-box">
            <img :src="icon" alt="">
            <div>
              <div>服务对象总数</div>
              <div>{{ serviceObj.svc_obj_amount }}人</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" :offset="1">
        <div class="user-rate">
          <div class="flex-box">
            <img :src="icon" alt="">
            <div>
              <div>男性：</div>
              <div>
                <span>{{ serviceObj.male_amount }}人</span>
                <span>占{{ ((serviceObj.male_amount/serviceObj.svc_obj_amount)*100).toFixed(2) }}%</span>
              </div>
            </div>
          </div>
          <div class="flex-box">
            <img :src="icon" alt="">
            <div>
              <div>女性：</div>
              <div>
                <span>{{ serviceObj.female_amount }}人</span>
                <span>占{{ ((serviceObj.female_amount/serviceObj.svc_obj_amount)*100).toFixed(2) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <v-chart class="bar-chart" :options="barChart" />
  </div>
</template>

<script>
import icon from '@/assets/404_images/404.png'
import { getServiceObj, getCommunityList, getSudistrictLit } from '@/api/user'
export default {
  data() {
    return {
      communityId: 0,
      subdistrictId: 0,
      serviceObj: {},
      ageList: [],
      barChartData: [],
      icon,
      communityList: [{ 'community_id': 0, 'name': '全部社区' }],
      subdistrictList: [{ 'subdistrict_id': 0, 'name': '全部小区' }]
    }
  },
  computed: {
    barChart() {
      const option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
        },
        xAxis: {
          data: this.ageList,
          name: '岁'
        },
        yAxis: {
          name: '人'
        },
        series: [
          {
            type: 'bar',
            data: this.barChartData,
            barWidth: 35
          }
        ]
      }
      return option
    }
  },
  created() {
    this.getServiceObj(this.communityId, this.subdistrictId)
    this.getCommunityList()
  },
  methods: {
    searchService() {
      this.getServiceObj(this.communityId, this.subdistrictId)
    },
    selectCommunity(val) {
      console.log(val)
      this.subdistrictId = 0
      this.communityId = val
      this.getSudistrictLit(val)
    },
    selectSubdistrict(val) {
      this.subdistrictId = val
    },
    async getServiceObj(communityId, subdistrictId) {
      const result = await getServiceObj({ 'community_id': communityId, 'subdistrict_id': subdistrictId })
      this.serviceObj = result.data.data
      this.ageList = Object.keys(this.serviceObj.age_distribution)
      this.barChartData = Object.values(this.serviceObj.age_distribution)
    },
    async getCommunityList() {
      this.communityList = [{ 'community_id': 0, 'name': '全部社区' }]
      const result = await getCommunityList()
      const communityList = result.data.data.community_list || []
      communityList.forEach(f => {
        this.communityList.push(f)
      })
    },
    async getSudistrictLit(communityId) {
      this.subdistrictList = [{ 'subdistrict_id': 0, 'name': '全部小区' }]
      const result = await getSudistrictLit({ 'community_id': communityId })
      const subdistrictList = result.data.data.subdistrict_list || []
      subdistrictList.forEach(f => {
        this.subdistrictList.push(f)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.service-user-container{
  .bar-chart {
  width: 800px;
  height: 500px;
  margin: 0 auto;
}
  /deep/.el-input{
    width: 130px;
  }
  .user-num{
    border: 1px solid #f0f0f0;
    height: 70px;
    line-height: 35px;
    >div{
      @include flex-center;
      img{
        width: 50px;
        height: 50px;
      }
    }

  }
  .user-rate{
    border: 1px solid #f0f0f0;
    height: 70px;
    display: flex;
    >div{
      flex: 1;
      @include flex-start;
      margin-left: 16px;
        img{
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
