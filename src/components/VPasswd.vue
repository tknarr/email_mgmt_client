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
                    <th>UID</th>
                    <th>GID</th>
                    <th>Home directory</th>
                    <th>Transport</th>
                </tr>
                <passwd-entry v-for="entry in entryList" :key="entry.username" :entry="entry"></passwd-entry>
            </table>
        </div>
        <div class="links_list">
            <router-link to="/home">Home</router-link>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {emailMgmtService} from '@/services'
    import PasswdEntry from '@/components/PasswdEntry'

    export default {
        name: 'v-passwd',
        components: {PasswdEntry},
        data() {
            return {
                entryList: [],
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.setPageTitle('Passwd View of Users')
            this.populateEntries()
        },
        methods: {
            ...mapActions(['setPageTitle']),

            populateEntries() {
                emailMgmtService.getPasswdView(this.auth)
                .then(
                    response => {
                        this.entryList = response
                    },
                    failure => {
                        this.error('Failed to update passwd view: ' + failure.message)
                    },
                )
            },
        },
    }
</script>
