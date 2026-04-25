<template>
  <w-button plain @click="dialogVisible1 = true"> 基础 Dialog </w-button>
  <w-button plain @click="dialogVisible2 = true"> 彩色 Dialog </w-button>
  <w-button plain @click="dialogVisible3 = true"> 无多余边距 Dialog </w-button>

  <w-dialog
    v-model:model-value="dialogVisible1"
    title="基础 Dialog"
    subtitle="这是一个副标题"
    width="500"
    :before-close="handleClose"
  >
    <span>Dialog 内容</span>
    <template #footer>
      <div class="dialog-footer">
        <w-button @click="dialogVisible1 = false">取消</w-button>
        <w-button type="primary" @click="dialogVisible1 = false">
          确定
        </w-button>
      </div>
    </template>
  </w-dialog>

  <w-dialog
    v-model:model-value="dialogVisible2"
    title="彩色 Dialog"
    width="500"
    color
    :before-close="handleClose"
  >
    <span>Dialog 内容</span>
    <template #footer>
      <div class="dialog-footer">
        <w-button @click="dialogVisible2 = false">取消</w-button>
        <w-button type="primary" @click="dialogVisible2 = false">
          确定
        </w-button>
      </div>
    </template>
  </w-dialog>

  <w-dialog
    v-model:model-value="dialogVisible3"
    title="无多余边距 Dialog"
    width="500"
    vertical-paddingless
    horizontal-paddingless
    :before-close="handleClose"
  >
    <div
      style="
        background-color: #e9e9e9;
        height: 150px;
        border-radius: 0 0 4px 4px;
      "
    >
      Modal 内容
    </div>
  </w-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WMessageBox } from 'spark'

const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)

const handleClose = (done: () => void) => {
  WMessageBox.confirm('确认关闭 Dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>