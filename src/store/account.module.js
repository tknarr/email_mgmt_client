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

import {router} from '@/router'
import {emailMgmtService} from '@/services'

/**
 * Data and actions related to the currently logged-in user and account
 * type information.
 */

const state = {
    status: {
        loggingIn: false,
        loggedIn: false,
        admin: false,
    },
    user: null,
    auth: {},
    accountTypes: {
        R: {code: 'R', description: 'Root', abbreviation: 'Root', home_root: '/'},
        S: {code: 'S', description: 'System user', abbreviation: 'Sys', home_root: '/home/'},
        A: {code: 'A', description: 'Alias', abbreviation: 'Alias', home_root: '/alias/'},
        V: {code: 'V', description: 'Virtual user', abbreviation: '', home_root: '/home/vmail/'},
    },
}

const actions = {
    login({dispatch, commit}, {username, password}) {
        commit('loginRequest', {username, admin: false})
        emailMgmtService.getCurrentUser({username, password})
        .then(
            user => {
                commit('loginSuccess', {user, auth: {username, password}})
                dispatch('setLogoutLink', true, {root: true})
                router.push('/home')
                dispatch('updateAccountTypes')
            },
            failure => {
                commit('loginFailure')
                dispatch('alert/error', 'Login failed: ' + failure.message, {root: true})
            },
        )
    },

    logout({dispatch, commit}) {
        commit('logout')
        dispatch('setLogoutLink', false, {root: true})
        router.push('/login')
    },

    refreshCurrentUser({dispatch, commit}) {
        emailMgmtService.getCurrentUser(state.auth)
        .then(
            user => {
                commit('refreshCurrentUser', user)
            },
            failure => {
                dispatch('alert/error', 'Failed to get current user: ' + failure.message, {root: true})
            },
        )
    },

    changePassword({dispatch, commit}, {oldPassword, newPassword}) {
        return emailMgmtService.changePassword(state.auth, oldPassword, newPassword)
        .then(
            success => {
                commit('updatePassword', newPassword)
                dispatch('alert/success', 'Password change successful', {root: true})
                dispatch('refreshCurrentUser')
                return Promise.resolve(null)
            },
            failure => {
                dispatch('alert/error', 'Password change failed: ' + failure.message, {root: true})
                dispatch('refreshCurrentUser')
                return Promise.reject(failure)
            },
        )
    },

    updateAccountTypes({dispatch, commit}) {
        emailMgmtService.getAccountTypes(state.auth)
        .then(
            accountTypes => {
                commit('updateAccountTypes', accountTypes)
            },
            failure => {
                dispatch('alert/error', 'Failed updating list of account types: ' + failure.message, {root: true})
            },
        )
    },
}

const mutations = {
    loginRequest(state, user) {
        state.status = {loggingIn: true, loggedIn: false, admin: user.admin}
        state.user = user
    },

    loginSuccess(state, loginData) {
        state.status = {loggingIn: false, loggedIn: true, admin: loginData.user.admin}
        state.user = loginData.user
        state.auth = loginData.auth
    },

    loginFailure(state) {
        state.status = {loggingIn: false, loggedIn: false, admin: false}
        state.user = null
    },

    logout(state) {
        state.status = {loggingIn: false, loggedIn: false, admin: false}
        state.user = null
        state.auth = {}
    },

    refreshCurrentUser(state, user) {
        state.user = user
    },

    updatePassword(state, password) {
        state.auth.password = password
    },

    updateAccountTypes(state, accountTypes) {
        if (accountTypes.length > 0) {
            let newTypes = {}
            accountTypes.forEach(item => {
                newTypes[item.code] = {code: item.code, description: item.description, abbreviation: item.abbreviation, home_root: item.home_root}
            })
            state.accountTypes = newTypes
        }
    },
}

export const account = {
    namespaced: true, state, actions, mutations,
}
