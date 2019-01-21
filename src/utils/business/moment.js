
class Moment {

  constructor() {
  }

  format(data, type) {
    const year = new Date(data).getFullYear();
    const month = new Date(data).getMonth() + 1;
    const date = new Date(data).getDate();
    switch (type) {
      case 'YYYY/MM/DD':
        return `${year}/${month}/${date}`;
        break;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${date}`;
        break;
      default:
        return `${year}/${month}/${date}`;
        break;
    }
  }

}

// 单列模式返回对象
let instance;
export default () => {
  if (instance) return instance;
  instance = new Moment();
  return instance;
};
