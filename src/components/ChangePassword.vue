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
        <form @submit.prevent="handleSubmit">
            <table class="entry">
                <tr>
                    <td class="entry_label">
                        <label for="old_password">Old password:</label>
                    </td>
                    <td class="entry_value">
                        <input type="password" v-model="oldPassword" id="old_password" name="old_password" required maxlength="50"/>
                        <div v-show="submitted && !oldPassword" class="error_message">Old password is required.</div>
                    </td>
                </tr>
                <div class="spacer"></div>
                <tr>
                    <td class="entry_label">
                        <label for="new_password">New password:</label>
                    </td>
                    <td class="entry_value">
                        <input type="password" v-model="newPassword" id="new_password" name="new_password" required maxlength="50"/>
                        <div v-show="submitted && !newPassword" class="error_message">New password is required.</div>
                    </td>
                </tr>
                <tr>
                    <td class="entry_label">
                        <label for="new_password">Confirm password:</label>
                    </td>
                    <td class="entry_value">
                        <input type="password" v-model="confirmPassword" id="confirm_password" name="confirm_password" required maxlength="50"/>
                        <div v-show="submitted && !confirmPassword" class="error_message">Confirmation of password is required.</div>
                        <div v-show="submitted && (newPassword != confirmPassword)" class="error_message">Confirmation must match new password.</div>
                    </td>
                </tr>
            </table>
            <div class="form_buttons">
                <input type="submit" value="Submit" :disabled="submitting"/>
                <router-link to="/home" tag="button" type="button" :disabled="submitting">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {router} from '@/router'

    export default {
        name: 'change-password',
        data() {
            return {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                submitted: false,
                submitting: false,
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.setPageTitle('Change Password')
            this.setLogoutLink(false)
        },
        methods: {
            ...mapActions(['setPageTitle', 'setLogoutLink']),
            ...mapActions('account', ['changePassword']),

            handleSubmit() {
                this.submitting = true
                this.submitted = true
                // eslint-disable-next-line eqeqeq
                if (this.oldPassword && this.newPassword && (this.newPassword == this.confirmPassword)) {
                    this.changePassword({oldPassword: this.oldPassword, newPassword: this.newPassword})
                    .then(
                        success => {
                            router.push('/home')
                        },
                        failure => {
                            this.submitting = false
                        },
                    )
                } else {
                    this.submitting = false
                }
            },
        },
    }
</script>
