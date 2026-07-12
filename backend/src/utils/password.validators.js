 // password.validator.js

const PASSWORD_POLICY =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.";

exports.PASSWORD_POLICY = PASSWORD_POLICY;

exports.isStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]{8,}$/;

  return passwordRegex.test(password);
};