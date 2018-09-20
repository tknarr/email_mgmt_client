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
        <div class="links_list"><router-link to="/users">User Management</router-link></div>
        <div class="links_list"><router-link to="/routes">Mail Delivery Routing</router-link></div>
        <div class="links_list"><router-link to="/domains">Hosted Domains</router-link></div>
        <div class="links_list"><router-link to="/passwd">Passwd View of Users</router-link></div>
        <div class="links_list"><router-link to="/aliases">System aliases</router-link></div>
    </div>
</template>

<script>
    export default {
        name: 'admin-links',
    }
</script>
