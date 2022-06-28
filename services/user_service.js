const { filterObj } = require("../lib/utils");

const createEditUserObject = (userDetails, updated_at) => {
  const filteredDetails = filterObj(
    userDetails,
    "first_name",
    "last_name",
    "address",
    "post_code",
    "contact_phone_number",
    "role",
    "is_active"
  );

  filteredDetails.updated_at = updated_at;

  return filteredDetails;
};

module.exports = {
  createEditUserObject,
};
