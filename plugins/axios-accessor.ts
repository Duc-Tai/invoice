import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/common/ultils/axios'

const accessor: Plugin = ({ $axios }) => {
    initializeAxios($axios)
}

export default accessor