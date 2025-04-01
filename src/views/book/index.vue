<template>
  <div>
    <div class="header">

      <el-input style="width: 200px; margin-right: 20px;" v-model="queryParams.name" placeholder="请输入书名"></el-input>
      <el-input style="width: 200px; margin-right: 20px;" v-model="queryParams.author" placeholder="请输入作者"></el-input>
      <el-select style="width: 200px; margin-right: 20px;" v-model="queryParams.category" placeholder="请选择类别">
        <el-option v-for="item in categoryOptions2" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-button @click="getBookList" type="primary">查询</el-button>

      <el-button v-show="getUser().role == '0'" @click="handleAdd" type="primary" class="btn-add">新增</el-button>
    </div>
    <el-table class="my-table" :data="state.data.list">
      <!-- 图片列 -->
      <el-table-column label="图片">
        <template v-slot="scope">
          <!-- 使用 img 标签来展示图片 -->
          <img :src="scope.row.imageUrl" alt="图片" style="width: 100px; height: 60px; object-fit: contain;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="category" label="类别" :formatter="categoryFormatter" />
      <el-table-column prop="author" label="作者" />
      <el-table-column prop="price" label="价格（元）" />
      <el-table-column prop="storeNum" label="库存" />
      <el-table-column prop="createTime" label="创建时间" />


      <el-table-column label="操作">
        <template #default="scope">
          <div v-if="getUser().role == '0'">
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button type="danger" @click="handleDel(scope.$index, scope.row)">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" @click="handleView(scope.$index, scope.row)">
              试读
            </el-button>
            <el-button type="success" @click="handleBorrow(scope.$index, scope.row)">
              借阅
            </el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />

    <el-dialog v-model="dialogVisible1" width="500" @close="clearData">

      <el-form class="form" :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" />
        </el-form-item>
        <el-form-item label="类别">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" type="number" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload ref="uploadRef" class="avatar-uploader" action="http://8.155.12.207:8888/upload/avatar"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>

          </el-upload>
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
      <div style="width: 100%;height: 500px; padding: 20px; box-sizing: border-box;">
        <span style="font-size: 16px;">{{ content }}</span>
      </div>


    </el-dialog>

    <el-dialog v-model="dialogVisible3" width="500" @close="clearData3">
      <el-form class="form" :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="归还日期">
          <el-date-picker v-model="selectDate" type="date" placeholder="请选择" value-format="YYYY-MM-DD" />
        </el-form-item>


      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取消</el-button>
          <el-button type="primary" @click="saveBorrow">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="js" setup>
import { Plus } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import axios from '../../axios';
import { ElMessage } from 'element-plus';
import { getUser } from '../../utils/auth';
const uploadRef = ref(null)
let mode = '0'

const selectDate = ref('')

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  category: 'all',
  author: '',
  name: ''
})
const state = reactive({
  data: {},
  curRow: null
})

const form = reactive({
  name: '',
  imageUrl: '',
  category: '',
  content: '',
  author: '',
  id: '',
  price: null,
})
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const clearData = () => {
  form.name = ''
  form.imageUrl = ''
  form.category = ''
  form.content = ''
  form.author = ''
  form.id = ''
  form.price = null
  mode = '0'

}
const content = ref('')
const clearData2 = () => {
  content.value = ''
}
const clearData3 = () => {
  state.curRow = null
  selectDate.value = ''
}
const categoryOptions = [{ value: '0', label: '文学类' },
{ value: '1', label: '人文社科' },
{ value: '2', label: '自然科学' },
{ value: '3', label: '艺术与生活' },
{ value: '4', label: '经济与管理' }]


const categoryOptions2 = [{ value: 'all', label: '全部' }, { value: '0', label: '文学类' },
{ value: '1', label: '人文社科' },
{ value: '2', label: '自然科学' },
{ value: '3', label: '艺术与生活' },
{ value: '4', label: '经济与管理' }]

const categoryFormatter = (row, col, cellValue,) => {

  if (cellValue == '0') {
    return '文学类'
  }

  if (cellValue == '1') {
    return '人文社科'
  }
  if (cellValue == '2') {
    return '自然科学'
  }
  if (cellValue == '3') {
    return '艺术与生活'
  }
  if (cellValue == '4') {
    return '经济与管理'
  }

  return ''
}


const handleAvatarSuccess = (response, uploadFile) => {
  console.log(response)
  form.imageUrl = response.data
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片不能超过 5MB!');
    return false;
  }

  return true;
};



const getBookList = () => {
  let params = { ...queryParams }

  if (queryParams.category == 'all') {
    params.category = null
  }
  axios.get('book/list', { params: params }).then(res => {

    state.data = res

    console.log(state.data)

  })

}

const saveOrUpdate = () => {


  if (mode == '0') {

    axios.post('book', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('新增成功')
      getBookList()

    })
  } else {
    axios.put('book', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('修改成功')
      getBookList()

    })
  }


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
  axios.delete('book/' + row.id).then(res => {
    ElMessage.success("删除成功")
    getBookList()
  })
}

const handleView = (index, row) => {
  dialogVisible2.value = true
  content.value = row.content
}

const handleBorrow = (index, row) => {
  state.curRow = row
  dialogVisible3.value = true
}

const saveBorrow = () => {
  let params = {
    bookId: state.curRow.id,
    username: getUser().username,
    backdate: selectDate.value
  }

  axios.post('borrow', params).then(res => {
    ElMessage.success('借阅成功')
    getBookList()
    dialogVisible3.value=false
  })
}

const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getBookList()
}

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