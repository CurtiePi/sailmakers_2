import authenticationService from '../../services/AuthenticationService';

const state = () => ({
    loginApiStatus: false,
    loginToken: '',
});

const getters = {
    getLoginApiStatus(state) {
        return state.loginApiStatus;
    },
    getLoginToken(state) {
        return state.loginToken;
    }
};

const actions = {
    async userLogin({commit}, payload) {
        const response = await authenticationService.login(payload)
            .catch((err) => {
                console.log(err)
            });
        console.log(response);
        console.log(response.data.token);
        if (response && response.data) {
            commit('setLoginApiStatus', true);
            commit('setLoginToken', response.data.token);

        }
    }
};

const mutations = {
    setLoginApiStatus(state, payload) {
        state.loginApiStatus = payload;
    },
    setLoginToken(state, payload) {
        state.loginToken = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
