import axios from 'axios'
import { apiUrl, pagination } from '../constants'

const rax = require('retry-axios')
/*eslint-disable */
const interceptorId = rax.attach()

export default {
  // drink-type
  fetchDrinkTypeAll() {
    return axios.get(apiUrl.drinkType)
  },
  fetchDrinkType(page, limit = pagination.pageSize) {
    return axios.get(`${apiUrl.drinkType}?page=${page}&limit=${limit}`)
  },
  createDrinkType(data) {
    return axios.post(apiUrl.drinkType, data)
  },
  updateDrinkType(data) {
    return axios.put(`${apiUrl.drinkType}/${data.id}`, data)
  },
  fetchDrinkTypeItem(id) {
    return axios.get(`${apiUrl.drinkType}/${id}`)
  },
  deleteDrinkType(id) {
    return axios.delete(`${apiUrl.drinkType}/${id}`)
  },
  // drink-temperature
  fetchDrinkTemperatureAll() {
    return axios.get(apiUrl.drinkTemperature)
  },

  // fetch data on pagination
  fetchDrinkTemperature(page, limit = pagination.pageSize) {
    return axios.get(`${apiUrl.drinkTemperature}?page=${page}&limit=${limit}`)
  },
  createDrinkTemperature(data) {
    return axios.post(apiUrl.drinkTemperature, data)
  },
  updateDrinkTemperature(data) {
    return axios.put(`${apiUrl.drinkTemperature}/${data.id}`, data)
  },
  fetchDrinkTemperatureItem(id) {
    return axios.get(`${apiUrl.drinkTemperature}/${id}`)
  },
  deleteDrinkTemperature(id) {
    return axios.delete(`${apiUrl.drinkTemperature}/${id}`)
  },

  // Auto Dose
  fetchAutoDose(page, limit = pagination.pageSize) {
    return axios.get(`${apiUrl.autoDose}?page=${page}&limit=${limit}`)
  },
  fetchAutoDoseAll() {
    return axios.get(apiUrl.autoDose)
  },
  createAutoDose(data) {
    return axios.post(apiUrl.autoDose, data)
  },
  updateAutoDose(data) {
    return axios.put(`${apiUrl.autoDose}/${data.id}`, data)
  },
  fetchAutoDoseItem(id) {
    return axios.get(`${apiUrl.autoDose}/${id}`)
  },
  deleteAutoDose(id) {
    return axios.delete(`${apiUrl.autoDose}/${id}`)
  },
  uploadFile(image) {
    const formData = new FormData()
    formData.append('image', image, image.name)
    return axios.post(`${apiUrl.uploadWch}`, formData)
  },

  // Localization
  fetchLocalization(page = 1, limit = pagination.pageSize, textSearch = '', lang = 'en') {
    return axios.get(`${apiUrl.localization}/record/?page=${page}&limit=${limit}&text=${textSearch}&lang=${lang}`)
  },
  updateLocalization(id, data) {
    return axios.put(`${apiUrl.localization}/record/${id}`, data)
  },

  addNewKeyLocalization(data) {
    return axios.post(`${apiUrl.localization}/record/`, data)
  },

  addNewLanguage(lang) {
    return axios.post(`${apiUrl.localization}/translation`, lang)
  },

  editLanguage(datalang) {
    return axios.put(`${apiUrl.localization}/translation`, datalang)
  },

  deleteKeyLocalization(id, user) {
    return axios.delete(`${apiUrl.localization}/record/${id}`, { data: user })
  },

  exportLocalization(lang) {
    return axios.get(`${apiUrl.localization}/translation?lang=${lang}`)
  },

  publishLocalization() {
    return axios.post(`${apiUrl.localization}/publish`)
  },

  getSettingLanguage() {
    return axios.get(`${apiUrl.localization}/settings`)
  },

  updateSettingLanguage(data) {
    return axios.put(`${apiUrl.localization}/settings/${data.id}`, data)
  },

  // historical
  fetchhistorical(page, limit = pagination.pageSize, dataSearch) {
    return axios.get(`${apiUrl.historical}?page=${page}&limit=${limit}&database=${dataSearch.database}&lang=${dataSearch.lang}&stringsChange=${dataSearch.stringsChange}&user=${dataSearch.user}`)
  },

  // check authenticated
  checkAuthenticated() {
    return axios.get(`${apiUrl.auth}/checkAuthenticated`)
  },

  // check getLoginUrl
  getLoginUrl() {
    return axios.get(`${apiUrl.auth}/getLoginUrl`)
  },

  // check getLoginUrl
  getUserInfo() {
    return axios.get(`${apiUrl.auth}/getUserInfo`)
  },

  // logout
  logout() {
    return axios.get(`${apiUrl.auth}/logout`)
  },

  // logout url
  getLogoutUrl() {
    return axios.get(`${apiUrl.auth}/getLogoutUrl`)
  },

  // check createSession
  createSession(code) {
    return axios.get(`${apiUrl.auth}/createSession?code=${code}`)
  },

  // get user permission for localization
  getUserPermissionLocalization() {
    return axios.get(`${apiUrl.localizationPermission}`)
  },

  searchUserPermission(userId) {
    return axios.get(`${apiUrl.localizationPermission}/searchUser/${userId}`)
  },

  // update users permission for localization
  putAllUsers(data) {
    return axios.post(`${apiUrl.localizationPermission}/updateAllUser`, data)
  },

  // manage roles for user accept metrix
  getAllUserInfoRole() {
    return axios.get(`${apiUrl.roles}`)
  },

  updateUserInfoRole(data) {
    return axios.post(`${apiUrl.roles}/updateUserRoles`, data)
  },

  getAllRoles() {
    return axios.get(`${apiUrl.roles}/getAllRoles`)
  },

  deleteUserRole(id) {
    return axios.delete(`${apiUrl.roles}/${id}`)
  },

  // count number localization when empty item
  countUnlocalization() {
    return axios.get(`${apiUrl.localization}/unlocalization`)
  },

  fetchUnlocalization(page = 1, limit = pagination.pageSize, textSearch = '', lang = 'en') {
    return axios.get(`${apiUrl.localization}/emptyrecord/?page=${page}&limit=${limit}&text=${textSearch}&lang=${lang}`)
  },
}
