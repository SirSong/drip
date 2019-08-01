//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isShow: false, //弹窗提示
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    containerSize: 0,
    leftRate:'0%',
    leftTime:0,
    speed:0,
    counterArray:[],
    diandiImage:'../images/shuidi_normal@3x.png',
    showShare: true
  },
  //弹窗提示
  showToast: function (e) { //方法
    var that = this
    that.setData({
      isShow: true,
      text: e
    })
    setTimeout(function () {
      that.setData({
        isShow: false
      })
    }, 3000)
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    if (JSON.stringify(options) != "{}") {
      this.setData({
        leftRate:options.leftRate,
        containerSize: options.containerSize
      })
    }
    this.setData({
      showShare: !wx.getStorageSync('showed')
    })
  },
  fillAction: function(e){
    var that=this;
    wx.navigateTo({
      url: '../../pages/filldata/index'
    });
  },
  diandiAction:function (){

    var leftValue = parseFloat(this.data.leftRate);
    var size = this.data.containerSize;

    if (leftValue==null || leftValue<=0 || leftValue> 100){
      var that = this;
      wx.navigateTo({
        url: '../../pages/filldata/index'
      });
      return
    }
    var timestamp = Date.parse(new Date());
    this.data.counterArray.push(timestamp);
    if (this.data.counterArray.length>=5){

      var diffArray = new Array();
      for (var i = 0; i < this.data.counterArray.length; i++) {
        if (i >= 1) {
          var diff = this.data.counterArray[this.data.counterArray.length - i] - this.data.counterArray[this.data.counterArray.length - 1 - i];
          diffArray.push(diff);
        }
      }
      var sum = 0;
      for (var j=0;j<diffArray.length;j++){
        sum += diffArray[j];
      }
      var speedAvg = sum/diffArray.length/1000;   // n秒/滴
      var speedMin = parseInt(60 / speedAvg);  // n滴/每分钟
      var speedMl = speedMin*1/20;  // n滴/每分钟  1滴水1/20ml
      var curValue = leftValue * size / 100;  //剩余多少毫升
      var leftDurating = parseInt(curValue / speedMl);
      this.setData({ 
        speed: sum==0 ? 0 : speedMin,
        leftTime: sum == 0 ? 0 : leftDurating
      });

      this.data.counterArray = [];
    }else{
      //还没到5次
      var failtitl = this.data.counterArray.length;
      this.showToast(failtitl);
    }
  },
  handleTouchStart:function(e){
    //console.log('start');
    this.setData({
      diandiImage: '../images/shuidi_select@3x.png'
    })
  },
  handleTouchEnd:function(e){
    //console.log('end');
    this.setData({
      diandiImage: '../images/shuidi_normal@3x.png'
    })
  },
  closeShow () {
    this.setData({
      showShare: false
    })
    wx.setStorageSync('showed', true)
  },
  onShareAppMessage: function() {
    return {
      title: '不骗你，我真的在输液，明白该做什么了么？',
      path: this.is
    }
  }
})