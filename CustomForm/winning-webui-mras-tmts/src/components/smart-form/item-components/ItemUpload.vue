<template>

  <!-- <el-upload
    v-bind="parsedFormItemEntityProps"
    v-model="localValue"
    v-loading="loading || requestState === 'pending'">
  </el-upload> -->
   <el-upload
        multiple
        :headers="headers"
       :action="uploadURL"
        :show-file-list="false"
        :file-list="fileList"
        :on-success="onUploadSuccess"
        :on-remove="onRemove"
      >
        <el-button
          v-if="disabled"
          :disabled="!(get(formData, 'attachmentList.length') > 0)"
          size="small"
          icon="w-icon-download"
          type="primary"
          plain
          @click="onBatchDownload"
        >
          全部下载
        </el-button>
        <el-button
          v-else
          slot="trigger"
          size="small"
          icon="w-icon-upload"
          type="primary"
          plain
        >
          点击上传
        </el-button>
        <!-- <div v-if="!disabled" slot="tip" class="w-upload__tip">
        最多只能上传 5 个文件
      </div> -->
        <el-button
          class="ml-2"
          type="text"
          v-if="linkToName"
          @click="downloadTemplate"
        >
          {{ linkText || '模板下载' }}
        </el-button>
        <ul
    class="w-upload-list w-upload-list--text is-disabled"
  >
    <li
      v-for="item in formData.attachmentList"
      :key="item.path"
      title="点击可下载"
      tabindex="0"
      class="w-upload-list__item is-success"
      @click="onDownload(item)"
    >
      <span class="w-upload-list__item-name">
        <i class="w-icon-file"></i>
        {{ item.name }}
      </span>
      <label class="w-upload-list__item-status-label">
        <i class="w-icon-upload-success w-icon-right"></i>
      </label>
    </li>
  </ul>
      </el-upload>
</template>

<script>
import { dwonloadBlob } from '@/utils/dwonloadBlob'
import { getStoragedUserInfo } from '@/utils/cache'
import mixin from '../mixins'
import { createAxios } from '@/api'

export default {
  name: 'ItemSwitch',
  mixins: [mixin],
  data () {
    return {
      templateList: [{
        name: '模板1',
        url: ''
      }],
      fileList: [],
      uploadURL: '/mras-mdm/api/v1/mras_business/casebus/mras_request_form_image/upload',
      downLoadURL: '/mras-mdm/api/v1/mras_business/casebus/mras_request_form_image/download',
      formData: {
        attachmentList: []
      }
    }
  },
  computed: {
    headers () {
      return {
        Authorization: sessionStorage.getItem('Authorization')
      }
    }
  },
  methods: {

    onUploadSuccess (res, file, fileList) {
      console.log(res, file, fileList)
      const { medImageName, medImagePath } = res.data

      // // 上传成功后将文件信息保存到 attachmentList 中
      this.formData.attachmentList.push({
        name: medImageName,
        path: medImagePath
      })
    },
    onRemove (file, fileList) {
      const { name } = file
      const index = this.formData.attachmentList.findIndex((v) => v.name === name)
      this.formData.attachmentList.splice(index, 1)
    },
    downloadTemplate () {

    },
    async onDownload ({ name, path }) {
      debugger
      const { hospitalSOID } = getStoragedUserInfo()

      this.loading = true
      try {
        createAxios().post(this.downLoadURL, {

          hospitalSOID,
          soid: [hospitalSOID, 10],
          filePath: path,
          fileName: name

        }).then(res => {
          console.log(res)

          dwonloadBlob(res, { filename: name })
        })
      } catch (error) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
