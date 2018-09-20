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
    <tr>
        <td>{{user.username}}</td>
        <td>{{accountTypes[user.acct_type]['description']}}</td>
        <td class="listing_centered"><input type="checkbox" :checked="user.admin" @click="handleAdminCheckbox(user.admin)"
                                            :disabled="inProgress || isCurrentAdmin || isAlias"></td>
        <td class="listing_right">
            <div v-show="user.change_attempts > 0">
                {{user.change_attempts}}
                <button type="button" class="form_item_button" @click="handleResetFailedPasswordAttempts" :disabled="inProgress">Reset</button>
            </div>
        </td>
        <td class="listing_centered">
            <span class="form_item_button"><i class="fas fa-edit" @click="handleEditUser" :disabled="inProgress"></i></span>
            <span class="form_item_button" v-if="!isCurrentAdmin"><i class="fas fa-trash-alt icon-delete" @click="handleDeleteUser" :disabled="inProgress"></i></span>
        </td>
    </tr>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {create as dialogCreate} from 'vue-modal-dialogs'
    import {emailMgmtService} from '@/services'
    import EditUser from '@/components/EditUser'

    const editDialog = dialogCreate(EditUser, 'user')

    export default {
        name: 'user',
        props: ['user', 'index'],
        data() {
            return {
                inProgress: false,
            }
        },
        computed: {
            ...mapState('account', ['auth', 'accountTypes']),

            isCurrentAdmin() {
                // eslint-disable-next-line eqeqeq
                return this.user.username == this.auth.username
            },

            isAlias() {
                // eslint-disable-next-line eqeqeq
                return this.user.acct_type == 'A'
            },
        },
        methods: {
            ...mapActions('alert', ['error']),

            handleAdminCheckbox(adminFlag) {
                this.inProgress = true
                // eslint-disable-next-line eqeqeq
                let adminSetting = (adminFlag == 0) ? 1 : 0
                emailMgmtService.updateUser(this.auth, this.user.username, {admin: adminSetting})
                .then(
                    response => {
                        this.$emit('update-user', this.index, response)
                        this.inProgress = false
                    },
                    failure => {
                        this.error('Failed to update user: ' + failure.message)
                        this.inProgress = false
                    },
                )
            },

            handleResetFailedPasswordAttempts() {
                this.inProgress = true
                emailMgmtService.updateUser(this.auth, this.user.username, {change_attempts: 0})
                .then(
                    response => {
                        this.$emit('update-user', this.index, response)
                        this.inProgress = false
                    },
                    failure => {
                        this.error('Failed to update user: ' + failure.message)
                        this.inProgress = false
                    },
                )
            },

            handleEditUser() {
                this.inProgress = true
                editDialog(this.user)
                .then(
                    result => {
                        emailMgmtService.updateUser(this.auth, this.user.username, result)
                        .then(
                            response => {
                                this.$emit('update-user', this.index, response)
                                this.inProgress = false
                            },
                            failure => {
                                this.error('Failed to update user: ' + failure.message)
                                this.inProgress = false
                            }
                        )
                    },
                    cancelled => {
                        this.inProgress = false
                    },
                )
            },

            handleDeleteUser() {
                if (!this.inProgress) {
                    this.inProgress = true
                    emailMgmtService.deleteUser(this.auth, this.user.username)
                    .then(
                        success => {
                            this.$emit('remove-user')
                            this.inProgress = false
                        },
                        failure => {
                            this.error('Failed to delete user: ' + failure.message)
                            this.inProgress = false
                        },
                    )
                }
            },
        },
    }
</script>
