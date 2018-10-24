<template>
    <div class="loginAwait">
      <loading v-if="loading"></loading>
      <p v-else class="tip">跳转....</p>
      <!-- <input type="text" v-model="code"> -->
    </div>
</template>
<script>
import { userLogin } from 'api/miss';
import { isLogin, setUser } from 'common/js/util';
import Loading from 'base/loading/loading';
import Toast from 'base/toast/toast';
import {getAppId} from 'api/general';
import Confirm from 'base/confirm/confirm';

export default {
  data() {
    return {
      code: '',
      loading: true
    };
  },
  mounted() {
    // alert(!isLogin());
    if (!isLogin()) {
      if (this.$route.path === '/') {
        return;
      } else if (/code=([^&]+)&state=/.exec(location.href)) {
        this.code = RegExp.$1;
        this.login();
      } else {
        this.AppId();
      }
    } else {
      this.$router.push('/home');
    }
  },
  methods: {
    //  获取用户微信code
    AppId() {
      //  获取用户appid
      getAppId().then(res => {
        var appId = res.cvalue;
        let redirect = `${location.origin}/${location.hash}`;
        if (this.userReferee && !/userReferee=([^&$]+)/.exec(location.href)) {
          redirect += `?userReferee=${this.userReferee}`;
        }
        //  获取当前地址
        let redirectUri = encodeURIComponent(redirect);
        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
        let suffix =
          '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
        //  发送微信网页授权地址，由此获取code
        setTimeout(() => {
          location.replace(
            `${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`
          );
        }, 100);
      });
    },
    // 登陆 获取用户userId
    login() {
      userLogin(this.code).then(info => {
        setUser(info);
        if(info.isNeedMobile === '1') {
          this.$router.push('/register');
        } else {
          this.$router.push('/home');
        }
      }).catch(() => { alert('网络异常'); });
    }
  },
  components: { 
    Loading,
    Confirm,
    Toast
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/scss/variable.scss";
.loginAwait {
  font-size: $font-size-medium-x;
  padding: 0.3rem;
  input {
    width: 100%;
  }
  .tip {
    text-align: center;
    margin-top: 2rem;
    font-size: $font-size-medium-xx;
  }
  .item{
    width: 100px;
    height: 30px;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
