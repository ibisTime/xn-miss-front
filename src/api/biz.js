import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

// 分页查询认养产品
export function getProductPage (data) {
  return fetch(629025, {
    start: 1,
    limit: 5,
    ...data
  });
}
// 详情查询认养产品
export function getProductDetail (data) {
  return fetch(629026, {
    ...data
  });
}
// 分页查询认养产品的树
export function getProductTreePage (data) {
  return fetch(629035, {
    start: 1,
    limit: 5,
    ...data
  });
}
// 详情查询认养产品的树
export function getProductTreeDetail (data) {
  return fetch(629036, {
    ...data
  });
}

// 列表查产品分类
export function getProductType (data) {
  return fetch(629007, {
    ...data
  });
}

// 下单认养订单
export function placeOrder (data) {
  return fetch(629040, {
    ...data
  });
}

// 下单认养订单
export function signIn (data) {
  return fetch(805140, {
    ...data
  });
}

// 支付非集体订单
export function payOrder (data) {
  return fetch(629042, {
    ...data
  });
}

// 支付集体订单
export function payOrganizeOrder (data) {
  return fetch(629053, {
    ...data
  });
}

// 第一人下单集体认养订单
export function recognizeOrderFirst (data) {
  return fetch(629050, {
    ...data
  });
}

// 第一人下单集体认养订单
export function recognizeOrder (data) {
  return fetch(629051, {
    ...data
  });
}

// 获取消息
export function getMessage (data) {
  return fetch(805306, {
    ...data
  });
}

// 详情查消息
export function getMessageDetail (data) {
  return fetch(805307, {
    ...data
  });
}

/**
 * 分页查询订单
 * @param {number} start
 * @param {number} limit
 * @param {string} status
 * @param {string} type 订单类型（1个人/2定向/3捐赠/4集体）
 * */
export function getPageOrders(start, limit, status, type) {
  let params = {
    start,
    limit,
    userId: getUserId()
  };
  let bizCode = '';

  if (status.constructor === Array) {
    params.statusList = status;
  } else {
    params.status = status;
  }
  // 集体订单
  if (type === 4) {
    bizCode = '629055';
  } else {
    if (type !== 0) {
      params.type = type;
    }
    bizCode = '629045';
  }
  return fetch(bizCode, params);
}

// 详情查非集体订单
export function getOrderDetail (data) {
  return fetch(629046, {
    ...data
  });
}

// 详情查集体订单
export function getOrganizeOrderDetail (data) {
  return fetch(629056, {
    ...data
  });
}

/**
 * 列表查询认养权/列表查询用户的树
 * @params {string} status 状态(1待认养2认养中3已到期)
 * @params {string} userId 持有人
 * @params {string} categoryCode 分类编号
 * @params {string} productCode 产品编号
 * */
export function getListUserTree(params) {
  let data = {
    currentHolder: getUserId(),
    ...params
  };
  return fetch(629207, data);
}

/**
 * 分页查询认养权/分页查询用户的树
 * @params {string} status 状态(1待认养2认养中3已到期)
 * @params {string} userId 持有人
 * @params {string} categoryCode 分类编号
 * @params {string} productCode 产品编号
 * */
export function getPageUserTree(params) {
  let data = {
    ...params
  };
  return fetch(629205, data);
}

// 详情查询认养权
export function getUserTreeDetail(code) {
  return fetch(629206, {
    code
  });
}

/**
 * 取消订单
 * @param {string} code
 * @param {string} remark
 * */
export function cancelOrder(code, remark) {
  return fetch(629041, {
    code,
    remark,
    userId: getUserId()
  });
}

/**
 * 获取当前订单积分抵扣金额
 * @param {string} code 订单编号
 * */
export function getDeductibleAmount(code) {
  return fetch(629048, {
    code
  });
}

// 列表查支付渠道
export function paymentType() {
  return fetch(802116);
}

// 申请提现
export function payApplyFor(config) {
  return fetch(802350, {
    applyUser: getUserId(),
    applyUserType: 'C',
    ...config
  });
}