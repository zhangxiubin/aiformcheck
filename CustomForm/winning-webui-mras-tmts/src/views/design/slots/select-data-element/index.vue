<template>
  <div class="full-height">
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

    <div class="d-flex">
      <div>
    <span style="color: #666;font-size: 14px;">当前已选：</span>
      <el-tag v-if="get(selectedRow, 'rtaNodeName')"
        effect="plain" closable style="margin-right: 16px;"
        @close="selectedRow = null">
        {{ get(selectedRow, 'rtaNodeName') }}
      </el-tag>
    </div>
      <el-pagination
      background
      layout="total, prev, pager, next"
      :total="pagination.total"
      :current-page.sync="pagination.pageNo"
      @current-change="onPageNoChange"

    />
    </div>
    </div>

</template>

<script>
import { get } from 'lodash'
import { getStoragedUserInfo } from '@/utils/cache'
import { createAxios } from '@/api'

export default {
  name: 'SelectDataElement',
  inject: ['setItemDataElement', 'getItemDataElement'],

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
    this.formData.queryLike = ''
    this.pagination.pageNo = 1
    this.selectedRow = this.getItemDataElement()
    this.refresh()
  },
  methods: {

    onPageNoChange () {
      this.refresh()
    },

    onSearch () {
      this.pagination.pageNo = 1
      this.refresh()
    },

    onRowClick (v) {
      this.selectedRow = v
      this.setItemDataElement(v)
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

::v-deep .el-table__row.active {
  // font-weight: bold;
  color: #409EFF;
}
.full-height{
  height: 100%;
}
.d-flex{
  display: flex;
  align-items: center;
  justify-content:space-between;
  margin-top: 10px;
}
</style>
