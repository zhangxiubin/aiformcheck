<template>
  <el-dialog custom-class="" width="800px"
    title="选择数据元" v-loading.fullscreen="loading"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="visible"
    :before-close="emitClose"
    @open="onOpen">
    <div class="mb-2">
    <el-input v-model="formData.queryLike" size="small"
      clearable placeholder="输入关键次搜索"
      @clear="onSearch"
      @keyup.native.enter="onSearch">
      <template #append>
        <el-button icon="el-icon-search" @click="onSearch" />
      </template>
    </el-input>
  </div>
    <el-table ref="table" :data="tableData"
      border stripe size="small"
      highlight-current-row
      :row-class-name="calcRowClassName"
      height="400"
      @row-click="onRowClick">
      <el-table-column
        v-for="col in cols"
        v-bind="col"
        :key="col.prop"
      />
    </el-table>

    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      :current-page.sync="pagination.pageNo"
      @current-change="onPageNoChange"

    />

    <template #footer>
      <span style="color: #666;font-size: 14px;">当前已选：</span>
      <el-tag v-if="get(selectedRow, 'rtaNodeName')"
        effect="plain" closable style="margin-right: 16px;"
        @close="selectedRow = null">
        {{ get(selectedRow, 'rtaNodeName') }}
      </el-tag>
      <el-button size="small" @click="emitClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { get, cloneDeep } from 'lodash'
import { getStoragedUserInfo } from '@/utils/cache'
import { createAxios } from '@/api'

export default {
  name: 'SelectDataElement',

  props: {
    visible: Boolean,
    element: Object
  },
  data () {
    return {
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        pageNo: 1
      },
      cols: [
        // { label: '上报数据元分类编码', prop: 'rtaClassNo', width: '140', showOverflowTooltip: true },
        { label: '上报表单名称', prop: 'valuesetCtrlName' },
        { label: '上报数据元分类名称', prop: 'rtaClassName' },
        { label: '数据元标识', prop: 'mrasEleDataId', width: '100', showOverflowTooltip: true },
        { label: '上报数据采集项名称', prop: 'rtaNodeName' },
        { label: '上报节点编码', prop: 'rtaNodeNo', width: '100' }
      ],
      tableData: [],
      formData: {
        queryLike: ''
      },
      selectedRow: {}
    }
  },
  created () {
    this.onOpen()
  },
  methods: {
    emitClose () { this.$emit('update:visible', false) },
    onSubmit () {
      this.$emit('submit', cloneDeep(this.selectedRow))
      this.emitClose()
    },

    onOpen () {
      this.selectedRow = this.element
      this.formData.queryLike = ''
      this.pagination.pageNo = 1
      this.refresh()
    },

    onPageNoChange () {
      this.refresh()
    },

    onSearch () {
      this.pagination.pageNo = 1
      this.refresh()
    },

    onRowClick (v) {
      console.log(v)
      this.selectedRow = v
    },

    calcRowClassName ({ row }) {
      if (row.mrasEleDataId === this.selectedRow?.mrasEleDataId) return 'active'
      return ''
    },

    async refresh () {
      const url = '/mras-mdm/api/v1/mras_mas_mars/mras_ele_rta_data/mas/query/by_example'
      const { hospitalSOID } = getStoragedUserInfo()

      const { pageNo, pageSize } = this.pagination

      this.loading = true
      try {
        const res = await createAxios().post(url, {
          hospitalSOID,
          soid: [hospitalSOID, 10],
          queryLike: this.formData.queryLike,
          pageType: 'P',
          pageNo: pageNo - 1,
          pageSize
        })
        if (!res.success) return

        console.log(res)
        this.tableData = res.data || []
        if (pageNo === 1) {
          this.pagination.total = parseInt(res.count, 10)
        }

        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    get
  } // end of methods
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

::v-deep .el-table__row.active {
  // font-weight: bold;
  color: #409EFF;
}
</style>
