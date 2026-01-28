// @/models/utils/createFirestoreModel.js

export const createFirestoreModel = ({
  createModel,
  ErrorClass,
  invalidDataCode,
}) => {
  return (id, data) => {
    try {
      return createModel(id, data);
    } catch (error) {
      if (error instanceof ErrorClass) {
        throw error;
      }

      throw new ErrorClass({
        code: invalidDataCode,
        cause: error,
      });
    }
  };
};
