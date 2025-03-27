<template>
  <div>
    <div class="header">


    </div>
    <el-table class="my-table" :data="state.data.list">

      <el-table-column prop="code" label="座位号" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
     
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">归还</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />


  </div>
</template>

<script lang="js" setup>

import { reactive, ref } from 'vue';
import axios from '../../axios';
import { ElMessage } from 'element-plus';
import { getUser } from '../../utils/auth';


const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username:''
})
const state = reactive({
  data: {},
  curRecord: {},

})


const getRecordList = () => {
  queryParams.username = getUser().username
  axios.get('record/list', { params: queryParams }).then(res => {

    state.data = res

  })

}

const handleEdit = (index, row) => {
  
  axios.post('record/back', row).then(res => {
    ElMessage.success('归还成功')
    getRecordList()
  })
}

const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getRecordList()
}

getRecordList()

</script>

<style lang="css" scoped>
.header {
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 30px;

}

.btn-add {
  position: absolute;
  right: 20px;
}

.avatar {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
</style>