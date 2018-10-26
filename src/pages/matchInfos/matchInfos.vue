<template>
  <div class="popularityList-wrapper">
    <div class="content">
      <Scroll class="scroll"
              :data="matchList"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <div class="session" v-for="item in matchList" :key="item.code" v-show="matchList.length" @click="go('match-detail?code=' + item.toCode + '&id=' + item.id + '&status=' + item.status)">
          <div class="top">
            <span :class="item.status == 0 ? 'icon flag' : 'icon fl'">{{statusTxt[item.status]}}</span>
            <span class="title">{{cut(item.eventInfo.title,6)}}</span>
            <span class="time fr">{{formatDate(item.createDatetime)}}</span>
          </div>
          <!--<div v-html="item.content" class="content-info"></div>-->
          <!--<div class="bottom">{{item.content}}</div>-->
        </div>
        <no-result v-show="!hasMore && !(matchList && matchList.length)" title="暂无赛事" class="no-result-wrapper"></no-result>
      </Scroll>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import NoResult from 'base/no-result/no-result';
import { setTitle, formatImg, formatDate } from 'common/js/util';
import { queryMathPage10 } from 'api/miss';
import { getDictList } from 'api/general';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      flag: true,
      matchList: [],
      start: 1,
      limit: 10,
      hasMore: true,
      statusTxt: {}
    };
  },
  methods: {
    formatDate(date) {
      return formatDate(date);
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    go(url) {
      this.$router.push(url);
    },
    getPageOrders() {
      Promise.all([
        queryMathPage10(this.start, this.limit)
      ]).then(([res1]) => {
        if (res1.list.length < this.limit || res1.totalCount <= this.limit) {
          this.hasMore = false;
        }
        this.loading = false;
        this.matchList = this.matchList.concat(res1.list);
        this.start++;
      }).catch(() => { this.loading = false; });
    },
    cut(str, num) {
      if(str) {
        if(str.length > num) {
          return str.slice(0, num) + '...';
        } else {
          return str;
        }
      }
    },
    getStatus() {
      getDictList('read_status').then((res) => {
        res.map((item) => {
          this.statusTxt[item.dkey] = item.dvalue;
        });
      });
    }
  },
  mounted() {
    setTitle('赛事信息');
    this.getPageOrders();
    this.getStatus();
    // queryMathPage(this.start, this.limit).then(data => {
    //   this.macthList = data.list;
    //   this.loading = false;
    // }).catch(() => { this.loading = false; });
  },
  components: {
    Slider,
    FullLoading,
    Scroll,
    NoResult
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
    bottom: 0;
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
      // height: 1.65rem;
      margin: 0.3rem auto;
      padding: 0.3rem;
      background-color: #fff;
      border-radius: 0.16rem;
      .top {
          overflow: hidden;
          display: flex;
          align-items: center;
          span{
            font-size: 0.2rem;
          }
        .icon {
          /*width: 0.56rem;*/
          /*height: 0.35rem;*/
            padding: 0.05rem;
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
            flex: 1;
        }
        .time {
          font-size: 0.24rem;
          color: $color-text-l;
        }
      }
      .content-info{
        text-indent:1em;
        padding: 0.15rem 0;
        font-size: 0.3rem;
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
