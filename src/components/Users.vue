<!--
    email_mgmt
    Copyright (C) 2018 Silverglass Technical
    Author: Todd Knarr <tknarr@silverglass.org>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
    <div>
        <div class="container">
            <table class="listing">
                <tr>
                    <th>Username</th>
                    <th>Account Type</th>
                    <th>Admin</th>
                    <th>Failed Password<br>Change Attempts</th>
                </tr>
                <user v-for="(user, index) in userList" :key="user.username" :user="user" :index="index" @remove-user="userList.splice(index, 1)"
                      @update-user="handleUserChange"></user>
            </table>
            <div class="form_buttons">
                <button type="button" @click="handleCreateUser" :disabled="inProgress">Create New User</button>
            </div>
        </div>
        <div class="links_list">
            <router-link to="/home">Home</router-link>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {create as dialogCreate} from 'vue-modal-dialogs'
    import {mapState, mapActions} from 'vuex'
    import {emailMgmtService} from '@/services'
    import User from '@/components/User'
    import EditUser from '@/components/EditUser'

    const addDialog = dialogCreate(EditUser, 'user', 'passwordRequired')

    export default {
        name: 'users',
        components: {User},
        data() {
            return {
                userList: [],
                inProgress: false,
            }
        },
        computed: {
            ...mapState('account', ['auth', 'accountTypes']),
        },
        created() {
            this.setPageTitle('User List')
            this.populateUsers()
        },
        methods: {
            ...mapActions(['setPageTitle']),
            ...mapActions('alert', ['error']),

            populateUsers() {
                emailMgmtService.getUsers(this.auth, true)
                .then(
                    response => {
                        this.userList = response
                    },
                    failure => {
                        this.error('Failed to update users list: ' + failure.message)
                    },
                )
            },

            handleUserChange(index, updatedUser) {
                Vue.set(this.userList, index, updatedUser)
            },

            handleCreateUser() {
                let blankUser = {
                    username: '',
                    acct_type: 'V',
                    admin: 0,
                }
                this.inProgress = true
                addDialog(blankUser, true)
                .then(
                    result => {
                        emailMgmtService.createUser(this.auth, result)
                        .then(
                            response => {
                                this.userList.push(response)
                                this.inProgress = false
                            },
                            failure => {
                                this.error('Failed to create user: ' + failure.message)
                                this.inProgress = false
                            }
                        )
                    },
                    cancelled => {
                        this.inProgress = false
                    },
                )
            },
        },
    }
</script>
