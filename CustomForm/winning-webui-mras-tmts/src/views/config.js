const FORM_CONF = {
  formProps: {
    labelPosition: 'right',
    labelWidth: '80px',
    size: 'mini'
  },
  rowProps: {
    gutter: 8
  },
  items: [
    {
      id: 'zOWcwgDcSuz20IvOm8Gur1',
      field: 'text',
      type: 'text',
      defaultValue: '标题文本',
      colProps: {
        span: 24
      },
      formItemProps: {
        label: '纯文本'
      },
      textProps: {}
    },
    {
      id: 'eljbtRNsnTclGWa6NhcX6',
      field: 'name',
      type: 'input',
      customComp: '',
      defaultValue: '张三',
      colProps: {
        span: 6
      },
      formItemProps: {
        label: '姓名'
      },
      dataOrigin: 'static',
      staticData: null,
      apiData: null,
      apiConf: {
        method: 'post',
        url: '',
        params: {}
      }
    },
    {
      id: '6OS1LVj1290HypOlO16IX',
      field: 'gender',
      type: 'radio',
      customComp: '',
      defaultValue: 3,
      colProps: {
        span: 6
      },
      formItemProps: {
        label: '性别'
      },
      dataOrigin: 'static',
      staticData: [
        {
          text: '男',
          value: 1
        },
        {
          text: '女',
          value: 2
        },
        {
          text: '未知',
          value: 3
        }
      ],
      apiData: null,
      apiConf: {
        method: 'post',
        url: '',
        params: {}
      }
    },
    {
      id: 'iDnlvp-3pqntGtVvzcXKB',
      field: 'cities',
      type: 'checkbox',
      customComp: '',
      defaultValue: [1],
      colProps: {
        span: 6
      },
      formItemProps: {
        label: '城市'
      },
      dataOrigin: 'static',
      staticData: [
        {
          text: '合肥',
          value: 1
        },
        {
          text: '芜湖',
          value: 2
        },
        {
          text: '其他',
          value: 3
        }
      ],
      apiData: null,
      apiConf: {
        method: 'post',
        url: '',
        params: {}
      }
    },
    {
      id: 'zOWcwgDcSuz20IvOm8Gur',
      field: 'food',
      type: 'select',
      customComp: '',
      defaultValue: ['long-xu-mian'],
      colProps: {
        span: 6
      },
      formItemProps: {
        label: '食物'
      },
      dataOrigin: 'static',
      staticData: [
        {
          text: '黄金糕',
          value: 'huang-jin-gao'
        },
        {
          text: '双皮奶',
          value: 'shuang-pi-nai'
        },
        {
          text: '龙须面',
          value: 'long-xu-mian'
        }
      ],
      apiData: null,
      apiConf: {
        method: 'post',
        url: '',
        params: {}
      }
    },
    {
      id: 'zOWcwgDcSuz20IvOm8Gur1',
      field: 'persons',
      customComp: 'CustomFormItem',
      defaultValue: [],
      colProps: {
        span: 24
      },
      formItemProps: {
        label: '人员'
      }
    }
  ]
}

export {
  FORM_CONF
}
