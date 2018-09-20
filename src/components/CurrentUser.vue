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
        <table class="listing">
            <tr>
                <th>Username</th>
                <th>Account Type</th>
                <th>Failed Password<br>Change Attempts</th>
            </tr>
            <tr>
                <td>{{user.username}}</td>
                <td>
                    <span>{{accountTypes[user.acct_type]['description']}}</span><span v-if="status.admin">, Admin</span>
                </td>
                <td class="listing_right">{{user.change_attempts}}</td>
            </tr>
        </table>
        <div class="form_buttons">
            <router-link to="/change_password" tag="button" type="button">Change Password</router-link>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'current-user',
        computed: {
            ...mapState('account', ['status', 'user', 'accountTypes']),
        },
    }
</script>
