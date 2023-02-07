export function isPhone(phone) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(phone)
}

export function validPwd(pwd) {
	return /^[0-9A-Za-z_]{6,12}$/.test(pwd)
}

export function validIDNumber(val) {
  return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(val)
}
