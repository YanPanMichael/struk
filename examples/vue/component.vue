<template lang="pug">
footer.link-footer
  .footer-content
    .footer-right.f-right
      ul.footer-img-linker.list-none
        li
          a(target="_blank", href="//link.bilibili.com/p/eden/download")
            .footer-img-item.footer-img-download
              i.icon-font.icon-download
            .footer-img-text 直播姬APP 下载
            .footer-qrcode.qr-zbj
</template>

<style lang="stylus" scoped>
@import '~@blink-common/style/common.styl';

.link-footer {
  .footer-content {
    width: 1160px;
  }
}
</style>

<script>
import "@bilibili-live/component.icon-font";
// import { getGuildInfo } from "./api";

export default {
  props: {
    // 如果传入promise说明外面调用了获取公会上下线接口，
    // 这里就不需要再次调用接口获取，直接在promise.then里获取res即可
    guildPromised: {
      type: Promise,
      default: null,
    },
  },
  data: () => ({
    // 是否显示公会中心
    guildShow: false,
    // 公会中心url
    guildUrl: "",
  }),
  mounted() {
    let promised;

    // 外部没有传入promise就在组件里调用接口
    if (this.guildPromised) {
      promised = this.guildPromised;
    } else {
      // promised = getGuildInfo();
    }
    promised.then((res) => {
      const { footer, url } = res.data.data;
      this.guildShow = footer;
      this.guildUrl = url;
    });
  },
};
</script>
