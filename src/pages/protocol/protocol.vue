<template>
    <div class="protocol">{{message}}</div>
</template>

<script>
import { getSystemConfigCkey } from 'api/general';
    export default {
        data() {
            return{
                ckey:'REGISTRATION_AGREEMENT',
                message:''
            }
        },
        mounted() {
            this.getMessage()
        },
        methods:{
            getMessage(){
                getSystemConfigCkey(this.ckey)
                .then(data =>{
                    this.message = data.cvalue
                })
            }
        }
    }
</script>
<style scoped>
    .protocol{
        padding: .3rem;
        font-size: .32rem;
    }
</style>


