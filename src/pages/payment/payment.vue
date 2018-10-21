<template>
  <div class="payment-wrapper">
      <div class="surplus">
          当前余额：{{formatAmount(amount)}}元
      </div>
      <div class="recharge">
          <div class="recharge-title">金额</div>
          <div class="recharge-monry">
              <span>￥</span>
              <span>{{formatAmount(totalAmount)}}</span>
          </div>
      </div>
      <div class="center">
        <div class="mode">支付方式</div>
          <div class="chongzhi" @click="changeStatus(1)">
          <img class="zhifu" src="./chongzhi@2x.png">
          余额支付
          <img :class="['xuanzhong', status == 1 ? 'show' : '']" src="./xuanzhong@2x.png" alt="">
          <img :class="['xuanzhong', status == 1 ? '' : 'show']" src="./weixuanzhong@2x.png" alt="">
          </div>
          <div class="chongzhi" @click="changeStatus(5)">
          <img class="zhifu" src="./weixin@2x.png">
          微信支付
          <img :class="['xuanzhong', status == 5 ? 'show' : '']" src="./xuanzhong@2x.png" alt="">
          <img :class="['xuanzhong', status == 5 ? '' : 'show']" src="./weixuanzhong@2x.png" alt="">
        </div>
      </div>
      <div class="footer">
        <div class="f-left">
          <span class="total">金额：</span>
          <span class="price"><i>{{formatAmount(totalAmount)}}</i>元</span>
        </div>
        <div class="f-right" @click="buy">确认购买</div>
      </div>
      <full-loading :title="title" v-show="loading"></full-loading>
      <toast ref="toast" :text="text"></toast>
      <confirm-input ref="confirmInput" :inpType="'password'" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Slider from 'base/slider/slider';
import FullLoading from 'base/full-loading/full-loading';
import { setTitle, formatAmount, formatImg } from 'common/js/util';
import { getUserDetail } from 'api/user';
import { payOrder, queryAccountList, getOrderDetail } from 'api/miss';
import { initPay } from 'common/js/weixin';
import Toast from 'base/toast/toast';
import ConfirmInput from 'base/confirm-input/confirm-input';
export default {
  data() {
    return {
      status: 1,
      title: '正在加载...',
      loading: false,
      totalAmount: 0,
      amount: 0,
      code: '',
      text: '',
      inputText: '',
      ordetDetail: {}
    };
  },
  mounted() {
    setTitle('支付');
    this.code = this.$route.query.code;
    this.loading = true;
    Promise.all([
      getUserDetail(),
      queryAccountList(),
      this.getDetail(this.code)
    ]).then(([res1, res2]) => {
      this.userDetail = res1;
      this.amount = res2[0].amount;
      this.loading = false;
    }).catch(() => { this.loading = false; });
  },
  methods: {
    getDetail(code) {
      getOrderDetail(code).then(data => {
        this.loading = false;
        this.ordetDetail = data;
        this.totalAmount = data.amount;
      });
    },
    getImgSyl(imgs) {
      return {
        backgroundImage: `url(${formatImg(imgs)})`
      };
    },
    formatImg(img) {
      return formatImg(img);
    },
    formatAmount(amount) {
      return formatAmount(amount);
    },
    go(url) {
      this.$router.push(url);
    },
    changeStatus(status) {
      this.status = status;
    },
    buy() {
      // debugger;
      let flag = this.status === 1;
      if(flag && !this.userDetail.tradepwdFlag) {
        this.text = '请先去设置支付密码';
        this.$refs.toast.show();
        setTimeout(() => {
          this.$router.push('/set-money');
        }, 1000);
      }else {
        if(this.status === 1) {
          this.inputText = '支付密码';
          // this.curItem = item;
          this.$refs.confirmInput.show();
        }else {
          this.payOrder();
        }
      }
    },
    payOrder() {
      this.title = '提交中...';
      this.loading = true;
      payOrder(
        this.code,
        this.status,
        this.pwd
      ).then(data => {
        this.loading = false;
        if (this.status === 1) {
          this.success();
        } else if (this.status === 5) {
          // debugger;
          let wxConfig = {
            appId: data.appId, // 公众号名称，由商户传入
            timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: data.nonceStr, // 随机串
            wechatPackage: data.wechatPackage,
            signType: data.signType, // 微信签名方式：
            paySign: data.paySign // 微信签名
          };
          initPay(wxConfig, this.success, this.error, this.cancel);
        }
      }).catch(() => { this.loading = false; });
    },
    cancel() {
      this.loading = false;
    },
    error() {
      this.loading = false;
      this.text = '支付失败！';
      this.$refs.toast.show();
    },
    success() {
      this.loading = false;
      this.text = '支付成功！';
      this.$refs.toast.show();
      setTimeout(() => {
        this.go('/follow');
      }, 1200);
    },
    // 输入支付密码后点击确定执行的方法
    handleInputConfirm(text) {
      this.pwd = text;
      if(!this.pwd) {
        this.text = '请填写支付密码';
        this.$refs.toast.show();
        this.inputText = '支付密码';
        this.$refs.confirmInput.show();
      } else {
        this.payOrder();
      }
    }
  },
  components: {
    Toast,
    Slider,
    FullLoading,
    Scroll,
    ConfirmInput
  }
};
</script>
<style lang="scss" scoped>
@import "../../common/scss/mixin.scss";
@import "../../common/scss/variable.scss";
.payment-wrapper {
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
    .surplus {
        padding: 0.3rem;
        font-size: 0.3rem;
        line-height: 1.1rem;
        background-color: #fff;
        border-bottom: 1px solid #F0F0F0;
    }
    .recharge {
        padding: 0.3rem 0.3rem;
        font-size: 0.3rem;
        line-height: 1.1rem;
        background-color: #fff;
        .recharge-title {
            font-size: 0.26rem;
            line-height: 1.5;
            color: $color-text-sx;
        }
        .recharge-monry {
            margin-top: 0.15rem;
            font-size: 0.48rem;
            color: #323232;
            font-weight: bold;
            span {
              margin-right: 0.1rem;
            }
        }
    }
    .center {
      margin-top: 0.2rem;
      background-color: #fff;
      .mode {
        line-height: 0.6rem;
        padding-left: 0.3rem;
        color: #999;
        font-size: $font-size-small;
      }
      .chongzhi {
        line-height: 1rem;
        padding: 0 0.3rem;
        font-size: $font-size-medium-x;
        border-top: 1px solid #eee;
        .zhifu {
          width: 0.5rem;
          margin-right: 0.2rem;
          vertical-align: sub;
        }
        .xuanzhong {
          width: 0.4rem;
          float: right;
          margin-top: 0.5rem;
          transform: translateY(-50%);
          display: none;
          &.show {
            display: block;
          }
        }
      }
    }
    .footer {
      line-height: 1rem;
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #fff;
      .f-left {
        float: left;
        width: 5.4rem;
        overflow: hidden;
        padding-left: 0.3rem;
        .total {
          float: left;
          font-size: $font-size-medium-s;
          color: #333;
        }
        .price {
          margin-right: 0.2rem;
          float: left;
          font-size: $font-size-medium-x;
          i {
            color: #DAB86E;
          }
        }
      }
      .f-right {
        width: 2.1rem;
        margin-left: 5.4rem;
        text-align: center;
        background-color: #DAB86E;
        color: #fff;
        font-size: $font-size-medium-x;
      }
    }
}
</style>
