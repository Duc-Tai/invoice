import _ from 'lodash'
export default function ({ $axios, store, redirect }) {
    // ////console.log('Enter');
    $axios.interceptors.response.use(function (response) {
        return response
    }, async function (error) {
        const status = error.response.status
        if (status == 401) {
            await store.dispatch('auth/Logout')
            return redirect('/auth/login')
        } else if (status == 403) {
            try {
                const newToken = await store.dispatch('auth/renewAccessToken')
                if (newToken) {
                    const originalRequest = error.config;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return $axios(originalRequest);
                } else {
                    await store.dispatch('auth/Logout')
                    return redirect('/auth/login')
                }
            } catch (error) {
            }
        } else if (status == 409) {
            return redirect('/home')
        }
        throw error
    })
}