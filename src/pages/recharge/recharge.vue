<template>
  <div class="me-wrapper full-screen-wrapper">
    <div class="bg">
      <div class="content">
        <div class="have">当前余额：{{formatAmount(userAmount[0].amount)}}元</div>
        <div class="recharge">
          <p>充值金额</p>
          <p class="number">¥<input type="number" v-model="amount"></p>
        </div>
        <div class="gray"></div>
        <div class="pay-type">
          <p>支付方式</p>
          <div class="pay-type-list">
            <div @click="selectPayType(5)">
              <img src="./wechat@2x.png" alt="">
              <div class="text">
                <p>微信</p>
              </div>
              <img class="money fr" src="./choosed@2x.png" v-show="wechat">
              <img class="money fr" src="./unchoosed@2x.png" v-show="!wechat">
            </div>
            <!--<div @click="selectPayType(3)">-->
              <!--<img src="./alipay@2x.png" alt="">-->
              <!--<div class="text">-->
                <!--<p>支付宝</p>-->
              <!--</div>-->
              <!--<img class="money fr" src="./choosed@2x.png" v-show="alipay">-->
              <!--<img class="money fr" src="./unchoosed@2x.png" v-show="!alipay">-->
            <!--</div>-->
          </div>
        </div>
      </div>
      <div class="footer">
        <span>金额：<span>{{amount}}</span><span>元</span></span>
        <button class="fr" @click="toRecharge">充值</button>
      </div>
    </div>
    <router-view></router-view>
    <full-loading :title="title" v-show="loading"></full-loading>
    <toast :text="text" ref="toast"></toast>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {setTitle, formatAmount} from 'common/js/util';
  import {getAccount, recharge} from 'api/account';
  import { initPay } from 'common/js/weixin';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';

  export default {
    data() {
      return {
        wechat: true,
        alipay: false,
        balance: false,
        amount: 100,
        text: '',
        title: '正在加载...',
        loading: false,
        userAmount: [{
          amount: 0
        }],
        config: {
          amount: '',
          payType: '5'
        },
        accountNumber: ''
      };
    },
    created() {
      setTitle('充值');
    },
    mounted() {
      this.accountNumber = this.$route.query.accountNumber;
      getAccount().then(data => {
        this.userAmount = data.filter(item => {
          return item.currency === 'CNY';
        });
      });
    },
    methods: {
      formatAmount(amount) {
        return formatAmount(amount);
      },
      getTel() {
        if (this.telephone) {
          return `tel://${this.telephone}`;
        } else {
          return '';
        }
      },
      go(url) {
        this.$router.push(url);
      },
      selectPayType(index) {
        if(index === 5) {
          this.wechat = true;
          this.alipay = false;
          this.balance = false;
        } else if(index === 3) {
          this.wechat = false;
          this.alipay = true;
          this.balance = false;
        }
        this.config.payType = index.toString();
        // else if(index === 3) {
        //   this.wechat = false;
        //   this.alipay = false;
        //   this.balance = true;
        // }
      },
      toRecharge() {
        this.config.amount = this.amount * 1000;
        // location.href = 'http://www.baidu.com';
        this.loading = true;
        recharge(this.config).then(data => {
          this.loading = false;
          if (this.config.payType === '5') {
            let wxConfig = {
              appId: data.appId, // 公众号名称，由商户传入
              timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
              nonceStr: data.nonceStr, // 随机串
              wechatPackage: data.wechatPackage,
              signType: data.signType, // 微信签名方式：
              paySign: data.paySign // 微信签名
            };
            initPay(wxConfig, this.success, this.error, this.cancel);
          } else if (this.config.payType === '3') {
            this.text = '正在跳转支付宝...';
            this.$refs.toast.show();
            setTimeout(() => {
              location.href = data.signOrder;
            }, 1000);
          }
        }).catch(() => { this.loading = false; });
        // this.$router.push('/paySucceed');
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
          this.go('/money?accountNumber=' + this.accountNumber);
        }, 1200);
      }
    },

    components: {
      Scroll,
      FullLoading,
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  .me-wrapper {
    background: #fff;
    .fl {
      float: left;
    }
    .fr {
      float: right;
    }
    .bg {
      .title {
        font-size: 0.36rem;
        color: #fff;
        padding-top: 0.19rem;
        text-align: center;
      }
      .content {
        margin-bottom: 0.98rem;
        background: #f5f5f5;
        div {
          padding: 0 0.3rem;
          background: #ffffff;
        }
        .have {
          width: 100%;
          height: 1.1rem;
          line-height: 1.1rem;
          font-size: $font-size-medium-x;
          color: #333;
          border-bottom: 1px solid $color-border;
        }
        .recharge {
          padding-top: 0.34rem;
          padding-bottom: 0.33rem;
          p {
            font-size: $font-size-medium-s;
            color: #666;
            font-size: 0.26rem;
            &:first-child{
              margin-bottom: 0.25rem;
            }
          }
          p.number {
            font-weight: bold;
            color: #141414;
            input {
              font-size: 0.64rem;
            }
          }
        }
        .gray {
          width: 100%;
          height: 0.2rem;
          padding: 0;
          background: transparent;
        }
        .pay-type {
          padding-top: 0.5rem;
          p {
            font-size: 0.3rem;
            margin-bottom: 0.2rem;
          }
          div {
            padding: 0;
          }
          .pay-type-list {
            background: $color-highlight-background;
            div {
              width: 100%;
              height: 1.5rem;
              font-size: $font-size-medium-x;
              line-height: 1.5rem;
              border-bottom: 1px solid #eee;
              img {
                height: 0.36rem;
                vertical-align: middle;
                margin-right: 0.12rem;
              }
              .text {
                display: inline;
                border: none;
                p {
                  display: inline-block;
                  font-size: $font-size-small-s;
                  color: $color-text-l;
                  line-height: 0.30rem;
                }
                p:first-child {
                  font-size: 0.26rem;
                  color: #333;
                  line-height: 0.37rem;
                  margin-bottom: 0.15rem;
                }
              }
              .money {
                font-size: 0.3rem;
                color: #151515;
                margin-top: 0.5rem;
              }
            }
          }
        }
      }
      .footer {
        height: 0.98rem;
        padding: 0.07rem 0.3rem;
        border-top: 1px solid #eee;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: $font-size-medium-x;
        line-height: 0.7rem;
        background: #fff;
        span {
          span:first-child {
            color: $primary-color;
            font-size: $font-size-medium-x;
          }
          span {
            font-size: $font-size-small;
            color: #151515;
          }
        }
        button {
          width: 2.96rem;
          height: 0.84rem;
          border-radius: 0.08rem;
          background: $primary-color;
          color: $color-highlight-background;
          font-size: $font-size-medium-xx;
        }
      }
    }
  }
</style>
