<template>
    <transition name="msgbox-fade">
        <div class="message_box_wrapper" v-if="visible">
            <div class="message_box_mask" @click="handleAction('close')"></div>
            <div class="message_box_main">
                <div class="msg_box__close" v-if="showClose">
                    <div class="btn_container" @click="handleAction('close')">
                        <img src="~assets/img/@3/close_1.png" alt="">
                    </div>
                </div>
                <div class="msg_box__title" :class="{'mb-0':message===''&&!showConfirmButton&&!showCancelButton}">{{ title }}</div>
                <slot>
                    <div class="msg_box__content" v-if="message">
                        <p :style="contentStyle">{{ message }}</p>
                    </div>
                </slot>
                <div class="msg_box__control" v-if="duration === false && (showConfirmButton || showCancelButton)">
                    <div class="confirm btn normal" v-if="showConfirmButton" @click="handleAction('confirm')">{{ confirmButtonText }}</div>
                    <div class="cancel" v-if="showCancelButton" @click="handleAction('cancel')">{{ cancelButtonText }}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            $type: '',
            title: '',
            message: '',
            duration: false,
            visible: false,
            showClose: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            contentStyle: [
                {
                    'text-align': 'center'
                }
            ]
        };
    },
    watch: {
        visible(newValue, oldValue) {
            if (newValue) {
                setTimeout(() => {
                    if (this.duration !== false && typeof this.duration === 'number') {
                        setTimeout(() => {
                            this.handleAction('confirm');
                        }, this.duration);
                    }
                });
            }
        }
    },
    methods: {
        handleAction(action) {
            if (this.$type === 'alert') {
                this.action = 'confirm';
            } else {
                this.action = action;
            }
            this.doClose();
        },
        doClose() {
            if (!this.visible) return;
            this.visible = false;
            if (this.action) {
                this.callback(this.action, this);
            }
        },
        destroy() {
            this.$destroy();
            this.$el.parentNode.removeChild(this.$el);
        }
    },
};
</script>


<style scoped lang="scss">
.mb-0 {
    margin-bottom: 0 !important;
}
.message_box_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    .message_box_mask {
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.1;
    }
    .message_box_main {
        width: 6rem;
        font-size: 0.32rem;
        background-color: #fff;
        border: 0.025rem solid #ebeef5;
        border-radius: 0.32rem;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 0.1rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
    }
}
.msg_box__close {
    text-align: right;
    height: 0.76rem;
    .btn_container {
        height: 100%;
        display: inline-block;
        box-sizing: border-box;
        padding: 0.2rem;
        cursor: pointer;
        img {
            height: 100%;
        }
    }
}
.msg_box__title {
    height: 0.8rem;
    color: #333;
    font-weight: bold;
    text-align: center;
    line-height: 0.8rem;
    margin-bottom: 0.26rem;
}
.msg_box__control {
    text-align: center;
    margin-bottom: 0.24rem;
    .confirm,
    .cancel {
        display: inline-block;
        width: 3.56rem;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.28rem;
        border-radius: 0.12rem;
        cursor: pointer;
    }
    .confirm {
        color: #fff;
    }
    .cancel {
        color: #333;
    }
}
</style>

<style lang="scss">
.msg_box__content {
    height: calc(100% - 0.8rem - 1.36rem);
    box-sizing: border-box;
    padding: 0rem 0.4rem;
    margin-bottom: 0.4rem;
    color: #939393;
    font-size: 0.28rem;
    > p {
        margin-bottom: 0.14rem;
        line-height: 0.4rem;
        &:last-of-type {
            margin-bottom: 0;
        }
    }
}
</style>
<style lang="scss" scoped>
.msgbox-fade-enter-active {
    animation: msgbox-fade-in 0.3s;
}

.msgbox-fade-leave-active {
    animation: msgbox-fade-out 0.3s;
}

@keyframes msgbox-fade-in {
    0% {
        transform: translate3d(0, -20px, 0);
        opacity: 0;
    }
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

@keyframes msgbox-fade-out {
    0% {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
    100% {
        transform: translate3d(0, -20px, 0);
        opacity: 0;
    }
}
</style>