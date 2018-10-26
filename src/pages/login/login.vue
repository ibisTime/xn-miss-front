<template>
    <div class="loginAwait">
      <loading v-if="loading"></loading>
      <p v-else class="tip">跳转....</p>
        <!--<button>重新登录</button>-->
        <div class="login-btn" v-if="relogin" @click="logout">
            <button @click="logout">登录</button>
        </div>
      <!-- <input type="text" v-model="code"> -->
    </div>
</template>
<script>
import { userLogin } from 'api/miss';
import { isLogin, setUser, getUserId, clearUser } from 'common/js/util';
import Loading from 'base/loading/loading';
import Toast from 'base/toast/toast';
import {getAppId} from 'api/general';
import { getUserDetail } from 'api/user';
import Confirm from 'base/confirm/confirm';

export default {
  data() {
    return {
      code: '',
      loading: true,
      relogin: false
    };
  },
  mounted() {
    if (!isLogin()) {
      // alert(1);
      if (this.$route.path === '/') {
        return;
      } else if (/code=([^&]+)&state=/.exec(location.href)) {
        this.code = RegExp.$1;
        this.login();
      } else {
        this.AppId();
      }
    } else {
      // alert(2);
      // alert('userId' + getUserId());
      if(getUserId()) {
        getUserDetail({userId: getUserId()}).then((res) => {
          // alert('res' + JSON.stringify(res));
          if(res.mobile) {
            if(res.status === '0') {
              this.$router.push('/home');
            } else {
              alert('您的账号已被锁定，请联系管理员');
            }
          } else {
            this.$router.push('/register');
          }
        }).catch(() => {
          this.loading = false;
          this.relogin = true;
        });
      } else {
        this.$router.push('/register');
      }
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
        // alert('info' + JSON.stringify(info));
        if(info.isNeedMobile === '1') {
          this.$router.push('/register');
        } else {
          this.$router.push('/home');
        }
      }).catch((msg) => {
        alert(msg);
        this.loading = false;
        this.relogin = true;
      });
    },
    logout() {
      clearUser();
      location.reload();
      this.$router.push('/login');
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
    .login-btn {
        margin-bottom: 0.4rem;
        padding: 0 0.2rem;
        button {
            width: 100%;
            height: 0.9rem;
            background: $primary-color;
            color: $color-highlight-background;
            border-radius: 0.08rem;
            font-size: 0.32rem;
        }
    }
}
</style>
