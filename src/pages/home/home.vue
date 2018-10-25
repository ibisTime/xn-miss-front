<template>
  <div class="home-wrapper">
    <div class="content">
      <Scroll ref="scroll"
              :data="dataList"
              :hasMore="hasMore"
              @pullingUp="getPagePlayer">
        <div class="slider-wrapper">
          <slider v-if="banners.length" :loop="loop">
            <div class="home-slider" v-for="item in banners" :key="item.code">
              <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
            </div>
          </slider>
        </div>
        <div class="bang">
          <div class="bang-left" @click="toUrl(2)">
            <span class="span-bg"></span>
            <span class="span-msg">人气榜</span>
          </div>
          <div class="bang-right" @click="toUrl(1)">
            <span class="span-bg"></span>
            <span class="span-msg">飙升榜</span>
          </div>
        </div>
        <div class="contentList">
          <div class="session" v-for="item in dataList" :key="item.matchPlayCode" @click="go(item.code)">
            <div><a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.listPic)"></a></div>
            <div class="clear"></div>
            <div class="session-right">
              <div class="right-title">
                <span class="fl">{{item.cname}}</span>
                <span class="fr">{{item.matchPlayCode}}</span>
              </div>
              <div class="clear"></div>
              <div class="info">身高:{{item.height}}CM  籍贯:{{item.nativePlace}}</div>
              <div class="info">{{sellTypeObj[item.match]}}</div>
              <div class="bottom">
                <div class="b-left fl">
                  <span class="zan"></span>
                  <span class="num">{{item.attentionSum || 0}}</span>
                </div>
                <div class="b-middle fl">
                  <span class="zan copy"></span>
                  <span class="num">{{item.commentSum || 0}}</span>
                </div>
                <div class="b-right fl">
                  <span class="zan love"></span>
                  <span class="num">{{item.ticketSum || 0}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <no-result v-show="!hasMore && !(dataList && dataList.length)" title="暂无选手" class="no-result-wrapper"></no-result>
      </Scroll>
    </div>
    <div class="kefu">
      <img @click="goService" src="./kefu@2x.png" />
      <span v-show="msgNum > 0">{{msgNum}}</span>
    </div>
    <input @input="searchPlayer" v-model="content" type="text" class="search" placeholder="名字/赛区/籍贯">
    <span @click="emptyContent" class="empty"><img src="./delete.png"></span>
    <m-footer></m-footer>
    <full-loading v-show="loading" :title="title"></full-loading>
    <toast :text="toastText" ref="toast"></toast>
    <Confirm ref="confirm" :isTxt="msgTxt" :text="titleMsg" :confirmBtnText="qrBtn" @confirm="toLookMsg"/>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import NoResult from 'base/no-result/no-result';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { getBanner, getDictList } from 'api/general';
import { getPagePlayerList } from 'api/miss';
import { setTitle, formatImg } from 'common/js/util';
import MFooter from 'components/m-footer/m-footer';
import { queryMathPage, getMessageDetail } from 'api/miss';
import Confirm from 'base/confirm/confirm';
export default {
  data() {
    return {
      title: '正在加载...',
      titleMsg: '',
      qrBtn: '查看',
      toastText: '',
      loading: true,
      banners: [],
      loop: false,
      dataList: [],
      start: 0,
      limit: 20,
      hasMore: true,
      sellTypeObj: {},
      content: '',
      msgTxt: '赛事信息',
      msgNum: ''
    };
  },
  mounted() {
    setTitle('首页');
    this.pullUpLoad = null;
    this.loading = true;
    this.getInitData();
    queryMathPage(1, 1).then(data => {
      if(data.list.length > 0){
        this.titleMsg = data.list[0].eventInfo.title;
        this.$refs.confirm.show();
      }
    });
    getMessageDetail().then(data => {
      this.msgNum = data.list[0].unreadSum;
    })

  },
  methods: {
    getInitData() {
      Promise.all([
        getBanner(),
        getDictList('match'),
        this.getPagePlayer()
      ]).then(([res1, res3]) => {
        this.banners = res1;
        if(this.banners.length > 1) {
          this.loop = true;
        }
        res3.map((item) => {
          this.sellTypeObj[item.dkey] = item.dvalue;
        });
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    getPagePlayer() {
      this.loading = true;
      Promise.all([
        getPagePlayerList({
          start: this.start,
          limit: this.limit,
          fuzzyQuery: this.content,
          orderColumn: 'order_no',
          orderDir: 'asc'
        })
      ]).then(([res1]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.loading = false;
        this.dataList = res1.list;
        // this.start++;
      }).catch(() => {
        this.loading = false;
      });
    },
    goService() {
      this.$router.push('/service');
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    formatImg(img) {
      return formatImg(img);
    },
    go(code) {
      this.$router.push('/detail?code=' + code);
    },
    toUrl(flag) {
      this.$router.push('/popularityList?flag=' + flag);
    },
    searchPlayer() {
      this.getPagePlayer();
    },
    emptyContent() {
      this.content = '';
      this.searchPlayer();
    },
    toLookMsg(){
      this.$router.push('/matchInfos');
    }
  },
  components: {
    Slider,
    NoResult,
    FullLoading,
    Toast,
    Scroll,
    MFooter,
    Confirm
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.home-wrapper {
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
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0.98rem;
    width: 100%;
    overflow: auto;
    background-color: #F0F0F0;
  }
  .slider-wrapper {
    position: relative;
    top: 0;
    left: 0;
    background: $color-highlight-background;
    height: 4.5rem;
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
  .bang{
    width: 6.9rem;
    height: 1.1rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: -0.55rem;
    background-color: #fff;
    overflow: hidden;
    position: relative;
    border-radius: 0.16rem;
    margin-bottom: 0.22rem;
    z-index: 999;
    transform: translateZ(0px);
    div {
      float: left;
      width: 50%;
      text-align: center;
      line-height: 1.1rem;
      position: relative;
      span {
        display: inline-block;
        &.span-bg {
          position: absolute;
          left: 0.95rem;
          top: 50%;
          transform: translateY(-0.25rem);
        }
        &.span-msg {
          width: 1rem;
          margin-right: -0.5rem;
          color: $color-text-s;
        }
      }
    }
    .bang-left{
      font-size: 0.32rem;
      color: $color-text-s;
      .span-bg {
        width: 0.5rem;
        height: 0.5rem;
        @include bg-image('renqibang');
        background-size: 0.5rem;
        background-repeat: no-repeat;
      }
    }
    .bang-right{
      font-size: 0.32rem;
      color: $color-text-s;
      .span-bg {
        width: 0.5rem;
        height: 0.5rem;
        @include bg-image('biaoshengbang');
        background-size: 0.5rem;
        background-repeat: no-repeat;
      }
    }
  }
  .contentList{
    width: 6.9rem;
    margin: 0 auto;
    .session{
      padding: 0.3rem;
      background: #fff;
      border-bottom: 1px solid #F0F0F0;
      display: flex;

      &:first-child{
        border-radius: 0.16rem 0.16rem 0 0;
      }
      &:last-child{
        border-radius: 0 0 0.16rem 0.16rem;
      }
      a {
        float: left;
        width: 2.3rem;
        height: 2.3rem;
      }
      .session-right{
        margin-left: 0.3rem;
        .right-title{
          padding-top: .25rem;
          font-size: 0.32rem;
          color: $color-text-s;
          span{
            font-weight: bold;
          }
        }
        .info{
          margin-top: 0.3rem;
          font-size: 0.28rem;
          color: #666;
        }
        .bottom{
          width: 100%;
          font-size: 0.22rem;
          margin-top: 0.4rem;
          color: $color-text-x;
          div {
            position: relative;
          }
          .span{
            float: left;
          }
          .zan {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-0.16rem);
            width: 0.28rem;
            height: 0.28rem;
            display: inline-block;
            @include bg-image('xin');
            background-size: 0.28rem;
            background-repeat: no-repeat;
            &.copy{
              @include bg-image('copy');
              background-size: 0.28rem;
            }
            &.love{
              // transform: translateY(-0.14rem);
              @include bg-image('zan');
              background-size: 0.28rem;
            }
          }
          .num{
            margin-left: 0.4rem;
            width: 0.28rem;
            height: 0.28rem;
            display: inline-block;
          }
          .b-right{
            margin-left: .8rem;
            text-align: left;
          }
          .b-middle{
            margin-left: .8rem;
          }
        }
      }
    }
  }
  .kefu {
    position: fixed;
    bottom: 1.1rem;
    right: 0.5rem;
    width: 1.2rem;
    height: 1.2rem;
    img{
      width: 100%;
      height: 100%;
    }
    span{
      position: absolute;
      right: 0.1rem;
      top: 0rem;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 100%;
      background-color: #a71515;
      color: #fff;
      font-size: 0.2rem;
      text-align: center;
      line-height: 0.3rem;
    }
  }
  .search {
    width: 6.9rem;
    position: fixed;
    top: 0.3rem;
    left: 50%;
    transform: translateX(-3.45rem);
    height: 0.72rem;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 0.06rem rgba(88,88,88,0.3);
    /* transition: trans; */
    font-size: 0.28rem;
    padding-left: 0.2rem;
    border-radius: 0.16rem;
  }
  .empty {
    height: 0.34rem;
    width: 0.34rem;
    position: fixed;
    top: 0.45rem;
    right: 0.5rem;
    z-index: 9;
    line-height: 0;
    font-size: 0;
    img{
      height: 100%;
      vertical-align: bottom;
    }
  }
  .clear{
    clear: both;
  }
}
</style>
