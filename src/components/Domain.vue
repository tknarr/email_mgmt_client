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
        <td>{{domain.name}}</td>
        <td>{{domain.default_recipient}}</td>
        <td class="listing_centered">
            <a href="#" @click.prevent="handleDeleteDomain" :disabled="inProgress"><i class="fas fa-trash-alt icon icon-delete"></i></a>
        </td>
    </tr>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {emailMgmtService} from '@/services'

    export default {
        name: 'domain',
        props: ['domain', 'index'],
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

            handleDeleteDomain() {
                if (!this.inProgress) {
                    this.inProgress = true
                    emailMgmtService.deleteDomain(this.auth, this.domain.name)
                    .then(
                        success => {
                            this.$emit('remove-domain')
                            this.inProgress = false
                        },
                        failure => {
                            this.error('Failed to delete domain: ' + failure.message)
                            this.inProgress = false
                        },
                    )
                }
            },
        },
    }
</script>
