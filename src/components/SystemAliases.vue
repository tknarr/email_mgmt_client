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
                    <th>System Alias</th>
                    <th>Targets</th>
                </tr>
                <system-alias v-for="alias in aliasList" :key="`${alias.username}/${alias.system_alias}`" :alias="alias"></system-alias>
            </table>
            <div class="form_buttons">
                <button type="button" @click="handleSync" :disabled="inProgress">Sync Alias Users with System Aliases</button>
            </div>
        </div>
        <div class="links_list">
            <router-link to="/home">Home</router-link>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {emailMgmtService} from '@/services'
    import SystemAlias from '@/components/SystemAlias'

    export default {
        name: 'system-aliases',
        components: {SystemAlias},
        data() {
            return {
                aliasList: [],
                inProgress: false,
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.setPageTitle('Alias Users and System Aliases')
            this.populateAliases()
        },
        methods: {
            ...mapActions(['setPageTitle']),
            ...mapActions('alert', ['error']),

            populateAliases() {
                emailMgmtService.getMergedAliases(this.auth)
                .then(
                    response => {
                        this.aliasList = response
                    },
                    failure => {
                        this.error('Failed to update aliases list: ' + failure.message)
                    },
                )
            },

            handleSync() {
                emailMgmtService.syncAliases(this.auth)
                .then(
                    response => {
                        this.aliasList = response
                    },
                    failure => {
                        this.error('Failed to update synced aliases list: ' + failure.message)
                    }
                )
            },
        },
    }
</script>
