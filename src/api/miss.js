import fetch from 'common/js/fetch';
import { getUserId } from 'common/js/util';

/**
 * 获取用户详情
 */
// export function getUser(userId) {
//     return fetch(805121, {
//         userId: userId || getUserId()
//     });
// }

/**
 * 获取用户详情
 */
export function userLogin(code) {
  return fetch(805170, {
    code,
    type: 'wx_h5'
  });
}
/**
 * 绑定手机号
 */
export function register(mobile, smsCaptcha) {
  return fetch(805060, {
    isSendSms: 1,
    mobile,
    smsCaptcha,
    userId: getUserId()
  });
}
/**
 * 分页获取选手
 */
export function getPagePlayerList(params) {
  return fetch(640015, {
    start: 1,
    limit: 10,
    status: 4,
    ...params
  });
}
/**
 * 选手详情查
 */
export function getPlayerDetail(code) {
  return fetch(640016, {
    userId: getUserId(),
    code
  });
}
/**
 * 分页查询选手评论
 */
export function getPlayerDiscuss(toCode, start = 0, limit = 5) {
  return fetch(628275, {
    statusList: ['B', 'D'],
    toCode,
    start: start,
    limit: limit
  });
}
/**
 * 支付出货订单
 */
export function payOutOrder(info) {
  return fetch(627642, {
    codeList: info.codeList,
    payType: info.payType
  });
}
/**
 * 分页查询用户行为
 */
export function getFollowList(type, start = 1, limit = 10) {
  return fetch(640045, {
    type: type,
    creater: getUserId(),
    start: start,
    limit: limit
  });
}
/**
 * 加关注
 */
export function addFollow(type, toType, toCode) {
  return fetch(640040, {
    type: type,
    toType: toType,
    toCode: toCode,
    creater: getUserId()
  });
}
/**
 * 取消关注
 */
export function cancelFollow(toCode) {
  return fetch(640041, {
    toCode: toCode,
    creater: getUserId()
  });
}

/**
 * 榜单查询
 */
export function querySort(type) {
  return fetch(640027, {
    type: type
  });
}
/**
 * 赛事列表查
 */
export function queryMathList(code) {
  return fetch(805307, {
    code: code,
    status: 4
  });
}
/**
 * 赛事分页查
 * 我的消息
 */
export function queryMathPage10(start, limit, sta) {
  let status = sta ? sta : '';
  return fetch(805315, {
    userId: getUserId(),
    start,
    limit,
    statusList: ['1', '0']
  });
}

export function queryMathPage0(start, limit, sta) {
  let status = sta ? sta : '';
  return fetch(805315, {
    userId: getUserId(),
    start,
    limit,
    statusList: ['0']
  });
}

// 阅读我的消息
export function readMessage(id) {
  return fetch(805310, {
    id
  });
}

/**
 * 下单加油订单
 */
export function makeOrder(playerCode, ticket) {
  return fetch(640030, {
    playerCode: playerCode,
    ticket: ticket,
    applyUser: getUserId()
  });
}
/**
 * 支付加油订单
 */
export function payOrder(code, payType, tradePwd) {
  return fetch(640032, {
    code: code,
    payType: payType,
    tradePwd: tradePwd
  });
}
/**
 * 根据用户编号查询账户列表
 */
export function queryAccountList() {
  return fetch(803503, {
    currency: 'CNY',
    userId: getUserId()
  });
}
/**
 * 评论选手
 */
export function makeComment(code, content) {
  return fetch(640005, {
    userId: getUserId(),
    code: code,
    content: content
  });
}
/**
 * 选手模糊查
 */
export function fuzzyQuery(fuzzyQuery) {
  return fetch(640017, {
    fuzzyQuery: fuzzyQuery
  });
}
/**
 * 详情查询加油订单
 */
export function getOrderDetail(code) {
  return fetch(640036, {
    code
  });
}

/**
 * 详情查询会话
 */
export function getMessageDetail() {
  return fetch(640107, {
    user1: getUserId()
  });
}