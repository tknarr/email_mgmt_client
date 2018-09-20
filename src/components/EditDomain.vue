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
                                <label for="domain_name">Domain name:</label>
                            </td>
                            <td class="entry_value">
                                <input type="text" v-model="name" id="domain_name" name="domain_name" required :disabled="submitting" maxlength="50"/>
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
        name: '',
        props: ['domain'],
        data() {
            return {
                submitted: false,
                submitting: false,
                name: '',
            }
        },
        computed: {
            ...mapState('account', ['auth']),
        },
        created() {
            this.name = this.domain.name
        },
        methods: {
            handleSubmit() {
                this.submitted = true
                this.submitting = true
                // eslint-disable-next-line eqeqeq
                if (!this.name) {
                    this.submitting = false
                    return
                }
                let result = {}
                result.name = this.name
                this.submitting = false
                // eslint-disable-next-line eqeqeq
                this.$close(result)
            },

            handleCancel() {
                this.$error()
            },
        },
    }
</script>
