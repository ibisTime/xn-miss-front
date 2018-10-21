<template>
  <div class="home-wrapper">
    <div class="content">
      <Scroll class="scroll" :pullUpLoad="pullUpLoad">
        <div class="slider-wrapper">
          <slider :loop="loop">
            <div class="home-slider" v-for="item in bannerList">
              <a :style="getImgSyl(item)"></a>
            </div>
          </slider>
        </div>
        <div class="content1">
            <div class="baseinfo">
              <a :style="getImgSyl(info.bannerPics)"></a>
              <div class="baseinfo-right">
                <div class="title">
                    <span class="name fl">{{info.cname}}</span>
                    <span class="code fr">{{info.matchPlayCode}}</span>
                </div>
                <div class="center">身高：{{info.height}}CM  籍贯：{{info.nativePlace}}</div>
                <div class="bottom">
                    <span class="match fl">{{sellTypeObj[info.match]}}</span>
                </div>
              </div>
            </div>
        </div>
        <div class="richText">{{info.description}}</div>
        <div class="cheer-num">
          <div class="cheer-left fl">加油次数</div>
          <div class="cheer-right fr">
            <span class="add" @click="add"></span>
            <i class="num">{{num}}</i>
            <span class="reduce" @click="reduce"></span>
          </div>
        </div>
        <div class="cheer-info">您已经为他加油<i>{{info.ticketSum}}</i>次，谢谢您的支持</div>
      </Scroll>
    </div>
    <div class="footer">
      <div class="footer-left fl">
        合计金额：<i>{{totalAmount}}</i>元
      </div>
      <div class="footer-right fr" @click="zhifu">支付</div>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatImg } from 'common/js/util';
import { getPlayerDetail, makeOrder } from 'api/miss';
import { getDictList, getSystemConfigCkey } from 'api/general';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      loop: false,
      pullUpLoad: null,
      info: '',
      bannerList: [],
      num: 0,
      code: '',
      sellTypeObj: {},
      price: 0,
      totalAmount: 0
    };
  },
  mounted() {
    setTitle('详情');
    this.code = this.$route.query.code;
    Promise.all([
      getPlayerDetail(this.code),
      getDictList('match'),
      getSystemConfigCkey('price')
    ]).then(([res1, res2, res3]) => {
      this.info = res1;
      this.bannerList = res1.pics.split('||');
      this.price = res3.cvalue;
      res2.map((item) => {
        this.sellTypeObj[item.dkey] = item.dvalue;
      });
      this.loading = false;
    }).catch(() => { this.loading = false; });
  },
  methods: {
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    reduce() {
      // debugger;
      // this.num = this.num === 0 ? 0 : this.num--;
      this.num--;
      if(this.num <= 1) {
        this.num = 1;
      }
      this.totalAmount = (this.price * this.num).toFixed(2);
    },
    add() {
      this.num++;
      this.totalAmount = (this.price * this.num).toFixed(2);
    },
    zhifu() {
      this.loading = true;
      // this.$router.push('/payment?code=' + this.code + '&num=' + this.num);
      makeOrder(this.code, this.num).then(data => {
        // debugger;
        this.loading = false;
        this.$router.push('/payment?code=' + data.code);
      }).catch(() => { this.loading = false; });
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
.home-wrapper {
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
    .slider-wrapper {
        position: relative;
        top: 0;
        left: 0;
        background: $color-highlight-background;
        height: 5.5rem;
        width: 100%;
        overflow: hidden;
        .home-slider {
        height: 100%;
        }
        a {
        width: 100%;
        height: 100%;
        display: block;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        }
    }
    .baseinfo {
        padding: 0.3rem;
        background-color: #fff;
        color: $color-text-sx;
        overflow: hidden;
        a {
          float: left;
          width: 1.6rem;
          height: 1.6rem;
        }
        .baseinfo-right {
          margin-left: 1.9rem;
        }
        .title {
            margin-top: 0.1rem;
            font-size: 0.32rem;
            color: $color-text-s;
            overflow: hidden;
        }
        .center {
            margin-top: 0.2rem;
            font-size: 0.28rem;
            line-height: 0.4rem;
        }
        .bottom {
            margin-top: 0.2rem;
            overflow: hidden;
            line-height: 0.4rem;
            .match {
                font-size: 0.28rem;
            }
            .bottom-right {
                div {
                    position: relative;
                }
                .b-left {
                    margin-right: 0.4rem;
                    span {
                        float: left;
                    }
                }
                .b-right{
                    margin-right: 0.4rem;
                    span {
                        float: left;
                    }
                }
            }
        }
    }
    .richText {
      margin-top: 0.2rem;
      padding: 0.3rem;
      height: 1rem;
      background-color: #fff;
      font-size: 0.28rem;
    }
    .cheer-num {
      margin-top: 0.2rem;
      padding: 0.3rem;
      overflow: hidden;
      border-bottom: 1px solid #F0F0F0;
        background-color: #fff;
      .cheer-left {
        font-size: 0.32rem;
          line-height: 0.36rem;
        color: #4B4B4B;
      }
      .cheer-right {
        font-size: 0.24rem;
        color: $color-text-s;
        position: relative;
        height: 0.36rem;
        line-height: 0.36rem;
        text-align: center;
        span, i {
          float: right;
          // display: inline-block;
          width: 0.36rem;
          height: 0.36rem;
          line-height: 0.36rem;
          background-size: 0.36rem;
          background-repeat: no-repeat;
        }
        .reduce {
          @include bg-image('reduce');
        }
        .add {
          @include bg-image('add');
        }
      }
    }
    .cheer-info {
      color: $color-text-l;
      font-size: 0.2rem;
      line-height: 0.88rem;
      padding: 0.3rem;
      border-bottom: 1px solid #F0F0F0;
        background-color: #fff;
      i {
        color: $primary-color;
      }
    }
    .footer {
      width: 100%;
      padding: 0.3rem;
      line-height: 0.84rem;
      overflow: hidden;
      background-color: #fff;
      position: fixed;
      left: 0;
      bottom: 0;
      .footer-left {
        font-size: 0.3rem;
        color: $color-text-s;
        i {
          color: #DAB86E;
        }
      }
      .footer-right {
        width: 2.96rem;
        height: 0.84rem;
        font-size: 0.32rem;
        border-radius: 0.08rem;
        background-color: #DAB86E;
        text-align: center;
        color: #fff;
      }
    }
}
</style>
