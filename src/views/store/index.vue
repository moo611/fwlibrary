<template>
  <div>
    <div class="header">

      <el-button @click="handleAdd" type="primary" class="btn-add">新增</el-button>
    </div>
    <el-table class="my-table" :data="state.data.list">

      <el-table-column prop="bookName" label="书名" />
      <el-table-column prop="inStoreNum" label="入库量" />
      <el-table-column prop="createTime" label="入库时间" />

    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />

    <el-dialog v-model="dialogVisible1" width="500" @close="clearData">

      <el-form class="form" :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="书名">
          <el-select v-model="form.bookId" placeholder="请选择">
            <el-option v-for="item in state.bookList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="form.inStoreNum" type="number" />
        </el-form-item>
      
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="saveOrUpdate">
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

let mode = '0'

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,

})
const state = reactive({
  data: {},
  curBook: {},
  bookList: []
})

const form = reactive({
  id: null,
  bookId: null,
  inStoreNum: null,

})
const dialogVisible1 = ref(false)

const clearData = () => {
  form.id = null
  form.inStoreNum = null
  form.bookId = null
  mode = '0'

}

const getStoreList = () => {
  axios.get('store/list', { params: queryParams }).then(res => {

    state.data = res

  })
}


const getBookList = () => {

  axios.get('book/list', { params: { pageNum: 1, pageSize: 10000 } }).then(res => {

    state.bookList = res.list.map(item => ({
      label: item.name,
      value: item.id
    }))

  })

}

const saveOrUpdate = () => {


  if (mode == '0') {

    axios.post('store', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('新增成功')
      getStoreList()

    })
  } else {
    axios.put('store', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('修改成功')
      getStoreList()

    })
  }


}

const handleAdd = () => {
  mode = '0'
  dialogVisible1.value = true
}


const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getStoreList()
}
getStoreList()
getBookList()

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