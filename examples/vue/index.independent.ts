/**
 * 独立版本底栏.
 * 使用方式: 引入打包后的 JS 文件.
 * 让业务方在顶部创建一个 #live-footer-mounter 节点即可.
 */

import Vue from 'vue'
import LiveFooter from './index'

const vm = new Vue({
  components: {
    LiveFooter
  },
  template: '<live-footer></live-footer>'
})

vm.$mount('#live-footer-mounter')
