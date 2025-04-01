<template>
  <div>
    <div class="header">


    </div>
    <el-table class="my-table" :data="state.data.list">

      <el-table-column prop="bookName" label="书名" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="status" label="状态" :formatter="statusFormatter" />
      <el-table-column prop="createTime" label="借阅时间" />
      <el-table-column prop="backdate" label="归还日期" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.$index, scope.row)"
            :disabled="scope.row.status == '1'">归还</el-button>
          <el-button type="success" @click="handleLong(scope.$index, scope.row)">续借</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />
    <el-dialog v-model="dialogVisible1" width="500" @close="clearData">
      <el-form class="form" :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="归还日期">
          <el-date-picker v-model="selectDate" type="date" placeholder="请选择" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="updateBorrow">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="js" setup>

import { reactive, ref } from 'vue';
import axios from '../../axios';
import { ElMessage } from 'element-plus';
import { getUser } from '../../utils/auth';
const dialogVisible1 = ref(false)
const selectDate = ref('')
const clearData = () => {
  state.curBorrow = {}
  selectDate.value = ''
}


const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  username: '',
  status: ''
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

const handleLong = (index, row) => {

  dialogVisible1.value = true
  state.curBorrow = row
  selectDate.value = row.backdate
}

const updateBorrow = () => {
  state.curBorrow.backdate = selectDate.value
  axios.put('borrow', state.curBorrow).then(res => {
    ElMessage.success('续借成功')
    dialogVisible1.value = false
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