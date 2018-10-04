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
        <td>{{entry.address_user}}</td>
        <td>{{entry.address_domain}}</td>
        <td>{{entry.recipient}}</td>
        <td class="listing_centered">
            <a href="#" @click="handleEditRoute" :disabled="inProgress"><i class="fas fa-edit icon"></i></a>
            <a href="#" @click.prevent="handleDeleteRoute" :disabled="inProgress"><i class="fas fa-trash-alt icon icon-delete"></i></a>
        </td>
    </tr>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {create as dialogCreate} from 'vue-modal-dialogs'
    import {emailMgmtService} from '@/services'
    import EditRoute from '@/components/EditRoute'

    const editDialog = dialogCreate(EditRoute, 'user')

    export default {
        name: 'route',
        props: ['entry', 'index'],
        data() {
            return {
                inProgress: false,
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        methods: {
            ...mapActions('alert', ['error']),

            handleEditRoute() {
                this.inProgress = true
                editDialog(this.entry)
                .then(
                    result => {
                        emailMgmtService.updateRoute(this.auth, this.entry.address_user, this.entry.address_domain, result)
                        .then(
                            response => {
                                this.$emit('update-route', this.index, response)
                                this.inProgress = false
                            },
                            failure => {
                                this.error('Failed to update routing entry: ' + failure.message)
                                this.inProgress = false
                            }
                        )
                    },
                    cancelled => {
                        this.inProgress = false
                    },
                )
            },

            handleDeleteRoute() {
                if (!this.inProgress) {
                    this.inProgress = true
                    emailMgmtService.deleteRoute(this.auth, this.entry.address_user, this.entry.address_domain)
                    .then(
                        success => {
                            this.$emit('remove-route')
                            this.inProgress = false
                        },
                        failure => {
                            this.error('Failed to delete routing entry: ' + failure.message)
                            this.inProgress = false
                        },
                    )
                }
            },
        },
    }
</script>
