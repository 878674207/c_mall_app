<template>
  <!-- 下拉选择 省市区 -->
  <view class="cityBase">
    <view>
      <view class="showcss" @click.prevent="hideKeyboard('cityCase')"></view>
      <u--input style="width:100%" v-model="columnsName" disabledColor="#ffffff" placeholder="省、市、区" border="none" />
    </view>
    <u-picker :show="isShowSheet" ref="uPicker" title="请选择所在地" :visibleItemCount="7" :itemHeight="65" :columns="columns" :defaultIndex="defaultIndex" @confirm="confirm" @change="changeHandler" @cancel="isShowSheet = false" @close="isShowSheet = false"></u-picker>
  </view>
</template>
<script>
import { getLocationQuery } from '@/api/system/pages'
export default {
  props: {
    cityCodes: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: null,
    },
  },
  watch: {
    cityCodes() {
      console.log(444)
      this.getColumnsList()
      this.columnsName = this.label
    },
  },
  data() {
    return {
      isShowSheet: false,
      columns: [],
      provinceList: [], // 省份数据
      cityList: [], // 城市数据，根据选择的省份动态生成
      districtList: [], //
      defaultIndex: [],
      params: {
        level: 0,
        parentCode: 0,
      },
      columnsName: null,
    }
  },
  created(event) {
    this.getColumnsList()
    this.columnsName = this.label
  },
  methods: {
    hideKeyboard() {
      console.log(1111)
      // 打开弹框
      this.isShowSheet = true
    },
    async getColumnsList() {
      // 获取省的数据
      let provinceList = await getLocationQuery({
        level: 1,
      }).then((res) => {
        this.provinceList = [...res.data]
        return res.data
      })
      // 获取市的数据
      // 判断是否是回显，cityCodes.length>0则是已选择过回显，否则第一次选
      let cityCode =
        this.cityCodes.length > 0 ? this.cityCodes[0] : provinceList[0].code
      let cityList = await getLocationQuery({
        level: 2,
        parentCode: cityCode,
      }).then((res) => {
        this.cityList = [...res.data]
        return res.data
      })
      // 获取区的数据
      let districtCode =
        this.cityCodes.length > 0 ? this.cityCodes[1] : cityList[0].code
      let districtList = await getLocationQuery({
        level: 3,
        parentCode: districtCode,
      }).then((res) => {
        this.districtList = [...res.data]
        return res.data
      })
      let indexs = []
      provinceList = provinceList.map((r, index) => {
        if (r.code === this.cityCodes[0]) indexs[0] = index
        return r.name
      })
      cityList = cityList.map((r, index) => {
        if (r.code === this.cityCodes[1]) indexs[1] = index
        return r.name
      })
      districtList = districtList.map((r, index) => {
        if (r.code === this.cityCodes[2]) indexs[2] = index
        return r.name
      })
      this.columns = [[...provinceList], [...cityList], [...districtList]]
      this.defaultIndex = indexs
    },
    async changeHandler(e) {
      const {
        columnIndex,
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker,
      } = e
      // 如果当前选择的是省  则查出市/区两者的数据 并渲染set
      if (columnIndex === 0) {
        this.params.level = 2
        this.params.parentCode = this.provinceList[index].code
        let cityList = await getLocationQuery(this.params).then((res) => {
          this.cityList = [...res.data]
          return res.data.map((r) => r.name)
        })
        this.params.level = 3
        this.params.parentCode = this.cityList[0].code
        let districtList = await getLocationQuery(this.params).then((res) => {
          this.districtList = [...res.data]
          return res.data.map((r) => r.name)
        })
        picker.setColumnValues(1, cityList)
        picker.setColumnValues(2, districtList)
      }
      // 如果当前选择的是市  则查出 区 的数据 并渲染set
      if (columnIndex === 1) {
        this.params.level = 3
        this.params.parentCode = this.cityList[index].code
        let districtList = await getLocationQuery(this.params).then((res) => {
          this.districtList = [...res.data]
          return res.data.map((r) => r.name)
        })
        picker.setColumnValues(2, districtList)
      }
    },
    // 回调参数为包含columnIndex、value、values
    confirm(e) {
      let params = {
        provinceCode: this.provinceList[e.indexs[0]].code,
        provinceName: this.provinceList[e.indexs[0]].name,
        cityCode: this.cityList[e.indexs[1]].code,
        cityName: this.cityList[e.indexs[1]].name,
        areaCode: this.districtList[e.indexs[2]].code,
        areaName: this.districtList[e.indexs[2]].name,
        columnsName: e.value.join('/'),
      }
      this.columnsName = params.columnsName
      console.log(params)
      this.$emit('change', params)
      this.isShowSheet = false
    },
  },
}
</script>
<style scoped lang="scss">
.cityBase {
  position: relative;
}
.showcss {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
}
</style>