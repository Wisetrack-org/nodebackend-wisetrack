export const selectFields = (object, fields) => {
  if (!fields) return object;

  const selectedFields = fields.split(",");
  const result = {};

  selectedFields.forEach((field) => {
    if (object.hasOwnProperty(field)) {
      result[field] = object[field];
    }
  });

  return result;
};
