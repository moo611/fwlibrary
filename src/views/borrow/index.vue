<template>
  <div>
    <div class="header">


    </div>
    <el-table class="my-table" :data="state.data.list">

      <el-table-column prop="bookName" label="书名" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="status" label="状态" :formatter="statusFormatter" />
      <el-table-column prop="createTime" label="借阅时间" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)" :disabled="scope.row.status=='1'">归还</el-button>
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
  username:'',
  status:''
})
const state = reactive({
  data: {},
  curBorrow: {},

})


const getBorrowList = () => {
  queryParams.username = getUser().username
  queryParams.status = '0'
  axios.get('borrow/list', { params: queryParams }).then(res => {

    state.data = res

  })

}

const handleEdit = (index, row) => {
  row.status = '1'
  axios.put('borrow', row).then(res => {
    ElMessage.success('归还成功')
    getBorrowList()
  })
}
const statusFormatter = (row, col, value) => {
  if (value == '0') {
    return '借阅中'
  }
  return '已归还'
}
const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getBorrowList()
}

getBorrowList()

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