import axios from ‘axios’
export default axios.create({
 baseURL: `your API end point`,
 headers: {
 ‘Accept’: ‘application/json’,
 ‘Content-Type’: ‘application/json’
 }
 })