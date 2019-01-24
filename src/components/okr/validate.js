// 完成度验证
const validatePercent = (rule, value, callback) => {
  const reg = /^[0-9]*$/;
  if (value === '') {
    callback(new Error(' '));
  } else if (reg.test(value)) {
    if (value < 1) {
      callback(new Error('最小单位为1%'));
    } else if (value > 100) {
      callback(new Error('最大单位为100%'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入正整数'));
  }
};

// 投入时长验证
const validateDuration = (rule, value, callback) => {
  const reg = /^[0-9]+.?[0-9]*$/;
  if (value === '') {
    callback(new Error(' '));
  } else if (reg.test(value)) {
    if (value < 0.1) {
      callback(new Error('最小单位为0.1天'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入数字'));
  }
};

export {
  validatePercent, validateDuration
};
