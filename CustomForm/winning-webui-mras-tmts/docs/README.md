# Form Design

## <smart-form />

```html
<smart-form
  mode="app"
  api-params="{}"
  value-map="{}"
/>
```

### props

|    prop   |  type  |      values     | default value |                                      desc                                     |
|-----------|--------|-----------------|---------------|-------------------------------------------------------------------------------|
| mode      | string | design/app/view | app           | 表单模式(暂时只有两种): 'design'(设计模式), 'app'(应用模式), 'view'(浏览模式) |
| apiParams | object | --              | {}            | 表单项使用接口数据源时，接口入参的动态参数将从这里读取，具体见下面的说明      |
| valueMap  | object | --              | {}            | 主要用于一些动态文本的显示，具体见下面的说明                                  |

**apiParams 说明**
假设 apiParams 传入的是以下值

```js
{
  hospitalSOID: 993718,
  soid: [993718, 10]
}
```

此时表单项中某一个的数据源使用的是接口数据源，其接口参数配置为：

```js
{
  hospitalSOID: 123,
  // 以 $visitPath: 开头的将被解析为动态参数, 从传入的 apiParams prop 中读取, 支持 . 操作符
  soid: '$visitPath:soid',
  // 以 $formPath: 开头的将被解析为动态参数, 从当前表单的 formData 中读取, 支持 . 操作符
  deptId: '$formPath:deptId'
}
```

则此时实际传入接口的参数会被解析为：

```js
{
  hospitalSOID: 123,
  soid: [993718, 10],
  deptId: '' // 从当前表单绑定的数据模型中读取
}
```

**valueMap 说明**

类似于上面 `apiParams` 的处理方式，目前主要用于文本展示元素，在配置显示文本时，
如果是以 `$valueMap:` 开头，则会从传入的 `valueMap` 中动态读取。


### methods

|       method       |                params                |                    desc                    |
|--------------------|--------------------------------------|--------------------------------------------|
| setConfig          | `config`                             | 设置表单项配置                             |
| getConfig          | --                                   | 获取表单项配置                             |
| getFormData        | --                                   | 获取表单绑定的数据模型                     |
| registerComponent  | `({ text, value, desc }, component)` | 注册组件, 当使用自定义表单组件时需要先注册 |
| registerComponents | `(list)`                             | `registerComponent` 的批量方法             |
| updateField        | `(path, value)`                      | 更新指定的数据模型的值                     |
| getComponent       | `(field)`                            | 获取内置组件的引用                         |
| getCustomComponent | `(field)`                            | 获取自定义组件的引用                       |

### events


## <smart-form-design />

```html
<smart-form-design
  mode="app"
  api-params="{}"
  value-map="{}"
/>
```



### props

|      prop      |  type | values | default value |                 desc                |
|----------------|-------|--------|---------------|-------------------------------------|
| left-tab-slots | array | --     | `[]`          | 左侧 tab 插槽配置, 具体见下面的说明 |

`left-tab-slots` 用来配置左侧 tabs 插槽, 默认情况下, 左侧 tabs 只显示一个组件 tab,
如果要添加新的 tab, 则需要配合 `left-tab-slots` 和插槽实现。

`left-tab-slots` 是一个对象数组, 排列顺序即是 tab 的顺序, 结构说明如下：

```js
[
  {
    // 插槽名, 可任意定义(只要是有效的插槽名即可), kebab-case 命名风格, 以 left-tab- 开头, 不得重复
    name: 'left-tab-a',
    // tab 标签名, 即显示的 tab 文本
    label: 'A'
  }
]
```

用法参考

```html
<smart-form-design
  mode="app"
  api-params="{}"
  value-map="{}"
  :left-tab-slots="[
    { name: 'left-tab-a', label: 'A' },
    { name: 'left-tab-b', label: 'B' }
  ]">
  <!--
    - 插槽名必须与 left-tab-slots 中某一项的 name 一致且不得重复;
    - 插槽的顺序不影响 tab 顺序(tab 顺序由 left-tab-slots 决定);
  -->
  <template #left-tab-a>
    <comp-a />
  </template>
  <template #left-tab-b>
    <comp-b />
  </template>
    <!--
    -选择数据元弹框插槽：插槽名必须为select-data-element-slot
  -->
     <template #select-data-element-slot>
        <select-data-element/>
      </template>
</smart-form-design>
```


<details>
  <summary>直接用插槽就能实现，为什么还要加个 <code>left-tab-slots</code> 配置？</summary>
  确实只用插槽就能实现类似功能，增加 <code>left-tab-slots</code> 主要有两个目的：
  <ol>
    <li>控制 tab 顺序</li>
    <li>配置 tab 标签名称</li>
  </ol>
</details>


### methods

|        name        |          params         |                   desc                   |
|--------------------|-------------------------|------------------------------------------|
| setFormData        | `({})`                  | 设置表单绑定的数据模型                   |
| getFormData        | `()`                    | 获取表单绑定的数据模型                   |
| getConfig          | `({})`                  | 获取表单模板的配置                       |
| setConfig          | `({ config, options })` | 设置表单模板的配置                       |
| updateField        | `({ path, value })`     | 更新指定 path 的表单数据模型值           |
| getFormEventBus    | `()`                    | 获取表单中的 event-bus                   |
| validate           | `(callback)`            | 同 element-ui 中 form 组件的同名方法     |
| validateField      | `(props, callback)`     | 同 element-ui 中 form 组件的同名方法     |
| resetFields        | `()`                    | 同 element-ui 中 form 组件的同名方法     |
| clearValidate      | `(props)`               | 同 element-ui 中 form 组件的同名方法     |
| getComponent       | `(field)`               | 根据表单配置的字段名获取内置组件的引用   |
| getCustomComponent | `(field)`               | 根据表单配置的字段名获取自定义组件的引用 |
| pushTypedItem      |`({})`                   | 左侧插槽数据源插入设置数据元基础属性        |

### events

|    event     |             params            |        desc        |
|--------------|-------------------------------|--------------------|
| change-field | `({ path, value, oldValue })` | 表单项值变化时触发 |


### 左侧数据元插入 pushTypedItem的常见配置

```
  {
    apiConf:{  // 数据源参数
    dataProcessor: String,
    dictTypeCode:'',  //数据元类型 1 2
    params: "{}", //数据源请求入参
    url: "",    //url地址
    },
    colProps:{
      span: 24 //宽度
    } ,
    dataOrigin:"dataElement"  //数据元类型 静态static 数据元 dataElement  接口api api,
    defaultValue:'', //默认值,  type=text 文本时必传
    display: true, //默认显示隐藏
    field:'', //字段名 唯一,
    formItemEntityProps: "{\"readonly\":true}", //元素属性
    formItemEntityChildProps:"{}", //子元素属性
    formItemProps:{
        label:'标签名'   //标签文本label
      },
    hideLabel: false, //隐藏标签文本label
    linkageProps:{},  联动设置相关,
    staticData:"[]", //静态数据
    styles: "{\"background\":\"rgba(255, 255, 255, 1)\",\"color\":\"rgba(0, 0, 0, 1)\",\"textAlign\":\"left\",\"fontWeight\":\"normal\",\"lineHeight\":\"30px\",\"height\":30,\"fontSize\":16px}" , //样式
    type:"input" //组件类型
    
}

```

### 右侧数据源-数据元选择 插槽页面 关联方法
 1. 插槽页面只包括 弹框内的内容。 (打开弹框/取消/确认在自定义表单内)
 2. 页面可自已规划主要方法： 设置数据元，获取数据元
  引入：
  ```
  inject: ['setItemDataElement', 'getItemDataElement'], //设置数据元，获取数据元方法

   created () {
    this.selectedRow = this.getItemDataElement()  //在created 获取自定义表单内已选择的数据元
  },
 method:{
     onRowClick (v) {
      this.selectedRow = v
      this.setItemDataElement(v)  //选中数据元后把值传给自定义表单
    },

 }
 ```

## 自定义组件

可以接收到的 props:

|       prop       |  type  |      values     | default value |                                                     desc                                                    |
|------------------|--------|-----------------|---------------|-------------------------------------------------------------------------------------------------------------|
| mode             | string | design/app/view | app           | 同 `<SmartForm>` 的 mode                                                                                    |
| valueMap         | object | --              | {}            | 同 `<SmartForm>` 的 valueMap                                                                                |
| customCompConfig | string | --              |               | 自定义组件支持的自定义配置项, 由具体的组件定义, 可通过注入的 `parseCustomCompConfig` 方法将其解析为 js 对象 |


可注入的方法:

|         method        |      params      |                                                      desc                                                      |
|-----------------------|------------------|----------------------------------------------------------------------------------------------------------------|
| parseCustomCompConfig | customCompConfig | 将 customCompConfig 解析为 js 对象，比如 customCompConfig 为 `"{name: 'Jerry'}"`，解析后为 `{ name: 'Jerry' }` |

