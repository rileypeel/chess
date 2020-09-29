//const BASE_URL = 'http://0.0.0.0:8000/'
const BASE_URL = 'http://http://ec2-3-129-46-53.us-east-2.compute.amazonaws.com:8000/'
const FETCH_USER = `${BASE_URL}user/me/`
const LOGIN_URL = `${BASE_URL}user/login/`
const LOGOUT_URL = `${BASE_URL}user/logout/`
const REGISTER_URL = `${BASE_URL}user/create/`
const SEARCH_URL = `${BASE_URL}user/search/`
const INVITE_URL = `${BASE_URL}user/create-invite/`
const GAME_HISTORY_URL = `${BASE_URL}user/completed-games/`
const GUEST_URL = `${BASE_URL}user/create-guest/`

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const httpPost = (url, body) => httpRequest(url, { method: 'POST', credentials: 'include', headers: header(), body: JSON.stringify(body) })

const header = () => (new Headers({
  'Content-Type': 'application/json',
  "X-CSRFToken": getCookie("csrftoken")
}))

const httpRequest = (url, requestObj) => fetch(url, requestObj)

const httpGet = (url) => httpRequest(url, { method: 'GET', credentials: 'include' , headers: header() })

export default {
  async fetchUser() {
    const response = await httpGet(FETCH_USER)
    if (response.status === 200) {
      return await response.json()
    }
  },

  async getGuest() {
    const response = await httpGet(GUEST_URL)
    if (response.status === 200) {
      return await response.json()
    }
  },

  async loginUser(userCredentials) {
    const response = await httpPost(LOGIN_URL, userCredentials)
    if (response.status === 200) {
      return await response.json()
    }
  },

  async logoutUser() {
    return await httpGet(LOGOUT_URL)
  },

  async registerUser(user) {
    const response = await httpPost(REGISTER_URL, user)
    return response.status
  },

  async searchUser(queryStr) {
    const response = await httpGet(`${SEARCH_URL}${queryStr}`)
    if (response.status === 200) {
      return await response.json()
    }
  },

  async sendInvite(inviteObj) {
    const response = await httpPost(INVITE_URL, inviteObj)
    return response.status
  },

  async fetchGameHistory(user_id) {
    const response = await httpGet(`${GAME_HISTORY_URL}${user_id}`)
    if (response.status === 200) {
      return await response.json()
    }
  }
}