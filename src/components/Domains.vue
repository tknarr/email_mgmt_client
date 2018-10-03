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
                    <th>Domain</th>
                    <th>Default recipient</th>
                </tr>
                <domain v-for="(domain, index) in domainList" :key="domain.name" :domain="domain" :index="index"
                        @remove-domain="domainList.splice(index, 1)"></domain>
            </table>
            <div class="form_buttons">
                <button type="button" @click="handleCreateDomain" :disabled="inProgress">Create New Domain</button>
            </div>
        </div>
        <div class="links_list">
            <router-link to="/home">Home</router-link>
        </div>
    </div>
</template>

<script>
    import {create as dialogCreate} from 'vue-modal-dialogs'
    import {mapState, mapActions} from 'vuex'
    import {emailMgmtService} from '@/services'
    import Domain from '@/components/Domain'
    import EditDomain from '@/components/EditDomain'

    const addDialog = dialogCreate(EditDomain, 'domain')

    export default {
        name: 'domains',
        components: {Domain},
        data() {
            return {
                domainList: [],
                inProgress: false,
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.setPageTitle('Hosted Domains')
            this.populateDomains()
        },
        methods: {
            ...mapActions(['setPageTitle']),
            ...mapActions('alert', ['error']),

            populateDomains() {
                emailMgmtService.getDomains(this.auth, true)
                .then(
                    response => {
                        this.domainList = response
                    },
                    failure => {
                        this.error('Failed to update domain list: ' + failure.message)
                    },
                )
            },

            handleCreateDomain() {
                let blankDomain = {
                    name: '',
                }
                addDialog(blankDomain)
                .then(
                    result => {
                        emailMgmtService.createDomain(this.auth, result.name)
                        .then(
                            response => {
                                this.domainList.push(response)
                                this.inProgress = false
                            },
                            failure => {
                                this.error('Failed to create domain: ' + failure.message)
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
