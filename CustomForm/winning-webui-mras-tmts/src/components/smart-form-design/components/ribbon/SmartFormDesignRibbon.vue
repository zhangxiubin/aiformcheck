<template>
  <div class="smart-form-design-ribbon" v-resize="resize" >
    <el-select v-model="formData.mode" size="mini" placeholder="模式"
      style="width: 100px;margin-right: 8px;"
      @change="$emit('change-mode', $event)">
      <el-option
        v-for="item in modes"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      />
    </el-select>
    <el-input v-model.trim="formData.templateName"
      clearable size="mini" style="width: 240px;"
      placeholder="模板名称"
      @change="onTemplateNameChange"
    />
    <!-- <p style="margin: 0 0 0 8px;color: #999;font-size: 12px;">
      设计模式下，表单项的值变化后会重置其他表单项的值。
    </p> -->
    <div class="spacer"></div>
    <el-dropdown
      v-if="actionsMode === 'collapsed'"
      split-button type="primary" size="mini" trigger="click"
      @click="onAction('save')"
      @command="onAction">
      保存
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in actions.filter(v => v.value !== 'save')"
          :key="item.value" :icon="item.icon" :command="item.value">
          {{ item.text }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <div v-else-if="actionsMode === 'spreaded'">
      <el-button
        v-for="item in actions"
        :key="item.value"
        :type="item.type"
        size="mini"
        round plain
        @click="onAction(item.value)">
        {{ item.text }}
      </el-button>
    </div>

    <!-- <el-dropdown
      v-else size="mini" trigger="click"
      @click="onAction('save')"
      @command="onAction">
      <span class="el-dropdown-link">
        <i class="el-icon-arrow-down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in actions"
          :key="item.value" :command="item.value">
          {{ item.text }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->

    <ImportDialog :visible.sync="importVisible"
      @update-template-name="onUpdateTemplateName"
    />

    <ExportDialog :visible.sync="exportVisible"
      :form-name="formData.templateName"
    />
  </div>
</template>

<script>
import { throttle } from 'lodash'
import ImportDialog from './ImportDialog'
import ExportDialog from './ExportDialog'

export default {
  name: 'SmartFormDesignRibbon',
  inject: ['getFormRef'],
  components: {
    ImportDialog,
    ExportDialog
  },
  data () {
    const modes = [
      { text: '设计模式', value: 'design' },
      { text: '应用模式', value: 'app' },
      { text: '浏览模式', value: 'view' }
    ]

    return {
      loading: false,
      importVisible: false,
      exportVisible: false,
      modes,
      formData: {
        mode: modes[0].value,
        templateName: ''
      },
      actions: [
        { text: '清空', value: 'clear', type: 'danger', icon: 'el-icon-delete-solid' },
        { text: '导入', value: 'import', type: 'info', icon: 'el-icon-download' },
        { text: '导出', value: 'export', type: 'info', icon: 'el-icon-upload2' },
        { text: '预览', value: 'preview', type: 'success', icon: 'el-icon-view' },
        { text: '保存', value: 'save', type: 'primary', icon: '' }
      ],
      /*
       * 操作按钮显示模式
       *   'spreaded': 按钮展开
       *   'collapsed': 收缩的
       *   [其他值]: 不显示
       */
      actionsMode: ''
    }
  },

  created () {
    window.addEventListener('resize', this.$_onResize, false)
  },

  mounted () {
    this.updateActionMode()
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.$_onResize)
  },

  methods: {
    setTemplateName (name) {
      this.formData.templateName = name
    },

    updateActionMode () {
      const { width } = this.$el.getBoundingClientRect()
      console.log(width)
      if (width >= 760) {
        this.actionsMode = 'spreaded'
      } else if (width >= 460) {
        this.actionsMode = 'collapsed'
      } else {
        // 如果宽度太小就不显示了, 这种情况下不适合做模板设计
        this.actionsMode = ''
      }
    },

    onUpdateTemplateName (name) {
      this.setTemplateName(name)
    },
    onTemplateNameChange (name) {
      this.getFormRef().setConfig({
        name: name
      })
    },
    onAction (action) {
      switch (action) {
        case 'clear': // 清空
          this.$_onClear()
          break
        case 'save': // 保存
          this.$emit('save')
          break
        case 'import': // 导入
          this.importVisible = true
          break
        case 'export': // 导出
          this.exportVisible = true
          break
        case 'preview': // 预览
          this.$emit('preview')
          break
      }

      if (action === 'import') {
        this.importVisible = true
      } else if (action === 'export') {
        this.exportVisible = true
      } else {
        this.$emit('action', {
          action,
          templateName: this.formData.templateName
        })
      }
    },
    async $_onClear () {
      try {
        await this.$confirm('确定清空？', '提示', {
          type: 'warning'
        })
        this.getFormRef().clearItems()
      } catch (e) {}
    },

    $_onResize: throttle(function () {
      this.updateActionMode()
    }, 300),
    resize () { // 当宽高变化时就会执行
      // 执行某些操作
      this.updateActionMode()
    }
  }, // end of methods
  directives: { // 使用局部注册指令的方式
    resize: { // 指令的名称
      bind (el, binding) { // el为绑定的元素，binding为绑定给指令的对象
        let width = ''; let height = ''
        function isReize () {
          const style = document.defaultView.getComputedStyle(el)
          if (width !== style.width || height !== style.height) {
            binding.value() // 关键
          }
          width = style.width
          height = style.height
        }
        el.__vueSetInterval__ = setInterval(isReize, 300)
      },
      unbind (el) {
        clearInterval(el.__vueSetInterval__)
      }
    }
  }
}
</script>

<style lang="scss">
.smart-form-design-ribbon {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #ccc;
  padding: 0 8px;

  .spacer {
    flex: 1;
  }
}
</style>
