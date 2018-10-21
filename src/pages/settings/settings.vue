<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="settings-list">
      <div class="item" @click="go('/change-mobile')">
        <span>修改手机号</span>
        <img src="./more@2x.png" alt="" class="fr more">
      </div>
      <div class="item" @click="go('/set-money')">
        <span>设置支付密码</span>
        <img src="./more@2x.png" alt="" class="fr more">
      </div>
    </div>
    <div class="btn">
      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MHeader from 'components/m-header/m-header';
  import {clearUser, setTitle} from 'common/js/util';
  // import {getAppId} from 'api/general';
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data() {
      return {};
    },
    mounted() {
      setTitle('设置');
      this.pullUpLoad = null;
    },
    methods: {
      go(url) {
        this.$router.push(url);
      },
      logout() {
        clearUser();
        setTimeout(() => {
          this.go('/login');
        }, 800);
      }
    },
    components: {
      Scroll,
      MFooter,
      MHeader
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0.98rem;
    top: 0;
    left: 0;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .settings-list {
      background: $color-highlight-background;
      padding: 0 0.3rem;
      margin-bottom: 1.63rem;
      /*position: absolute;*/
      /*top: 4.26rem;*/
      /*bottom: 0;*/
      /*left: 0.3rem;*/
      /*right: 0.3rem;*/
      .item {
        width: 100%;
        height: 1.1rem;
        font-size: $font-size-medium-xx;
        line-height: 1.1rem;
        border-bottom: 1px solid #eee;
        img {
          height: 0.34rem;
        }
        .more {
          margin-top: 0.3rem;
        }
      }
    }
    .btn {
      padding: 0 0.3rem;
      button {
        width: 100%;
        height: 0.84rem;
        border: 1px solid $primary-color;
        color: $primary-color;
        border-radius: 0.08rem;
        font-size: $font-size-medium-x;
        background: $color-highlight-background;
      }
    }
  }
</style>
