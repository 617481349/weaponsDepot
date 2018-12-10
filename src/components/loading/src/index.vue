<template>
    <div v-if="visible" class="__loading_box">
        <div class="__loading_box_wrapper">
            <div class="__loading_box_spin"></div>
            <div v-if="tips" class="__loading_box_tips">{{ tips }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tips: '',
            visible: false
        };
    }
};
</script>

<style scoped lang="scss">
.__loading_box {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.__loading_box_wrapper {
    padding: 0.4rem;
    border-radius: 0.1rem;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .__loading_box_spin {
        display: inline-block;
        border: 0.08rem solid transparent;
        border-top-color: rgb(204, 204, 204);
        border-left-color: rgb(204, 204, 204);
        border-bottom-color: rgb(204, 204, 204);
        height: 0.65rem;
        width: 0.65rem;
        animation: mint-spinner-rotate 0.8s infinite linear;
        border-radius: 50%;
    }
    .__loading_box_tips {
        display: block;
        color: #fff;
        text-align: center;
        margin-top: 0.2rem;
        font-size: 0.32rem;
    }
}

@-webkit-keyframes mint-spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
@keyframes mint-spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>