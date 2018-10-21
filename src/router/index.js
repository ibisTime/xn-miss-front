import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 首页
const Home = () => import('@/pages/home/home');
// 注册页
const Register = () => import('@/pages/register/register');
// 登录页
const Login = () => import('@/pages/login/login');
// 详情页
const Detail = () => import('@/pages/detail/detail');
// 详情加油页
const Cheer = () => import('@/pages/cheer/cheer');
// 详情支付页
const Payment = () => import('@/pages/payment/payment');
// 我的关注页
const Follow = () => import('@/pages/follow/follow');
// 榜单页
const PopularityList = () => import('@/pages/popularityList/popularityList');
// 赛事信息列表页
const MatchInfos = () => import('@/pages/matchInfos/matchInfos');
// 设置支付密码
const setMoneyPaw = () => import('@/pages/moneyPaw/moneyPaw');
// 客服
const Service = () => import('@/pages/service/service');
// 我的
const Me = () => import('@/pages/me/me');
// 修改手机号
const ChangeMobile = () => import('@/pages/change-mobile/change-mobile');
// 设置
const Settings = () => import('@/pages/settings/settings');
// 余额
const Money = () => import('@/pages/money/money');
// 充值
const Recharge = () => import('@/pages/recharge/recharge');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/detail',
      component: Detail
    },
    {
      path: '/cheer',
      component: Cheer
    },
    {
      path: '/pay',
      component: Payment
    },
    {
      path: '/follow',
      component: Follow
    },
    {
      path: '/popularityList',
      component: PopularityList
    },
    {
      path: '/matchInfos',
      component: MatchInfos
    },
    {
      path: '/set-money',
      component: setMoneyPaw
    },
    {
      path: '/service',
      component: Service
    },
    {
      path: '/me',
      component: Me
    },
    {
      path: '/change-mobile',
      component: ChangeMobile
    },
    {
      path: '/settings',
      component: Settings
    },
    {
      path: '/money',
      component: Money
    },
    {
      path: '/recharge',
      component: Recharge
    }
  ]
});
