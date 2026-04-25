import { createAxios } from '@/api'

const axios = createAxios()

export default {
  data () {
    return {
      fullPermissions: []
    }
  },
  created () {
    this.queryPermissionList()
  },
  methods: {
    async queryPermissionList () {
      const { hospitalSOID } = this.customProps || {}
      if (!hospitalSOID) return

      this.loading = true
      try {
        const res = await axios.post(
          '/mras-mdm/api/v1/mras_mas_mars/mras_permission_class/mas/query/query_permission_with_class',
          {
            hospitalSOID,
            soid: [hospitalSOID, 10],
            dirClassCode: '399582870'
          }
        )
        if (!res.success) return

        this.fullPermissions = res.data || []
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
