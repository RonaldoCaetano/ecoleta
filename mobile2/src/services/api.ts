import axios from 'axios'

const api = axios.create({
    baseURl: 'http://192.168.2.104'
})

export default api