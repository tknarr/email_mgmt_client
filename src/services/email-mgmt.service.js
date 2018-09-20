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

import config from 'config'
import axios from 'axios'
import {ApiError} from '@/util'

/**
 * Functions to access the email management service back-end.
 *
 * The functions correspond to one of the methods exposed by the back-end
 * API. They all return a resolved promise containing the response from the
 * back-end (if any) upon success, and a rejected promise containing the
 * appropriate ApiError object upon error.
 *
 * Configuration of the back-end service URL is done via the WebPack
 * config object.
 */

export const emailMgmtService = {
    getAccountTypes,
    getCurrentUser,
    changePassword,
    getPasswdView,
    getSystemAliases,
    getMergedAliases,
    syncAliases,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
    getRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
}

const svc = axios.create({
    baseURL: config.apiUrl,
})

/**
 * Helper to convert a failure/error from Axios into an ApiError object
 * to be returned in the event of an error.
 *
 * @param err
 * @returns {ApiError}
 */
function createApiError(err) {
    let e = new ApiError()
    if (err.response) {
        e.status = err.response.status
        e.message = err.response.data.message || err.response.statusText
    } else if (err.request) {
        e.status = 503
        e.message = 'No response from server'
    } else {
        e.status = 503
        e.message = err.message
    }
    return e
}

function getAccountTypes(auth) {
    return svc.get('account_types', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getCurrentUser(auth) {
    return svc.get('user', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function changePassword(auth, oldPassword, newPassword) {
    return svc.post('password', {current_password: oldPassword, new_password: newPassword}, {auth: auth})
    .then(
        success => {
            return Promise.resolve(newPassword)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getPasswdView(auth) {
    return svc.get('users/passwd', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getSystemAliases(auth) {
    return svc.get('system_aliases', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getMergedAliases(auth) {
    return svc.get('system_aliases/merged', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function syncAliases(auth) {
    return svc.get('system_aliases/sync', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getUsers(auth, ordered) {
    return svc.get('users', {params: {ordered: (ordered ? 'yes' : 'no')}, auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getUser(auth, username) {
    return svc.get(`user/${username}`, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function createUser(auth, attributes) {
    return svc.post('users', attributes, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function updateUser(auth, username, attributes) {
    return svc.put(`user/${username}`, attributes, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function deleteUser(auth, username) {
    return svc.delete(`user/${username}`, {auth: auth})
    .then(
        success => {
            return Promise.resolve(null)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getDomains(auth, includeRouting = false) {
    let url = includeRouting ? 'domains/routing' : 'domains'
    return svc.get(url, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}
function createDomain(auth, domain) {
    return svc.post('domains', {name: domain}, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function updateDomain(auth, domain, newDomain) {
    return svc.put(`domain/${domain}`, {name: newDomain}, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function deleteDomain(auth, domain) {
    return svc.delete(`domain/${domain}`, {auth: auth})
    .then(
        success => {
            return Promise.resolve(null)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getRoutes(auth) {
    return svc.get('routes', {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function getRoute(auth, addressUser, addressDomain) {
    return svc.get(`route/${addressUser}/${addressDomain}`, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function createRoute(auth, attributes) {
    return svc.post('routes', attributes, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function updateRoute(auth, addressUser, addressDomain, attributes) {
    return svc.put(`route/${addressUser}/${addressDomain}`, attributes, {auth: auth})
    .then(
        response => {
            return Promise.resolve(response.data)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}

function deleteRoute(auth, addressUser, addressDomain) {
    return svc.delete(`route/${addressUser}/${addressDomain}`, {auth: auth})
    .then(
        success => {
            return Promise.resolve(null)
        },
        failure => {
            return Promise.reject(createApiError(failure))
        },
    )
}
