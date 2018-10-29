<template>
    <div class="home-wrapper">
        <div class="content">
            <Scroll class="scroll" :pullUpLoad="pullUpLoad">
                <div class="slider-wrapper">
                    <slider :loop="loop">
                        <div class="home-slider" v-for="(item, index) in bannerList" :key="index">
                            <!--<img :src="formatImg(item)">-->
                            <a :style="getImgSyl(item)"></a>
                        </div>
                    </slider>
                </div>
                <div class="content1">
                    <div class="baseinfo">
                        <div class="title">
                            <span class="name fl">{{info.cname}}</span>
                            <span class="code fr">{{info.matchPlayCode}}</span>
                        </div>
                        <div class="clear"></div>
                        <div class="center">身高：{{info.height}}CM 籍贯：{{info.nativePlace}}</div>
                        <div class="bottom">
                            <!--<span class="match">{{sellTypeObj[info.match]}}</span>-->
                            <span class="match">{{info.match}}</span>
                            <div class="bottom-right">
                                <span class="b-left">
                                    <span class="zan"></span>
                                    <span class="num">{{info.attentionSum || 0}}</span>
                                </span>
                                <span class="b-middle">
                                    <span class="zan copy"></span>
                                    <span class="num">{{info.commentSum || 0}}</span>
                                </span>
                                <span class="b-right">
                                    <span class="zan love"></span>
                                    <span class="num">{{info.ticketSum || 0}}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="richText">
                    <p>{{info.description}}</p>
                    <div class="intructImg">
                        <!--<a :style="getImgSyl(item)" v-for="item in info.pics"></a>-->
                         <img :src="formatImg(item)" v-for="item in info.pics">
                    </div>
                </div>
                <div class="comment" v-if="info.commentList.length > 0">
                    <span class="pinlun">评论</span>
                    <div class="session" v-for="item in info.commentList" :key="item.code">
                        <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.photo)"></a>
                        <div class="session-right">
                            <div class="title">
                                <span class="name fl">{{item.nickname}}</span>
                                <span class="time fr">{{formatDate(item.createDatetime)}}</span>
                            </div>
                            <div class="abstract">
                              <p>{{item.content}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="comment" v-else>
                    <span class="pinlun">评论</span>
                    <div class="noneDiscuss"> 暂无评论</div>
                </div>
            </Scroll>
        </div>
        <div @click="changeShow" :class="[show ? 'show' : '', 'mask']"></div>
        <div :class="[show ? 'show' : '', 'comments']">
            <textarea v-model="content" name="" id="" cols="30" rows="10" placeholder="发表评论"></textarea>
            <span @click="makeComment" class="publish">发表</span>
        </div>
        <div class="footer">
            <div @click="follow">
                <span class="xin pic" :class="isFollow ? 'xin1' : ''"></span>
                <span :class="{'current':isFollow}">{{isFollow ? '已关注' : '关注'}}</span>
            </div>
            <div @click="changeShow">
                <span class="pinglun pic"></span>
                <span>评论</span>
            </div>
            <div @click="zan">
                <span class="zan pic"></span>
                <span>投票</span>
            </div>
        </div>
        <full-loading v-show="loading"></full-loading>
        <Toast :text="textMsg" ref="toast"/>
    </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Toast from 'base/toast/toast';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatImg, formatDate } from 'common/js/util';
import {initShare} from 'common/js/weixin';
import {
  getPlayerDetail,
  getPlayerDiscuss,
  makeComment,
  cancelFollow,
  addFollow
} from 'api/miss';
import { getDictList } from 'api/general';
export default {
  data() {
    return {
      textMsg: '',
      title: '正在加载...',
      loading: true,
      loop: false,
      pullUpLoad: null,
      info: {
        commentList: []
      },
      discuss: [],
      bannerList: [],
      start: 0,
      limit: 10,
      code: '',
      sellTypeObj: {},
      show: false,
      content: '',
      price: 0,
      isFollow: false
    };
  },
  mounted() {
    setTitle('详情');
    this.code = this.$route.query.code;
    this.getInitData();
  },
  methods: {
    formatImg(img) {
      return formatImg(img);
    },
    getInitData() {
      if(!this.isWxConfiging && !this.wxData) {
        this.getInitWXSDKConfig();
      }
      Promise.all([
        getPlayerDetail(this.code),
        getDictList('match')
      ])
        .then(([res1, res2]) => {
          this.info = res1;
          this.info.pics = res1.pics.split('||');
          this.isFollow = res1.isAttention === '1';
          this.bannerList = res1.bannerPics.split('||');
          res2.map(item => {
            this.sellTypeObj[item.dkey] = item.dvalue;
          });
          this.getDiscuss()
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getInitWXSDKConfig() {
      this.isWxConfiging = true;
      initShare({
        title: '环球小姐',
        // desc: '二手买卖',
        // link: location.href,
        link: location.href.split('#')[0],
        success: (msg) => {
          // alert(JSON.stringify(msg));
          addFollow(1, 1, this.code).then((res) => {
            // if(res.code) {
            //   this.textMsg = '分享数+1';
            //   this.$refs.toast.show();
            // }
          }).catch(() => {});
          // document.addEventListener('WeixinJSBridgeReady', () => { WeixinJSBridge.call('closeWindow'); }, false);
          // // 这个可以关闭ios系统的手机
          // WeixinJSBridge.call('closeWindow');
            // 用户确认分享后执行的回调函数
        },
        cancel: (msg) => {
          // document.addEventListener('WeixinJSBridgeReady', () => { WeixinJSBridge.call('closeWindow'); }, false);
          // // 这个可以关闭ios系统的手机
          // WeixinJSBridge.call('closeWindow');
            // 用户取消分享后执行的回调函数
        }
        // imgUrl: getShareImg()
      }, (data) => {
        this.isWxConfiging = false;
        this.wxData = data;
      }, () => {
        this.isWxConfiging = false;
        this.wxData = null;
      }, false, (res) => {
        setTitle('罗子林');
      });
    },
    getDiscuss() {
      getPlayerDiscuss(this.code, this.start, this.limit)
        .then(data => {
          this.loading = false;
          this.discuss = data.list;
          this.info.commentList = data.list;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    zan() {
      this.$router.push('/cheer?code=' + this.code);
    },
    // 取消关注 / 关注
    follow() {
      this.loading = true;
      if (this.isFollow) {
        cancelFollow(this.code)
          .then(data => {
            if(data.isSuccess) {
              this.isFollow = false;
              this.loading = false;
              this.info.attentionSum--;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        addFollow(2, 1, this.code)
          .then(data => {
            if(data.code) {
              this.isFollow = true;
              this.loading = false;
              this.info.attentionSum++;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    changeShow() {
      this.show = !this.show;
    },
    makeComment() {
      if(this.content == ''){
        this.textMsg = '内容不能为空哦';
        this.$refs.toast.show();
        return;
      }
      this.loading = true;
      makeComment(this.code, this.content)
        .then(data => {
          this.loading = false;
          this.textMsg = '已发送';
          this.$refs.toast.show();
          setTimeout(() => {
            this.loading = true;
            this.content = '';
            this.changeShow();
            this.start = 1;
            this.getDiscuss();
          }, 1500);
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  components: {
    Slider,
    FullLoading,
    Scroll,
    Toast
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
  background-color: #f0f0f0;

  @-webkit-keyframes anim1 {
    0% {
      top: 0.7rem;
      opacity: 1;
    }
    50% {
      top: -0.7rem;
      opacity: 1;
    }
    75% {
      top: -0.7rem;
      opacity: 0;
    }
    100% {
      top: 0.7rem;
      opacity: 0;
    }
  }

  @-webkit-keyframes anim2 {
    0% {
      transform: translateX(-0.25rem);
    }
    100% {
      transform: translateX(-100%);
    }
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
  .content {
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
        /*width: 100%;*/
      height: 100%;
      display: block;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }
  .baseinfo {
    padding: 0.3rem;
    background-color: #fff;
    color: $color-text-sx;
    .title {
      font-size: 0.32rem;
      color: $color-text-s;
      span{
        font-weight: 600;
      }
    }
    .center {
      margin-top: 0.2rem;
      font-size: 0.28rem;
    }
    .bottom {
        margin-top: 0.2rem;
        font-size: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      .match {
        font-size: 0.28rem;
      }
      .bottom-right {
          display: flex;
          align-items: center;
        div {
          position: relative;
        }
        .zan {
          /*<!--position: absolute;-->*/
          /*<!--top: 50%;-->*/
          /*<!--left: -0.2rem;-->*/
          /*<!--transform: translateY(-50%);-->*/
          width: 0.28rem;
          height: 0.28rem;
          display: inline-block;
          @include bg-image("xin1");
          background-size: 0.28rem;
          background-repeat: no-repeat;
          &.copy {
            @include bg-image("copy");
            background-size: 0.28rem;
          }
          &.love {
            @include bg-image("zan1");
            background-size: 0.28rem;
            background-repeat: no-repeat;
          }
        }
        .b-left {
            display: flex;
            align-items: center;
            margin-right: 0.4rem;
        }
        .b-middle {
            display: flex;
            align-items: center;
          margin-right: 0.4rem;
        }
        .b-right {
            display: flex;
            align-items: center;
          margin-right: 0.4rem;
        }
        .num {
          height: 0.28rem;
          font-size: 0.22rem;
          line-height: 0.28rem;
          display: inline-block;
          margin-left: 0.2rem;
        }
      }
    }
  }
  .richText {
    margin-top: 0.2rem;
    padding: 0.3rem;
    font-size: 0.28rem;
    background-color: #fff;
    p {
      line-height: 0.4rem;
    }
    .intructImg {
        width: 100%;
        margin-top: .2rem;
        /*height: 3.5rem;*/
        /*a {*/
            /*!*width: 100%;*!*/
            /*height: 100%;*/
            /*display: block;*/
            /*background-repeat: no-repeat;*/
            /*background-position: center;*/
            /*background-size: contain;*/

        /*}*/
        img {
            max-width: 100%;
        }
    }
  }
  .comment {
    margin-top: 0.2rem;
    padding: 0.3rem;
    padding-bottom: 0;
    background-color: #fff;
    .pinlun {
      font-size: 0.32rem;
      color: $color-text-s;
      display: block;
      padding-left: 0.1rem;
      border-left: 0.06rem solid #e7d291;
    }
    .session {
      padding: 0.3rem 0;
      border-bottom: 1px solid #f0f0f0;
      a {
        float: left;
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 50%;
      }
      .session-right {
        color: $color-text-l;
        margin-left: 0.86rem;
        .title {
          overflow: hidden;
          .name {
            font-size: 0.28rem;
          }
          .time {
            font-size: 0.24rem;
          }
        }
        .abstract {
          margin-top: 0.35rem;
          font-size: 0.32rem;
          color: $color-text-s;
          p{
            line-height: .4rem;
          }
        }
      }
    }
    .noneDiscuss {
      line-height: 2rem;
      font-size: 0.4rem;
      text-align: center;
      color: $color-text-s;
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: #fff;
    overflow: hidden;
    border-top: 1px solid #f0f0f0;
    div {
      float: left;
      width: 33.3%;
      text-align: center;
      position: relative;
      line-height: 1rem;
      span {
        display: block;
        font-size: 0.22rem;
        background-size: 0.34rem;
        background-repeat: no-repeat;
      }
      .xin {
        width: 0.34rem;
        height: 0.34rem;
        @include bg-image("xin");
        &.xin1 {
          @include bg-image("focus");
        }
      }
      .current {
        color: #e7d291;
        /*margin-left: 0.15rem;*/
          margin-left: 0.3rem;
      }
      .pinglun {
        width: 0.34rem;
        height: 0.34rem;
        @include bg-image("pinglun");
      }
      .zan {
        width: 0.34rem;
        height: 0.34rem;
        @include bg-image("zan");
      }
      .pic {
        position: absolute;
        top: 50%;
        left: 25%;
        transform: translateY(-50%);
      }
    }
  }
  .comments {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0.3rem 0.3rem 0.2rem 0.3rem;
    z-index: 100;
    font-size: 0.28rem;
    background-color: #fff;
    display: none;
    &.show {
      display: block;
    }

    textarea {
      width: 6.9rem;
      height: 1.9rem;
      border-radius: 0.08rem;
      padding: 0.2rem;
      border: 1px solid #ccc;
    }
    .publish {
      display: block;
      margin-top: 0.2rem;
      width: 1.5rem;
      height: 0.64rem;
      line-height: 0.64rem;
      background-color: $primary-color;
      border-radius: 0.08rem;
      text-align: center;
      color: #fff;
      margin-left: 5.4rem;
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(00, 00, 00, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    &.show {
      display: block;
    }
  }
  .clear{
    clear: both;
  }
}
</style>
