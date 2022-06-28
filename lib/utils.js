exports.filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.parseToArray = (arrayLikeString) => {
  try {
    const parsedData = JSON.parse(arrayLikeString);
    console.log(typeof parsedData);
    if (!Array.isArray(parsedData)) {
      throw Error();
    }

    return parsedData;
  } catch (err) {
    throw Error("Invalid array conversion");
  }
};
