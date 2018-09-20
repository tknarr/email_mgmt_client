<template>
    <div>
        <h2 class="page_title">{{pageTitle}}</h2>

        <div v-show="alert.message" class="message" :class="alert.type">
            {{alert.message}}
        </div>

        <div>
            <router-view/>
        </div>

        <div v-if="logoutLink" class="container">
            <div class="links_list"><router-link to="/login">Logout</router-link></div>
        </div>

        <dialogs-wrapper transition-name="dialog"></dialogs-wrapper>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'app',
        computed: {
            ...mapState({
                alert: state => state.alert,
                pageTitle: state => state.pageTitle,
                logoutLink: state => state.logoutLink,
            }),
        },
        methods: {
            ...mapActions({
                clearAlert: 'alert/clear',
            }),
        },
        watch: {
            $route(to, from) {
                this.clearAlert()
            },
        },
    }
</script>
