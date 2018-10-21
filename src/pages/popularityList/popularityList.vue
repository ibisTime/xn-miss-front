<template>
  <div class="popularityList-wrapper">
    <div class="content">
      <Scroll class="scroll" :pullUpLoad="pullUpLoad">
        <div class="header">
          <div class="header-title">
            <span @click="changeCurrent('1')" :class="[currentFlag ? 'current' : '']">总榜</span>
            <span @click="changeCurrent('2')" :class="[!currentFlag ? 'current' : '']">飙升榜</span>
          </div>
          <span v-show="sortList.length > 0" class="crown" :class="[!currentFlag ? 'crown2' : 'crown1']"></span>
          <!-- <a class="no1" href="'javascript:void(0)'" :style="getImgSyl('' || sortList[0].bannerPics)"></a>
          <a class="no2" href="'javascript:void(0)'" :style="getImgSyl('' || sortList[1].bannerPics)"></a>
          <a class="no3" href="'javascript:void(0)'" :style="getImgSyl('' || sortList[2].bannerPics)"></a> -->
          <div v-for="(item, index) in sortList" :key="item.code">
            <a :class="['no'+ (index + 1 - 0)]" href="'javascript:void(0)'" :style="getImgSyl(item.player.bannerPics)"></a>
            <div :class="['sort f' + (index + 1 - 0)]">
              <div class="ranking">NO.{{(index + 1 - 0)}}</div>
              <div class="name">{{item.playerCname}}</div>
              <div class="tickets">{{item.ticketSum}}票</div>
            </div>
          </div>
          <span class="header-bang"></span>
          <!-- <div class="sort first">
            <div class="ranking">NO.1</div>
            <div class="name">{{sortList[0].playerCname || ''}}</div>
            <div class="tickets">{{sortList[0].ticketSum || ''}}票</div>
          </div>
          <div class="sort second">
            <div class="ranking">NO.2</div>
            <div class="name">{{sortList[1].playerCname || ''}}</div>
            <div class="tickets">{{sortList[1].ticketSum || ''}}票</div>
          </div>
          <div class="sort third">
            <div class="ranking">NO.3</div>
            <div class="name">{{sortList[2].playerCname || ''}}</div>
            <div class="tickets">{{sortList[2].ticketSum || ''}}票</div>
          </div> -->
        </div>
        <div class="content1">
          <div class="session" v-for="item in sortList1" :key="item.code">
            <i>{{item.rank}}</i>
            <a class="pic" href="'javascript:void(0)'" :style="getImgSyl(item.player.bannerPics)"></a>
            <div class="session-right">
              <span class="name fl">{{item.playerCname}}</span>
              <span class="tickets fr">{{item.ticketSum}}票</span>
            </div>
          </div>
          <!-- <div class="session">
            <i>4</i>
            <a class="pic" href="'javascript:void(0)'" :style="getImgSyl()"></a>
            <div class="session-right">
              <span class="name fl">林月儿</span>
              <span class="tickets fr">6000票</span>
            </div>
          </div> -->
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
import { querySort } from 'api/miss';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: false,
      current: 1,
      currentFlag: true,
      sortList: [],
      sortList1: [],
      pullUpLoad: null
    };
  },
  mounted() {
    this.pullUpLoad = null;
    this.loading = true;
    setTitle('榜单');
    this.currentFlag = this.$route.query.flag === '1';
    this.current = this.$route.query.flag;
    this.getInitData();
  },
  methods: {
    getInitData() {
      this.loading = true;
      querySort(this.current).then(data => {
        this.loading = false;
        let list = [];
        let list1 = [];
        data.map((item, i) => {
          if (i < 3) {
            list.push(item);
          } else {
            list1.push(item);
          }
        });
        this.sortList = list;
        this.sortList1 = list1;
      }).catch(() => { this.loading = false; });
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    go(url) {
      this.$router.push(url);
    },
    goReplace(url) {
      this.$router.replace(url);
    },
    changeCurrent(flag) {
      if(flag !== this.current) {
        this.currentFlag = flag === '1';
        this.current = flag;
        this.goReplace('/popularityList?flag=' + flag);
        this.getInitData();
      }
    }
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
    width: 100%;
    height: 100%;
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
    .header {
      width: 7.5rem;
      height: 6.16rem;
      position: relative;
      background-color:#363638;
      position: relative;
      .header-title {
        width: 3rem;
        height: 0.6rem;
        line-height: 0.6rem;
        position: absolute;
        top: 0.38rem;
        left: 50%;
        transform: translateX(-1.5rem);
        border: 1px solid #fff;
        font-size: 0.28rem;
        text-align: center;
        span {
          float: left;
          width: 50%;
          color: #fff;
          &.current {
            background-color: #fff;
            color: #363638;
          }
        }
      }
      .header-bang {
        width: 6.9rem;
        height: 3.26rem;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-3.45rem);
        @include bg-image('paihangbang');
        background-size: 6.9rem 3.26rem;
      }
      .crown {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        left: 50%;
        bottom: 4.36rem;
        transform: translateX(-50%);
        background-size: 0.3rem;
        &.crown1{
          @include bg-image('huangguan');
        }
        &.crown2{
          @include bg-image('huo');
        }
      }
      a {
        width: 1.3rem;
        height: 1.3rem;
        position: absolute;
        bottom: 2.46rem;
        background-color: #fff;
        z-index: 9;
        border-radius: 50%;
        border: 2px solid #ffe777;
        &.no1 {
          left: 50%;
          transform: translateX(-50%);
          bottom: 3.1rem;
        }
        &.no2 {
          left: 0.7rem;
          z-index: 9;
        }
        &.no3 {
          right: 0.7rem;
          z-index: 9;
        }
      }
      .sort {
        width: 2.2rem;
        height: 2.3rem;
        position: absolute;
        bottom: 0;
        color: $primary-color;
        font-size: 0.28rem;
        text-align: center;
        z-index: 9;
        .ranking {
          margin-top: 0.6rem;
        }
        .name {
          margin-top: 0.2rem;
        }
        .tickets {
          margin-top: 0.1rem;
        }
        &.f1 {
          width: 2.55rem;
          height: 2.73rem;
          left: 2.5rem;
        }
        &.f2 {
          left: 0.3rem
        }
        &.f3 {
          right: 0.3rem
        }
      }
    }
    .content1 {
      padding: 0 0.3rem;
      background-color: #fff;
      .session {
        padding: 0.3rem;
        border-bottom: 1px solid #F0F0F0;
        i {
          float: left;
          width: 0.5rem;
          line-height: 0.9rem;
          font-size: 0.32rem;
          color: $color-text-sx;
        }
        .pic {
          float: left;
          width: 0.9rem;
          height: 0.9rem;
          border-radius: 0.08rem;
          overflow: hidden;
          background-color: #fff;
        }
        .session-right {
          margin-left: 1.7rem;
          line-height: 0.9rem;
          font-size: 0.32rem;
          overflow: hidden;
          .name {
            color: $color-text-s;
          }
          .tickets{
            color: $color-text-sx;
          }
        }
      }
    }
}
</style>
