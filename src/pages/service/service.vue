<template>
  <div class="service-page-wrapper">
    <div class="follow-wrapper">
      <Scroll ref="scroll" class="scroll" :data="list" :pullUpLoad="pullUpLoad">
        <div v-for="item in list" :key="item.id">
          <div v-if="isSelf(item.userId)">
            <div class="item-time"><span>{{formatDate(item.createDatetime)}}</span></div>
            <div class="item-wrap item-right">
              <div class="item-cont">{{item.content}}</div>
              <img :src="avatar"/>
            </div>
          </div>
          <div v-else>
            <div class="item-time"><span>{{formatDate(item.createDatetime)}}</span></div>
            <div class="item-wrap item-left">
              <img src="./kefu@2x.png"/>
              <div class="item-cont">{{item.content}}</div>
            </div>
          </div>
        </div>
        <div class="talk-bottom" ref="talkBtm"></div>
      </Scroll>
    </div>
    <div class="service-input">
      <input class="input-cont" placeholder="说点啥呗" type="text" v-model="msg">
      <button @click="sendMsg">发送</button>
    </div>
    <full-loading v-show="loading"></full-loading>
    <toast ref="toast" text="消息不能为空"></toast>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import Toast from 'base/toast/toast';
import { setTitle, getUserId, formatDate, isUnDefined, formatImg } from 'common/js/util';
import fetch from 'common/js/fetch';
import { getUser } from 'api/user';

export default {
  data() {
    return {
      start: 1,
      loading: true,
      msg: '',
      code: '',
      list: [],
      avatar: ''
    };
  },
  created() {
    setTitle('客服');
    this.pullUpLoad = null;
    Promise.all([
      this.getPageMsg(),
      getUser()
    ]).then(([data, userInfo]) => {
      if (data.list.length) {
        this.code = data.list[0].code;
        this.list = data.list[0].dataList;
      }
      this.avatar = formatImg(userInfo.photo);
      this.scrollToBottom();
      this.loading = false;
    }).catch(() => {
      this.loading = false;
    });
  },
  methods: {
    // 查询消息
    getPageMsg() {
      return fetch(640105, { start: 1, limit: 1 });
    },
    // 发送消息
    sendMsg() {
      if (isUnDefined(this.msg) || this.msg.replace(/^\s*|\s*$/ig, '') === '') {
        this.$refs.toast.show();
        return;
      }
      if (!this.code) {
        this.createTalk().then(() => {
          this._sendMsg();
        }).catch(() => {});
      } else {
        this._sendMsg();
      }
    },
    // 发送消息
    _sendMsg() {
      let msg = this.msg;
      this.msg = '';
      this.list.push({
        id: new Date().valueOf(),
        userId: getUserId(),
        content: msg,
        createDatetime: new Date()
      });
      this.scrollToBottom();
      fetch(640102, {
        code: this.code,
        user1: getUserId(),
        content: msg
      }).then(() => {}).catch(() => {});
    },
    // 创建会话
    createTalk() {
      return fetch(640100, { user1: getUserId(), type: 'cq' }).then((data) => {
        this.code = data.code;
      });
    },
    // 滚动到底部
    scrollToBottom(time = 300) {
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.talkBtm, 300);
      }, 100);
    },
    // 格式化日期
    formatDate(date) {
      return formatDate(date, 'yyyy.MM.dd hh:mm');
    },
    // 是否是自己发的消息
    isSelf(userId) {
      return userId === getUserId();
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
.service-page-wrapper {
  .follow-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0.98rem;
    width: 100%;
    background-color: #F0F0F0;
    .scroll {
      padding-top: 0.4rem;
    }
    .item-time {
      padding-bottom: 0.6rem;
      padding-top: 0.6rem;
      text-align: center;
      font-size: 0;
      span {
        display: inline-block;
        padding: 0.11rem 0.53rem;
        border-radius: 4px;
        font-size: $font-size-small;
        background: #E6E6E6;
        color: #999999;
      }
    }
    .item-wrap {
      display: flex;
      align-items: flex-end;
      img {
        width: 1rem;
        height: 1rem;
        flex: 0 0 1rem;
      }
      .item-cont {
        padding: 0.2rem 0.31rem;
        word-break: break-all;
        font-size: $font-size-medium;
        line-height: 0.4rem;
      }
      &.item-left {
        padding: 0 0.3rem 0 0.2rem;
        justify-content: flex-start;
        img {
          margin-bottom: -0.1rem;
        }
        .item-cont {
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          border-radius: 0.2rem 0.2rem 0.2rem 0;
          color: #666666;
        }
      }
      &.item-right {
        padding: 0 0.3rem;
        justify-content: flex-end;
        img {
          border-radius: 0.5rem;
        }
        .item-cont {
          background: #363638;
          border: 1px solid #E6E6E6;
          border-radius: 0.2rem 0.2rem 0 0.2rem;
          color: #F4E6A9;
        }
      }
    }
    .talk-bottom {
      padding-top: 0.6rem;
    }
  }
  .service-input {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.98rem;
    display: flex;
    align-items: center;
    padding: 0.13rem 0.3rem;
    background: #FFFFFF;
    box-shadow: 0 -1px 0 0 #E6E6E6;
    .input-cont {
      flex: 1;
      padding-right: 0.3rem;
      line-height: $font-size-medium;
      height: 100%;
      font-size: $font-size-medium;
    }
    button {
      padding: 0.16rem 0.57rem;
      font-size: $font-size-medium;
      color: #fff;
      background: #DAB86E;
      border-radius: 0.04rem;
    }
  }
}
</style>
