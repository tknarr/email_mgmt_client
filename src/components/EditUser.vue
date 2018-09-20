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
    <div class="dialog-mask">
        <div class="dialog-content">
            <form @submit.prevent="handleSubmit">
                <div class="dialog-body">
                    <table class="entry">
                        <tr>
                            <td class="entry_label">
                                <label for="username">Username:</label>
                            </td>
                            <td class="entry_value">
                                <input type="text" v-model="username" id="username" name="username" required :disabled="submitting" maxlength="50"
                                       pattern="[a-zA-Z0-9_.]+"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="entry_label">
                                <label for="password">Password:</label>
                            </td>
                            <td class="entry_value">
                                <input type="password" v-model="password" id="password" name="password" :disabled="submitting || accountType == 'A'"
                                       :required="accountType != 'A'" maxlength="50"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="entry_label">
                                <label for="confirmPassword">Confirm password:</label>
                            </td>
                            <td class="entry_value">
                                <input type="password" v-model="confirmPassword" id="confirmPassword" name="confirmPassword"
                                       :disabled="submitting || accountType == 'A'" maxlength="50"/>
                                <div v-show="submitted && (password != confirmPassword)" class="error_message">Confirmation must match password.</div>
                            </td>
                        </tr>
                        <tr>
                            <td class="entry_label">
                                <label for="account_type">Account type:</label>
                            </td>
                            <td class="entry_value">
                                <select id="account_type" v-model="accountType" name="account_type" required :disabled="submitting || accountType == 'A'">
                                    <option value=""></option>
                                    <option v-for="type in accountTypes" :key="type.code" :value="type.code">{{type.description}}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="entry_label">
                                <label for="admin">Admin:</label>
                            </td>
                            <td class="entry_value">
                                <input type="checkbox" id="admin" v-model="admin" name="admin" value="X" :disabled="submitting || accountType == 'A'"/>
                            </td>
                        </tr>
                    </table>
                </div>
                <footer>
                    <input type="submit" class="form_item_button" value="OK" :disabled="submitting"/>
                    <button type="button" class="form_item_button" :disabled="submitting" @click="handleCancel">Cancel</button>
                </footer>
            </form>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'edit-user',
        props: ['user'],
        data() {
            return {
                submitted: false,
                submitting: false,
                username: '',
                password: '',
                confirmPassword: '',
                accountType: '',
                admin: '',
            }
        },
        computed: {
            ...mapState('account', ['auth', 'accountTypes']),
        },
        created() {
            // Copy over user information to model variables with correct semantics.
            // Has to be done because some fields of the user object aren't compatible with
            // the requirements of the form input elements.
            this.username = this.user.username
            this.accountType = this.user.acct_type
            this.admin = this.user.admin ? 'X' : ''
            // Password isn't readable, so blank means no change
            this.password = ''
            this.confirmPassword = ''
        },
        methods: {
            handleSubmit() {
                this.submitted = true
                this.submitting = true
                // eslint-disable-next-line eqeqeq
                if (!this.username || !this.accountType || (!this.password && this.accountType != 'A') || (this.password != this.confirmPassword)) {
                    this.submitting = false
                    return
                }
                // eslint-disable-next-line eqeqeq
                if (this.accountType == 'A') {
                    this.password = ''
                    this.confirmPassword = ''
                    this.admin = ''
                }
                let result = {}
                result.username = this.username
                if (this.password) {
                    result.password = this.password
                }
                result.acct_type = this.accountType
                // eslint-disable-next-line eqeqeq,no-unneeded-ternary
                result.admin = this.admin == 'X' ? true : false
                this.submitting = false
                this.$close(result)
            },

            handleCancel() {
                this.$error()
            },
        },
    }
</script>
