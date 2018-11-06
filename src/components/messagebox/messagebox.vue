<template>
    <div class="message_box_wrapper">
        <div class="message_box_mask"></div>
        <div class="message_box_main">

        </div>
    </div>
</template>

<script>
export default {
};
</script>

<style scoped lang="scss">
.message_box_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .message_box_mask {
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.1;
    }
    .message_box_main {
        width: 5.6rem;
        height: 4rem;
        font-size: 0.36rem;
        background-color: #fff;
        border: 0.02rem solid #ebeef5;
        border-radius: 0.08rem;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
    }
}
</style>