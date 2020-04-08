<template>
  <div class="analyse-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="服务对象统计" name="user"><service-user /> </el-tab-pane>
      <el-tab-pane label="服务项目分析" name="project"><service-project /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ServiceUser from '@/views/Analyse/ServiceUser'
import ServiceProject from '@/views/Analyse/ServiceProject'
export default {
  name: 'Dashboard',
  components: { ServiceUser, ServiceProject },
  data() {
    return {
      activeName: 'user'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleClick() {

    }
  }
}
</script>

<style lang="scss" scoped>
.analyse-container{

}
</style>
