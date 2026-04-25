<template>
  <el-dialog
    v-loading="loading"
    custom-class="smart-form-config-import-dialog" width="360px"
    title="导入"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="visible"
    :before-close="emitClose"
    @close="removeFile">
    <el-radio-group v-model="importMode" style="margin-bottom: 20px;">
      <el-radio label="cover">覆盖导入</el-radio>
      <el-radio label="append">追加导入</el-radio>
    </el-radio-group>

    <el-upload ref="upload"
      accept=".mras-form"
      action=""
      :disabled="!!file"
      :auto-upload="false"
      :limit="1"
      :show-file-list="false"
      :on-remove="onFileRemove"
      :on-change="onFileChange">
      <el-button size="small"
        :disabled="!!file"
        :title="file ? '如要重选，请先删除已选的' : ''"
        type="primary">
        选择文件
      </el-button>
      <template #tip>
        <p class="w-upload__tip">1. 只能选择 {{ extFilename }} 文件，且不超过{{ maxKB }}kb</p>
        <p class="w-upload__tip">2. 一次只能选择 1 个文件</p>
      </template>
    </el-upload>
    <div v-if="file" class="file-pane mt-4">
      <div class="file-name">
        <div class="file-name-text" :title="file.name">{{ file.name }}</div>
        <div class="spacer"></div>
        <span class="file-remove-action" @click="removeFile">移除</span>
        <!-- <i class="w-icon w-icon-delete" style="cursor: pointer;"
          @click="removeFile">
        </i> -->
      </div>
      <!-- <el-divider /> -->
      <p class="file-tip">文件大小：{{ formatSize(file.size) }}</p>
      <!-- <p class="file-tip">最后修改时间：{{ formatTime(file.raw.lastModified) }}</p> -->
    </div>

    <template #footer>
      <el-button size="small" @click="emitClose">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
// import { format } from 'date-fns'
// import { pushAccountsToStorage } from '@/utils/storage-biz'

export default {
  name: 'ImportDialog',
  inject: ['getFormRef'],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      fileList: [],
      file: null,
      maxKB: 1024,
      extFilename: '.mras-form',
      // 导入模式: cover(覆盖导入), append(追加导入)
      importMode: 'cover'
    }
  },
  methods: {
    emitClose () { this.$emit('update:visible', false) },
    onSubmit () {
      // console.log(this.file)
      const { flag, msg } = this.validateFile()
      if (!flag) {
        this.$message.error(msg)
        return
      }

      // console.log('即将导入')
      this.loading = true
      // 读取文件
      const reader = new FileReader()
      reader.onload = e => {
        this.importFormConfig(e.target.result)
      }
      reader.onerror = e => {
        // console.log(e)
        this.loading = false
      }

      try {
        reader.readAsText(this.file.raw)
      } catch (e) {
        // console.log(e)
        this.loading = false
      }
    },
    onFileRemove (file, fileList) {
      this.file = null
    },
    onFileChange (file, fileList) {
      this.file = file
    },
    removeFile () {
      try {
        this.$refs.upload.clearFiles()
        this.file = null
      } catch (e) {}
    },
    formatSize (size) {
      if (size < 1024) return `${size} B`

      size = size / 1024
      if (size < 1024) return `${size} KB`

      return `${size} MB`
    },
    // formatTime (time) {
    //   try {
    //     time = format(time, 'yyyy-MM-dd HH:mm:ss')
    //   } catch (e) {
    //     console.log(e)
    //   }
    //   return time
    // },
    validateFile () {
      let flag = true
      let msg = ''

      const { extFilename } = this
      const { name, size } = this.file || {}
      // 校验文件扩展名
      if (!(name || '').toLowerCase().endsWith(extFilename)) {
        flag = false
        msg = `文件名必须是 ${extFilename}（以 ${extFilename} 结尾）文件`
      } else {
        // 校验文件大小
        if (size === 0) {
          flag = false
          msg = '文件内容为空'
        } else if (size > (this.maxKB * 1024)) {
          flag = false
          msg = `文件大小不得超过 ${this.maxKB} KB`
        }
      }

      return { flag, msg }
    },
    async importFormConfig (text) {
      // console.log(text)
      let json = null
      try {
        json = JSON.parse(text)
      } catch (e) {}

      const form = this.getFormRef()
      if (this.importMode === 'append') {
        // 追加导入
        const config = form.getConfig()
        config.items = config.items.concat(json.items)
        form.setConfig(config)
      } else {
        // 覆盖导入
        form.setConfig(json)
        this.$emit('update-template-name', json.name)
      }

      this.loading = false
      this.emitClose()
    }
  }
}
</script>

<style lang="scss">
.smart-form-config-import-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }

  .file-pane {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }

  .file-name {
    padding: 8px;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;

    &-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-remove-action {
      white-space: nowrap;
      cursor: pointer;
      color: #F56C6C;
      margin-left: 8px;
    }
  }

  .file-tip {
    padding: 2px 8px;
    font-size: 12px;
    color: var(--FONT-COLOR-SECOND, #666);
    // margin-top: 5px;
  }
}
</style>
