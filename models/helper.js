const isPresent = (arr = [], num) => {
  let ans = false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == num) {
      ans = true;
    }
  }
  return ans;
};

const get_random = (n) => {
  return Math.floor(Math.random() * n);
};

module.exports = {
  get_random,
  isPresent,
};
