module.exports.flattenObj = item => {
  return Object.keys(item).reduce((acc, cur) => {
    if (Array.isArray(item[cur])) {
      if (item[cur].length) {
        acc[cur] = item[cur];
        return acc;
      }
    } else if (typeof item[cur] === "object") {
      Object.keys(item[cur]).forEach(curKey => {
        acc[`${cur}.${curKey}`] = item[cur][curKey];
      });
      return acc;
    }
    return acc;
  }, {});
};
