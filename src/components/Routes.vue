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
                    <th>Address Username</th>
                    <th>Address Domain</th>
                    <th>Recipient</th>
                </tr>
                <route v-for="(route, index) in routeList" :key="`${route.address_user}@${route.address_domain}`" :entry="route" :index="index"
                       @remove-route="routeList.splice(index, 1)" @update-route="handleRouteChange"></route>
            </table>
            <div class="form_buttons">
                <button type="button" @click="handleCreateRoute" :disabled="inProgress">Create New Routing Entry</button>
            </div>
        </div>
        <div class="links_list">
            <router-link to="/home">Home</router-link>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {create as dialogCreate} from 'vue-modal-dialogs'
    import {mapState, mapActions} from 'vuex'
    import {emailMgmtService} from '@/services'
    import Route from '@/components/Route'
    import EditRoute from '@/components/EditRoute'

    const addDialog = dialogCreate(EditRoute, 'route')

    export default {
        name: 'routes',
        components: {Route},
        data() {
            return {
                routeList: [],
                inProgress: false,
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.setPageTitle('Mail Routing')
            this.populateRoutes()
        },
        methods: {
            ...mapActions(['setPageTitle']),
            ...mapActions('alert', ['error']),

            populateRoutes() {
                emailMgmtService.getRoutes(this.auth, true)
                .then(
                    response => {
                        this.routeList = response
                    },
                    failure => {
                        this.error('Failed to update mail routing: ' + failure.message)
                    },
                )
            },

            handleRouteChange(index, updatedRoute) {
                Vue.set(this.routeList, index, updatedRoute)
            },

            handleCreateRoute() {
                let blankRoute = {
                    address_user: '',
                    address_domain: '',
                    recipient: '',
                }
                this.inProgress = true
                addDialog(blankRoute)
                .then(
                    response => {
                        emailMgmtService.createRoute(this.auth, response)
                        .then(
                            response => {
                                this.routeList.push(response)
                                this.inProgress = false
                            },
                            failure => {
                                this.error('Failed to create mail route: ' + failure.message)
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
