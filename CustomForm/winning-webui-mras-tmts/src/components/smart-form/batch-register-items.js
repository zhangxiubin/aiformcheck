import { camelCase, upperFirst } from 'lodash'

export default function () {
  const components = {}

  const requireComponent = require.context(
    // 其组件目录的相对路径
    './item-components',
    // 是否查询其子目录
    false,
    // 匹配场景组件文件名的正则表达式
    /Item[A-Z]\w+\.(vue|js)$/
  )

  requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)

    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
      camelCase(
        // 获取和目录深度无关的文件名
        fileName.split('/').pop().replace(/\.\w+$/, '')
      )
    )

    components[componentName] = componentConfig.default || componentConfig
  })

  return components
}
