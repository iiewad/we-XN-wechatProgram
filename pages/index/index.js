const app = getApp();
const util = require('../../utils/util.js');

import { Kb } from 'kb/kb-model.js';
var kb = new Kb();

Page({
  data: {
    menuItems: [
      {
        name: '成绩查询',
        imagePath: '../../images/menu-grade.png',
        funcName: 'cj',
        funcStatus: true
      },
      {
        name: '电费查询',
        imagePath: '../../images/menu-energy-charge.png',
        funcName: 'df',
        funcStatus: true
      },
      {
        name: '课表查询',
        imagePath: '../../images/menu-class-schedule.png',
        funcName: 'kb',
        funcStatus: true
      },
      {
        name: '借阅信息',
        imagePath: '../../images/menu-borrow-books.png',
        funcName: 'jy',
        funcStatus: true
      },
      {
        name: '一卡通',
        imagePath: '../../images/menu-card.png',
        funcName: 'ykt',
        funcStatus: true
      },
      {
        name: '图书查询',
        imagePath: '../../images/menu-book.png',
        funcName: 'ts',
        funcStatus: false
      },
      {
        name: '损坏保修',
        imagePath: '../../images/menu-maintain.png',
        funcName: 'bx',
        funcStatus: false
      },
      {
        name: '空教室',
        imagePath: '../../images/menu-classroom.png',
        funcName: 'js',
        funcStatus: false
      }
    ],
    funcItems: [
      '1'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    loginFlag: false,
    funcEnabled: false,
    // 今天课表
    todayTable: [],
    loadingHidden: 0
  },
  tapFuncDisable: function () {
    console.log('未绑定用户信息')
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'stuUserInfo',
      success: function (res) {
        that.setData({
          loginFlag: true,
          funcEnabled: true
        });
        // 今天课表
        that.getTerm();
      },
      fail: function () {
        that.setData({
          funcEnabled: false
        });
      }
    });
  },
  /**
   * 获取当前学期
   */
  getTerm() {
    kb.getTerms((terms) => {
      var term = kb.getCurrentTerm(terms);
      var weekCounts = kb.getWeekCounts(term);
      var currentWeek = weekCounts.currentWeek;
      if (currentWeek != -1) {
        var that = this;
        var params = {
          term: term,
          week: currentWeek,
          callback: function (data) {
            var timeTable = kb.getCurrentDayTable(data);
            console.log(timeTable);
            that.setData({
              todayTable: timeTable,
              loadingHidden: 1
            });
          }
        };
        kb.getTimeTable(params);
      } else {
        this.setData({
          todayTable: [],
          loadingHidden: 1
        });
      }
    });
  },
})