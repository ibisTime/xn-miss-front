<template>
  <div class="follow-wrapper">
    <div class="content">
      <Scroll class="scroll" :pullUpLoad="pullUpLoad">
        <div class="content1">
          <div class="session" v-for="item in followList" :key="item.code">
            <a :style="getImgSyl(item.player.bannerPics)"></a>
            <div class="session-right">
              <div class="title">
                <span class="fl name">{{item.player.cname}}</span>
                <span class="fr cheer" @click="go(item.code)">加油</span>
                <span class="fr follow" @click="changeFollow(item.toCode)">{{isFollow ? '关注': '取消关注'}}</span>
              </div>
              <div class="bottom">您为她加油{{item.player.ticketSum}}次</div>
            </div>
          </div>
        </div>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
    <m-footer></m-footer>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatImg } from 'common/js/util';
import { getFollowList, addBehavior, cancelFollow } from 'api/miss';
import MFooter from 'components/m-footer/m-footer';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      isFollow: false,
      start: 0,
      limit: 10,
      followList: [],
      pullUpLoad: null
    };
  },
  methods: {
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    changeFollow(code) {
      this.isFollow = !this.isFollow;
      // debugger;
      if(!this.isFollow) {
        addBehavior(2, 1, code);
      } else {
        // debugger;
        cancelFollow(code);
      }
    },
    go(code) {
      this.$router.push('/cheer?code=' + code);
    }
  },
  mounted() {
    setTitle('我的关注');
    this.pullUpLoad = null;
    getFollowList(2, this.start, this.limit).then(data => {
      this.loading = false;
      this.followList = data.list;
    }).catch(() => { this.loading = false; });
  },
  components: {
    Slider,
    FullLoading,
    Scroll,
    MFooter
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
      background-size: 100% 100%;
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
              font-size: 0.32rem;
              color: $color-text-s;
            }
            .follow {
              padding: 0.04rem 0.08rem;
              // line-height: 0.42rem;
              font-size: 0.24rem;
              color: $color-text-l;
              margin-right: 0.3rem;
              border: 1px solid #F0F0F0;
            }
            .cheer {
              padding: 0.04rem 0.24rem;
              // line-height: 0.42rem;
              font-size: 0.24rem;
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
}
</style>
