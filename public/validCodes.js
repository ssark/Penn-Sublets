var validCodes = {
  userExists: {num: 1, msg: 'Account already exists'},
  accountNotExist: {num: 2, msg: 'Account does not exist'},
  wrongCreds: {num: 3, msg: 'Invalid credentials'},
  serverError: {num: 4, msg: "Server Error: Please try again"}
}

module.exports = validCodes;