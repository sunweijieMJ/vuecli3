
class Moment {

  constructor() {
  }

  format(data) {
    const year = new Date(data).getFullYear();
    const month = new Date(data).getMonth() + 1;
    const date = new Date(data).getDate();
    return `${year}/${month}/${date}`;
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Moment();
  return instance;
};
