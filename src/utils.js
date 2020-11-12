const trimFloat = (number, digits) => {
  return Number(number.toFixed(digits));
};

module.exports = { trimFloat };
