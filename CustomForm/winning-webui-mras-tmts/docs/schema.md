表单由 `config` 和 `formData` 组成。一般业务中，只需要保存 `config` 即可。


## config

包含了表单模板，包括但不限于元素、排版布局、默认值等。
需要注意的是，对于需要使用接口获取的数据，config 中仅保存相关配置，不会保存通过接口查询到的数据。

可以通过 `setConfig()` 和 `getConfig()` 方法进行设置和读取。


## formData

实际业务场景中，通过用户交互或编程式交互产生的表单数据模型，这些数据不会同步更新到 `config` 中。

可以通过 `setFormData()` 和 `getFormData()` 方法进行设置和读取。


## valueMap


## apiParams

