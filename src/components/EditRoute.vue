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
                                <label for="address_user">Address username:</label>
                            </td>
                            <td class="entry_value">
                                <input type="text" v-model="address_user" id="address_user" name="address_user" required :disabled="submitting" maxlength="50"
                                       pattern="[a-zA-Z0-9_.]+"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="entry_label">
                                <label for="address_domain">Address domain:</label>
                            </td>
                            <td class="entry_value">
                                <input type="text" v-model="address_domain" id="address_domain" name="address_domain" required :disabled="submitting"
                                       maxlength="50"/>
                            </td>
                        </tr>
                        <div class="spacer"></div>
                        <tr>
                            <td class="entry_label">
                                <label for="recipient">Recipient user:</label>
                            </td>
                            <td class="entry_value">
                                <input type="text" v-model="recipient" id="recipient" name="recipient" required :disabled="submitting" maxlength="50"
                                       pattern="[a-zA-Z0-9_.]+"/>
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
        name: 'edit-route',
        props: ['entry'],
        data() {
            return {
                submitted: false,
                submitting: false,
                address_user: '',
                address_domain: '',
                recipient: '',
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.address_user = this.entry.address_user
            this.address_domain = this.entry.address_domain
            this.recipient = this.entry.recipient
        },
        methods: {
            handleSubmit() {
                this.submitted = true
                this.submitting = true
                if (!this.address_user || !this.address_domain || !this.recipient) {
                    this.submitting = false
                    return
                }
                let result = {}
                result.address_user = this.address_user
                result.address_domain = this.address_domain
                result.recipient = this.recipient
                this.submitting = false
                this.$close(result)
            },

            handleCancel() {
                this.$error()
            },
        },
    }
</script>
