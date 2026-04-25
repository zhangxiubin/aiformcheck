<template>
  <div class="CustomFormItem pos-r">
    <el-table :data="tableData" border size="small" class="dense-input">
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="性别" prop="gender" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-link type="success" @click="onAdd(row)">增加</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'CustomFormItem',
  data () {
    return {
      loading: false,
      tableData: [
        { name: '张三', gender: '男', id: '1' },
        { name: '李四', gender: '女', id: '2' }
      ]
    }
  },
  methods: {
    async onAdd (row) {
      console.log(row)
      try {
        await this.$confirm('确定添加', '提示', {
          type: 'warning'
        })
        this.tableData.push({
          name: 'aa',
          gender: '未知',
          id: '3'
        })
      } catch (e) {}
    }
  }
}
</script>
