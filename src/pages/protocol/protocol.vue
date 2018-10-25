<template>
    <div class="protocol-wrapper">
        <div class="protocol">
            <Scroll :pullUpLoad="pullUpLoad">
                <p v-html="xyText" class="rich-text-description"></p>
            </Scroll>
            <full-loading v-show="loading" :title="loadText"></full-loading>
        </div>
    </div>
</template>
<script>
  import FullLoading from 'base/full-loading/full-loading';
  import Scroll from 'base/scroll/scroll';
  import { getSystemConfigCkey } from 'api/general';
export default {
    data() {
      return{
        pullUpLoad: null,
        loading: false,
        loadText: '',
        ckey: 'REGISTRATION_AGREEMENT',
        xyText: ''
      };
    },
    mounted() {
      this.getMessage();
    },
    methods: {
      getMessage() {
        this.loading = true;
        getSystemConfigCkey(this.ckey)
            .then(data => {
              this.loading = false;
              this.xyText = data.cvalue;
            }).catch(() => { this.loading = false; });
      }
    },
    components: {
      Scroll,
      FullLoading
    }
};
</script>
<style lang="scss" scoped>
    .protocol-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        background: #fff;
        z-index: 100;
        .protocol {
            padding: .3rem;
            font-size: .32rem;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            overflow: auto;
        }
    }
</style>