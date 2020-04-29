import axios from 'axios'
// export const loginService = {
//   loginService: login,
// };
const url = `http://localhost:5000/api/Login`
export const login = async (username, password) => {
  try {
    const res = await axios.post(url, {
      username: 'ds01',
      password: 'string',
    })
    return res
  } catch (e) {
    return e
  }
}
