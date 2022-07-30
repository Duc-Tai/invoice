export default async function ({ store, redirect }) {
    let isLogin = store.getters['auth/isLogin']
    if (!isLogin) {
        return redirect('/auth/login')
    }
}