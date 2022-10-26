<template>
    <div class="wplayer-buffering">
        <img class="loading" src="../icons/loading.png" />
    </div>
</template>
  
<script setup lang="ts">

</script>

<style lang="less">
.wplayer-buffering {
    z-index: 2;
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    .loading {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 50%;
        left: 50%;
        margin: -15px 0 0 -15px;
        -webkit-animation: wplayer-loading-rotate 2s linear infinite;
        -moz-animation: wplayer-loading-rotate 2s linear infinite;
        -o-animation: wplayer-loading-rotate 2s linear infinite;
        animation: wplayer-loading-rotate 2s linear infinite;
    }

    @-webkit-keyframes wplayer-loading-rotate {
        from {
            -webkit-transform: rotate(0deg)
        }

        to {
            -webkit-transform: rotate(360deg)
        }
    }

    @-moz-keyframes wplayer-loading-rotate {
        from {
            -moz-transform: rotate(0deg)
        }

        to {
            -moz-transform: rotate(359deg)
        }
    }

    @-o-keyframes wplayer-loading-rotate {
        from {
            -o-transform: rotate(0deg)
        }

        to {
            -o-transform: rotate(359deg)
        }
    }

    @keyframes wplayer-loading-rotate {
        from {
            transform: rotate(0deg)
        }

        to {
            transform: rotate(359deg)
        }
    }
}
</style>  