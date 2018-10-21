<template>
  <div class="popularityList-wrapper">
    <div class="content">
      <Scroll class="scroll" :pullUpLoad="pullUpLoad">
        <div class="session" v-for="item in matchList" :key="item.code">
          <div class="top">
            <span :class="flag ? 'icon fl' : ''">已读</span>
            <span class="title fl">{{item.title}}</span>
            <span class="time fr">{{item.createDatetime}}</span>
          </div>
          <div class="bottom">{{item.content}}</div>
        </div>
        <div class="session">
          <div class="top">
            <span :class="flag ? 'icon fl' : ''">已读</span>
            <span class="title fl">环球小姐第5届</span>
            <span class="time fr">2018.10.5 5:41</span>
          </div>
          <div class="bottom">环球小姐第5届辅助文字辅助文字第5届辅助文字辅助文字</div>
        </div>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatImg } from 'common/js/util';
import { queryMathList } from 'api/miss';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      flag: true,
      matchList: []
    };
  },
  methods: {
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    }
  },
  mounted() {
    setTitle('赛事信息');
    queryMathList().then(data => {
      this.macthList = data.list;
      this.loading = false;
    }).catch(() => { this.loading = false; });
  },
  components: {
    Slider,
    FullLoading,
    Scroll
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.popularityList-wrapper {
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
    .content{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: auto;
    }
    .session {
      width: 6.9rem;
      height: 1.65rem;
      margin: 0.3rem auto;
      padding: 0.3rem;
      background-color: #fff;
      border-radius: 0.16rem;
      .top {
        overflow: hidden;
        .icon {
          width: 0.56rem;
          height: 0.35rem;
          line-height: 0.36rem;
          background-color: #EBEBEB;
          color: $color-text-l;
          font-size: 0.22rem;
          text-align: center;
          &.flag {
            background-color: #F25C5C;
            color: #fff;
          }
        }
        .title {
          margin-left: 0.16rem;
          color: $color-text-s;
          font-size: 0.32rem;
        }
        .time {
          font-size: 0.24rem;
          color: $color-text-l;
        }
      }
      .bottom {
        margin-top: 0.2rem;
        width: 4.45rem;
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.28rem;
        color: $color-text-l;
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
}
</style>
