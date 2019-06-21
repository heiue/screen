
Component({
  properties: {},
  data: {
    listData: [],
    height:500
  },

  attached: function () {
  },

  methods: {
    /**
     * 填充数据
     */
    fillData: function (isPull, listData) {
      this.setData({
        height: 500 + Math.ceil(listData/2)*200
      })
      console.log(listData)

      this.setData({
        listData: listData
      });
    },
  }
})
