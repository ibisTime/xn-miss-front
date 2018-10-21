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
                  <div class="title">
                      <span class="name fl">{{info.cname}}</span>
                      <span class="code fr">{{info.matchPlayCode}}</span>
                  </div>
                  <div class="center">身高：{{info.height}}CM  籍贯：{{info.nativePlace}}</div>
                  <div class="bottom">
                      <span class="match fl">{{sellTypeObj[info.match]}}</span>
                      <div class="bottom-right fr">
                          <div class="b-left fr">
                              <span class="zan"></span>
                              <span class="num">{{info.ticketSum || 0}}</span>
                          </div>
                          <div class="b-right fr">
                              <span class="zan love"></span>
                              <span class="num">{{info.attentionSum || 0}}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="richText">{{info.description}}</div>
            <div class="comment" v-if="discuss.length > 0">
              <span class="pinlun">评论</span>
              <div class="session" v-for="item in discuss" :key="item.code">
                <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.photo)"></a>
                <div class="session-right">
                  <div class="title">
                    <span class="name fl">{{item.nickname}}</span>
                    <span class="time fr">{{formatDate(item.createDatetime)}}</span>
                  </div>
                  <div class="abstract">{{item.content}}</div>
                </div>
              </div>
            </div>
            <div class="comment" v-else>
              <span class="pinlun">评论</span>
              <div class="noneDiscuss"> 暂无评论</div>
            </div>
      </Scroll>
      <div @click="changeShow" :class="[show ? 'show' : '', 'mask']"></div>
      <div :class="[show ? 'show' : '', 'comments']">
          <textarea v-model="content" name="" id="" cols="30" rows="10" placeholder="发表评论"></textarea>
          <span @click="makeComment" class="publish">发表</span>
      </div>
      <div class="footer">
        <div>
          <span class="xin pic"></span>
          <span>关注</span>
        </div>
        <div @click="changeShow">
          <span class="pinglun pic"></span>
          <span>评论</span>
        </div>
        <div @click="zan">
          <span class="zan pic"></span>
          <span>加油</span>
        </div>
      </div>
    </div>
    <full-loading v-show="loading"></full-loading>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatImg, formatDate } from 'common/js/util';
import { getPlayerDetail, getPlayerDiscuss, makeComment } from 'api/miss';
import { getDictList } from 'api/general';
export default {
  data() {
    return {
      title: '正在加载...',
      loading: true,
      loop: false,
      pullUpLoad: null,
      info: '',
      discuss: [],
      bannerList: [],
      start: 0,
      limit: 10,
      code: '',
      sellTypeObj: {},
      show: false,
      content: '',
      price: 0
    };
  },
  mounted() {
    setTitle('详情');
    this.code = this.$route.query.code;
    this.getInitData();
  },
  methods: {
    getInitData() {
      Promise.all([
        getPlayerDetail(this.code),
        getPlayerDiscuss(this.code, this.start, this.limit),
        getDictList('match')
      ]).then(([res1, rest2, res3]) => {
        this.info = res1;
        this.bannerList = res1.pics.split('||');
        this.discuss = rest2.list;
        res3.map((item) => {
          this.sellTypeObj[item.dkey] = item.dvalue;
        });
        this.loading = false;
      }).catch(() => { this.loading = false; });
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    formatDate(date, format) {
      return formatDate(date, format);
    },
    formatImg(img) {
      return formatImg(img);
    },
    zan() {
      this.$router.push('/cheer?code=' + this.code);
    },
    changeShow() {
      this.show = !this.show;
    },
    makeComment() {
      this.loading = true;
      makeComment(this.code, this.content).then(data => {
        this.changeShow();
        this.loading = false;
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
        .title {
            font-size: 0.32rem;
            color: $color-text-s;
            overflow: hidden;
        }
        .center {
            margin-top: 0.2rem;
            font-size: 0.28rem;
        }
        .bottom {
            margin-top: 0.2rem;
            overflow: hidden;
            .match {
                font-size: 0.28rem;
            }
            .bottom-right {
                div {
                    position: relative;
                }
                .zan {
                    position: absolute;
                    top: 50%;
                    left: -0.2rem;
                    transform: translateY(-50%);
                    width: 0.28rem;
                    height: 0.28rem;
                    display: inline-block;
                    @include bg-image('zan1');
                    background-size: 0.28rem;
                    background-repeat: no-repeat;
                    &.love{
                        @include bg-image('xin1');
                        background-size: 0.28rem;
                        background-repeat: no-repeat;
                    }
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
                .num{
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
            border-left: 0.06rem solid #E7D291;
        }
        .session {
            padding: 0.3rem 0;
            border-bottom: 1px solid #F0F0F0;
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
        background-color: #fff;
        overflow: hidden;
        border-top: 1px solid #F0F0F0;
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
                @include bg-image('xin');
            }
            .pinglun {
                width: 0.34rem;
                height: 0.34rem;
                @include bg-image('pinglun');
            }
            .zan {
                width: 0.34rem;
                height: 0.34rem;
                @include bg-image('zan');
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
        z-index: 99;
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
}
</style>
