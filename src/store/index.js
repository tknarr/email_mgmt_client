/*****
 * email_mgmt
 * Copyright (C) 2018 Silverglass Technical
 * Author: Todd Knarr <tknarr@silverglass.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import {alert} from './alert.module'
import {account} from './account.module'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
    key: 'vuex',
    storage: window.sessionStorage,
    reducer: state => ({account: state.account}),
    filter: mutation => (mutation.type.startsWith('account/')),
})

const store = new Vuex.Store({
    state: {
        pageTitle: '',
        logoutLink: true,
    },

    actions: {
        setPageTitle({commit}, pageTitle) {
            commit('setPageTitle', pageTitle)
        },

        setLogoutLink({commit}, flag) {
            commit('setLogoutLink', flag)
        },
    },

    mutations: {
        setPageTitle(state, pageTitle) {
            state.pageTitle = pageTitle
        },

        setLogoutLink(state, flag) {
            state.logoutLink = flag
        },
    },

    modules: {
        alert,
        account,
    },
    plugins: [vuexLocalStorage.plugin],
})

export default store
