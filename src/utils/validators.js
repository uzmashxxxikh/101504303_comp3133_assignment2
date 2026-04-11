function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

function isValidUsername(username) {
  return username && username.length >= 3 && username.length <= 50;
}

function isValidSalary(salary) {
  return salary && salary >= 1000;
}

function isValidGender(gender) {
  const validGenders = ['Male', 'Female', 'Other'];
  return !gender || validGenders.includes(gender);
}

function isValidDate(date) {
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate);
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidSalary,
  isValidGender,
  isValidDate
};
