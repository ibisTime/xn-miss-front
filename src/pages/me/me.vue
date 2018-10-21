<template>
  <div class="me-wrapper">
    <div class="me-top" @click="go('/settings')">
      <div class="info-wrap">
        <div class="userPhoto fl" :style="getImgSyl(userInfo ? userInfo.photo : '')"></div>
        <div class="info fl">
          <div class="nickname">{{userInfo.nickname}}</div>
          <div class="mobile">{{userInfo.mobile}}</div>
        </div>
      </div>
      <img src="./more@2x.png" class="icon-more">
    </div>
    <div class="me-list" ref="description">
      <Scroll :pullUpLoad="pullUpLoad" ref="scroll">
        <div class="item mt20 account-wrap" @click="go('/money?accountNumber=' + accountInfo.accountNumber)">
          <div class="wrap">
            <img class="icon" src="./account@2x.png">
            <span>账户余额</span>
            <span class="account fr"><i>¥</i>{{formatAmount(accountInfo.amount)}}</span>
            <img src="./more@2x.png" class="more">
          </div>
        </div>
        <div class="item mt20" @click="go('/follow')">
          <div class="wrap border-bottom-1px">
            <img class="icon" src="./comeOn@2x.png">
            <span>我的加油</span>
            <img src="./more@2x.png" class="more">
          </div>
        </div>
        <div class="item" @click="go('/follow')">
          <div class="wrap border-bottom-1px">
            <img class="icon" src="./collection@2x.png">
            <span>我的关注</span>
            <img src="./more@2x.png" class="more"></div>
        </div>
        <div class="item" @click="go('/settings')">
          <div class="wrap">
            <img class="icon" src="./matchInfo@2x.png">
            <span>赛事信息</span>
            <img src="./more@2x.png" class="more">
          </div>
        </div>
        <div class="item mt20" @click="go('/settings')">
          <div class="wrap">
            <img class="icon" src="./setting@2x.png">
            <span>个人设置</span>
            <img src="./more@2x.png" class="fr more">
          </div>
        </div>
      </Scroll>
    </div>
    <m-footer></m-footer>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" :text="text"></toast>
  </div>
</template>
<script>
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import MFooter from 'components/m-footer/m-footer';
  import Scroll from 'base/scroll/scroll';
  import { formatAmount, formatImg, setTitle, getUserId } from 'common/js/util';
  import {getUserDetail} from 'api/user';
  import { getAccount } from 'api/account';
  import defaltAvatarImg from '../../common/image/avatar@2x.png';

  export default {
    data() {
      return {
        loading: false,
        showBack: false,
        userInfo: {},
        text: '',
        cny: 0,
        accountInfo: {
          amount: 0
        }
      };
    },
    created() {
      this.pullUpLoad = null;
      this._refreshScroll();
    },
    mounted() {
      setTitle('我的');
      let userId = this.getUserId();
      if(userId) {
        this.loading = true;
        Promise.all([
          getUserDetail({userId: userId}),
          getAccount({
            userId: userId
          })
        ]).then(([res1, res2]) => {
          this.userInfo = res1;
          this.accountInfo = res2[0];
          this.loading = false;
        }).catch(() => { this.loading = false; });
      }
    },
    methods: {
      getUserId() {
        return getUserId();
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      getImgSyl(imgs) {
        let img = imgs ? formatImg(imgs) : defaltAvatarImg;
        return {
          backgroundImage: `url(${img})`
        };
      },
      go(url) {
        if(getUserId()) {
          this.$router.push(url);
        } else {
          this.text = '您未登录！';
          this.$refs.toast.show();
        }
      },
      _refreshScroll() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
          let imgs = this.$refs.description.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let _img = imgs[i];
            if (_img.complete) {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
              continue;
            }
            _img.onload = () => {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
            };
          }
        }, 20);
      }
    },
    components: {
      Toast,
      Scroll,
      FullLoading,
      MFooter
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";
  .me-wrapper {
    width: 100%;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .mt20{
      margin-top: 0.2rem;
    }
    .me-top{
      width: 100%;
      height: 2.84rem;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      @include bg-image('me-bg');
      position: relative;

      .info-wrap{
        width: 100%;
        height: 1.24rem;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 0.3rem;
        z-index: 9;
        transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);

        .userPhoto{
          width: 1.24rem;
          height: 1.24rem;
        }
        .info{
          margin-left: 0.3rem;
        }
        .nickname{
          font-size: .4rem;
          color: #FFFFFF;
          line-height: 1;
          margin-top: 0.2rem;
        }
        .mobile{
          font-size: .28rem;
          color: #FFFFFF;
          line-height: 1;
          margin-top: 0.15rem;
        }
      }

      .icon-more {
        height: 0.3rem;
        position: absolute;
        top: 50%;
        right: 0.3rem;
        z-index: 10;
        transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
      }
    }
    .me-list {
      overflow: auto;
      .item {
        width: 100%;
        padding: 0 0.3rem;
        background: $color-highlight-background;

        .wrap{
          width: 100%;
          height: 1.16rem;
          font-size: $font-size-medium-x;
          line-height: 1.1rem;
          position: relative;
          padding-left: 0.6rem;
          &.border-bottom-1px {
            @include border-bottom-1px($color-border);
          }
        }
        &.account-wrap{
          .wrap{
            padding-right: 0.3rem;
          }
        }
        .account{
          i{
            font-size: 0.22rem;
            margin-right: 0.05rem;
          }
        }
        .icon {
          height: 0.34rem;
          position: absolute;
          top: 50%;
          left: 0;
          z-index: 10;
          transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
        }
        span:first-child{
          position: absolute;
          top: 50%;
          left: 0.64rem;
          z-index: 10;
          transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
        }
        .more {
          height: 0.3rem;
          position: absolute;
          top: 50%;
          right: 0;
          z-index: 10;
          transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
        }
      }
    }
  }
</style>
