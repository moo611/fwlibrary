<template>
  <div >
    <div class="header">
      <el-button v-show="false" type="primary" @click="getSeatList">查询</el-button>
      <el-button v-show="getUser().role == '0'" @click="handleAdd" type="primary" class="btn-add">新增</el-button>
    </div>
    <el-table class="my-table" :data="state.data.list">

      <el-table-column prop="code" label="座位号" />
      <el-table-column prop="status" label="状态" :formatter="statusFormatter"/>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div v-if="getUser().role == '0'">

            <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button :disabled="scope.row.status == '1'" type='primary'
              @click="handleBook(scope.$index, scope.row)">预约</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />

    <el-dialog v-model="dialogVisible1" width="500" @close="clearData">

      <el-form class="form" :model="form" label-width="auto" style="max-width: 600px">

        <el-form-item label="座位号">
          <el-input v-model="form.code" />
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
    <el-dialog v-model="dialogVisible2" width="500" @close="clearData2">

      <el-form class="form" :model="form2" label-width="auto" style="max-width: 600px">

        <el-form-item label="起止时间">
          <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="截止时间" @change="onDateChange" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>

      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="saveBook">
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
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getUser } from '../../utils/auth';
const route = useRoute()


let mode = '0'

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  hotelId: ''

})
const state = reactive({
  data: {},
  curSeat: {},

})

const form = reactive({
  code: '',
  id: '',

})
const form2 = reactive({
  code:'',
  username:getUser().username,
  startTime:'',
  endTime:''
})
const dialogVisible1 = ref(false)
const dialogVisible2=ref(false)
const clearData = () => {

  form.code = ''
  form.id = ''
  form.status = ''

  mode = '0'

}
const clearData2 = () => {

form2.code = ''
form2.startTime = ''
form2.endTime = ''
mode = '0'

}

onMounted(() => {
  form.hotelId = route.query.hotelId
  queryParams.hotelId = route.query.hotelId
  console.log('hotel:' + form.hotelId)

  getSeatList()

})


const statusFormatter = (row, col, cellValue) => {
  if (cellValue == '0') {
    return '空闲'
  }
  return '占用'
}

const getSeatList = () => {

  axios.get('seat/list', { params: queryParams }).then(res => {

    state.data = res

    console.log(state.data)

  })

}



const saveOrUpdate = () => {

  if (mode == '0') {
    axios.post('seat', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('新增成功')
      getSeatList()

    })
  } else {
    axios.put('seat', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('修改成功')
      getSeatList()

    })
  }


}
const dateRange = ref([])
const onDateChange = (value) => {
  console.log(value)
  form2.startTime = value[0]
  form2.endTime = value[1]
 
}


const copyValue = (src, target) => {
  // 遍历 target 中的 key，并将 src 对应属性赋值给 target
  Object.keys(target).forEach((key) => {
    if (src[key] !== undefined) {
      target[key] = src[key] // 仅赋值存在于 src 中的属性
    }
  })
}

const handleAdd = () => {
  mode = '0'
  dialogVisible1.value = true
}

const handleEdit = (index, row) => {
  mode = '1'
  copyValue(row, form)
  dialogVisible1.value = true

}
const handleDel = (index, row) => {
  axios.delete('seat/' + row.id).then(res => {
    ElMessage.success("删除成功")
    getSeatList()
  })
}

const handleBook = (index, row) => {
  dialogVisible2.value=true
  form2.code = row.code
}

const saveBook=()=>{
  
  axios.post('record', form2).then(res => {
    ElMessage.success("预约成功")
    dialogVisible2.value=false
    getSeatList()
  })
}

const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getSeatList()
}



</script>

<style lang="css" scoped>
.main {
  width: 1000px;
  margin: 0 auto;
}

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