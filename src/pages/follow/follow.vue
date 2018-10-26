<template>
  <div class="follow-wrapper">
    <div class="content">
      <Scroll class="scroll" :pullUpLoad="pullUpLoad">
        <div class="content1">
          <div class="session" v-for="item in followList" :key="item.code">
            <a :style="getImgSyl(item.player.listPic)"></a>
            <div class="session-right">
              <div class="title">
                <span class="fl name">{{item.player.cname}}</span>
                <span class="fr cheer" @click="go(item.player.code)">加油</span>
                <span class="fr follow" @click="changeFollow(item.toCode)">取消关注</span>
              </div>
              <div class="bottom">您为她加油{{item.myTicketSum}}次</div>
            </div>
          </div>
        </div>
      </Scroll>
      <div class="no-content" v-if="followList.length == 0">
          <img src="./miss@3x.png" alt="">
          <p>您还没有任何关注，赶快去关注吧！</p>
          <router-link to="/allList">
            <div class="go-care">去关注</div>
          </router-link>
      </div>
    </div>
      <toast ref="toast" :text="text"></toast>
    <full-loading v-show="loading"></full-loading>
    <m-footer></m-footer>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatImg, getUserId } from 'common/js/util';
import { getFollowList, cancelFollow } from 'api/miss';
import MFooter from 'components/m-footer/m-footer';
import Toast from 'base/toast/toast';
export default {
  data() {
    return {
      title: '正在加载...',
      text: '',
      loading: true,
      isFollow: false,
      start: 0,
      limit: 10,
      followList: [],
      pullUpLoad: null
    };
  },
  mounted() {
    setTitle('我的关注');
    this.pullUpLoad = null;
    let userId = this.getUserId();
    if(userId) {
      this.getInitData();
    } else {
      this.text = '您未登录！';
      this.$refs.toast.show();
      setTimeout(() => {
        this.$router.push('/login');
      }, 800);
    }
  },
  methods: {
    getUserId() {
      return getUserId();
    },
    getInitData() {
      getFollowList(2, this.start, this.limit).then(data => {
        this.loading = false;
        this.followList = data.list;
      }).catch(() => { this.loading = false; });
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    changeFollow(code) {
      this.loading = true;
      cancelFollow(code).then(data => {
        this.getInitData();
      }).catch(() => { this.loading = false; });
    },
    go(code) {
      this.$router.push('/cheer?code=' + code);
    }
  },
  components: {
    Slider,
    FullLoading,
    Scroll,
    MFooter,
    Toast
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.follow-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0.98rem;
    width: 100%;
    background-color: #F0F0F0;
    @-webkit-keyframes anim1{
        0% {top: 0.7rem;opacity: 1}
        50% {top: -0.7rem;opacity: 1}
        75% {top: -0.7rem;opacity: 0}
        100%{top:0.7rem;opacity: 0}
    }

    @-webkit-keyframes anim2{
        0% {transform: translateX(-0.25rem);}
        100%{transform: translateX(-100%);}
    }
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .banner-default {
        width: 100%;
        height: 3rem;
    }
    a {
      background-size: cover;
    }
    .content{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
    }
    .content1 {
      width: 6.9rem;
      margin: 0.3rem auto;
      background-color: #fff;
      border-radius: 0.16rem;
      .session {
        padding: 0.3rem;
        border-bottom: 1px solid #F0F0F0;
        a {
          float: left;
          width: 1.2rem;
          height: 1.2rem;
        }
        .session-right {
          margin-left: 1.5rem;
          .title {
            margin-top: 0.08rem;
            overflow: hidden;
            .name {
              font-weight: 600;
              font-size: 0.32rem;
              line-height: 0.42rem;
              color: $color-text-s;
            }
            .follow {
              padding: 0 0.24rem;
              line-height: 0.42rem;
              font-size: 0.26rem;
              border-radius: 0.04rem;
              color: $color-text-l;
              margin-right: 0.3rem;
              border: 1px solid #F0F0F0;
            }
            .cheer {
              padding: 0 0.24rem;
              line-height: 0.42rem;
              font-size: 0.26rem;
              border-radius: 0.04rem;
              color: #fff;
              background-color: $primary-color;
            }
          }
          .bottom {
            margin-top: 0.2rem;
            line-height: 0.4rem;
            font-size: 0.28rem;
          }
        }
      }
    }
    .no-content{
      position: absolute;
      top: 1.8rem;
      width: 100%;
      text-align: center;
      img{
        width: 2.12rem;
        height: 1.58rem;
      }
      p{
        font-size: .24rem;
        margin-top: .35rem;
        color: #999999;
      }
      .go-care{
        width: 2.7rem;
        height: .8rem;
        margin: 1rem auto;
        line-height: .8rem;
        font-size: .32rem;
        text-align: center;
        color: #fff;
        background: #DAB86E;
        border-radius: 8px;
      }
    }
}
</style>
