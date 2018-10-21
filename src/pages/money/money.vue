<template>
  <div class="me-wrapper full-screen-wrapper">
      <div class="content">
        <div class="in-content">
          <div class="card">
            <div class="fl">
              <p>当前余额</p>
              <p><span>¥</span><span>{{formatAmount(accountInfo.amount)}}</span></p>
            </div>
            <div class="btn fr">
              <button @click="go('/recharge?accountNumber=' + accountNumber)">充值</button>
            </div>
          </div>
          <div class="money-list">
            <scroll ref="scroll"
              :data="accountList"
              :hasMore="hasMore"
              @pullingUp="getUserAccount">
              <div class="money-item" v-for="(item, index) in accountList" :key="index">
                <div class="img-cont">
                  <img :src="getIcon(item)" alt="">
                </div>
                <div class="text">
                  <div class="text-top">
                    <p>{{item.bizNote}}</p>
                    <span class="money">{{parseInt(item.transAmount) > 0 ? '+' : ''}}{{formatAmount(item.transAmount)}}</span>
                  </div>
                  <div class="text-bottom">{{formatDate(item.createDatetime).toLocaleString()}}</div>
                </div>
              </div>
              <no-result v-show="!hasMore && !(accountList && accountList.length)" title="暂无资金流水" class="no-result-wrapper"></no-result>
            </Scroll>
          </div>
        </div>
      </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import { formatAmount, formatDate, setTitle } from 'common/js/util';
  import { getAccountList, getAccountDetail } from 'api/account';
  import NoResult from 'base/no-result/no-result';

  export default {
    data() {
      return {
        content: '',
        time: '',
        amount: 0,
        start: 1,
        limit: 10,
        hasMore: true,
        loadingFlag: true,
        protocol: '<table><tbody><tr><td width="240px" height="240px"><img id="qrimage" src="//qr.api.cli.im/qr?data=http%253A%252F%252F192.168.1.162%253A8033%252F%2523%252Fregister&amp;level=H&amp;transparent=false&amp;bgcolor=%23ffffff&amp;forecolor=%23000000&amp;blockpixel=12&amp;marginblock=1&amp;logourl=&amp;size=260&amp;kid=cliim&amp;key=9ee0765087ace26c717af8d86bd50a6e"></td></tr></tbody></table>',
        accountNumber: '',
        accountInfo: {},
        accountList: []
      };
    },
    mounted() {
      setTitle('余额');
      this.getInitData();
    },
    methods: {
      getInitData() {
        this.accountNumber = this.$route.query.accountNumber;
        Promise.all([
          this.getUserAccount(),
          this.getAccountDetail()
        ]);
      },
      formatDate(time) {
        return formatDate(time);
      },
      formatAmount(amount) {
        return formatAmount(amount);
      },
      go(url) {
        this.$router.push(url);
      },
      getAccountDetail() {
        getAccountDetail(this.accountNumber).then(data => {
          this.accountInfo = data;
        });
      },
      getUserAccount() {
        // 请求流水
        if(this.accountNumber) {
          getAccountList({
            accountNumber: this.accountNumber,
            start: this.start,
            limit: this.limit
          }).then((res) => {
            if (res.totalPage <= this.start) {
              this.hasMore = false;
            }
            this.accountList = [...this.accountList, ...res.list];
            this.start++;
          });
        }
      },
      getIcon(item) {
        return parseInt(item.transAmount) > 0 ? require('./../../common/image/in@2x.png') : require('./../../common/image/out@2x.png');
      }
    },
    components: {
      Scroll,
      NoResult
    },
    watch: {
      $route() {
        this.getUserAccount();
      }
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
    .title {
      font-size: 0.36rem;
      color: #fff;
      padding-top: 0.19rem;
      text-align: center;
    }
    .content {
      padding: 0.3rem 0.15rem;
      margin-bottom: 0.98rem;
      .in-content {
        .card {
          height: 3.5rem;
          margin-bottom: 0.25rem;
          padding: 0.15rem 0.5rem 0.3rem;
          background: url("./top-bg@2x.png") no-repeat;
          background-size: 100% 100%;
          background-position: center;
          text-align: center;
          p {
            text-align: center;
            font-size: $font-size-medium-s;
            margin-bottom: 0.55rem;
            color: #fff;
            span:nth-child(2) {
              font-size: $font-size-large-xxxx;
              font-weight:bold;
              font-size: 0.64rem;
              margin-left: 0.1rem;
            }
          }
          p:first-child {
            font-size: $font-size-medium-s;
            margin-bottom: 0.25rem;
            margin-top: 0.7rem;
            color: rgba(255,255,255,0.86);
          }
          .btn {
            font-size: 0;
            display: inherit;
            margin-top: 1.18rem;
            button {
              width: 1.42rem;
              height: 0.6rem;
              border: 1px solid #fff;
              border-radius: 0.04rem;
              color: #fff;
              font-size: 0.3rem;
              background-color: transparent;
              border-radius: 0.3rem;
            }
            button:first-child {
              color: #fff;
            }
          }
        }
        .money-list {
          background: $color-highlight-background;
          position: absolute;
          top: 4.4rem;
          bottom: 0.5rem;
          width: 90%;
          .money-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.34rem 0;
            border-bottom: 1px solid #eee;
            font-size: $font-size-medium-x;
            .img-cont {
              height: 0.66rem;
              width: 0.66rem;
              flex: 0 0 0.66rem;
              img {
                height: 100%;
                width: 100%;
              }
            }
            .text {
              flex: 1;
              padding-left: 0.3rem;
              .text-top {
                display: flex;
                p {
                  flex: 1;
                }
                .money {
                  font-size: 0.3rem;
                  color: #151515;
                }
              }
              .text-bottom {
                padding-top: 0.15rem;
                font-size: $font-size-small-s;
                color: $color-text-l;
              }
            }
          }
        }
      }
    }
  }
</style>
