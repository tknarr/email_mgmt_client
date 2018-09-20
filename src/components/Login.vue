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
    <div class="container">
        <form @submit.prevent="handleSubmit">
            <table class="entry">
                <tr>
                    <td class="entry_label">
                        <label for="username">Username:</label>
                    </td>
                    <td class="entry_value">
                        <input type="text" v-model="username" id="username" name="username" required maxlength="50" pattern="[a-zA-Z0-9_.]+"/>
                        <div v-show="submitted && !username" class="error_message">Username is required.</div>
                    </td>
                </tr>
                <tr>
                    <td class="entry_label">
                        <label for="password">Password:</label>
                    </td>
                    <td class="entry_value">
                        <input type="password" v-model="password" id="password" name="password" required maxlength="50"/>
                        <div v-show="submitted && !password" class="error_message">Password is required.</div>
                    </td>
                </tr>
            </table>
            <div class="form_buttons">
                <input type="submit" value="Login" :disabled="status.loggingIn"/>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'login',
        data() {
            return {
                username: '',
                password: '',
                submitted: false,
            }
        },
        computed: {
            ...mapState('account', ['status']),
        },
        created() {
            this.logout()
            this.setPageTitle('Log In')
            this.setLogoutLink(false)
        },
        methods: {
            ...mapActions('account', ['login', 'logout']),
            ...mapActions(['setPageTitle', 'setLogoutLink']),

            handleSubmit() {
                this.submitted = true
                const {username, password} = this
                if (username && password) {
                    this.login({username, password})
                }
            },
        },
    }
</script>
