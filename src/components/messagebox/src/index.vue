<template>
    <div class="message_box_wrapper" v-show="visible">
        <div class="message_box_mask"></div>
        <div class="message_box_main">
            <div class="msg_box__title">{{ title }}</div>
            <div class="msg_box__content">{{ message }}</div>
            <div class="msg_box__control clearfix">
                <div class="comfirm fl">确定</div>
                <div class="cancel fr">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '',
            message: '',
            visible: false
        };
    },
    created() {
        console.log(this);
    }
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
.msg_box__title {
  line-height: 0.8rem;
  padding-left: 0.3rem;
  height: 0.8rem;
  font-size: 0.36rem;
  color: #666;
}
.msg_box__content {
  height: calc(100% - 0.8rem - 1.36rem);
  box-sizing: border-box;
  padding: 0.3rem 0.5rem;
  color: #606266;
  font-size: 0.3rem;
}

.msg_box__control {
  padding: 0.3rem;
  height: 1.36rem;
  box-sizing: border-box;
  .comfirm,
  .cancel {
    font-size: 0.28rem;
    padding: 0 0.25rem;
    border-radius: 0.1rem;
    cursor: pointer;
    height: 0.72rem;
    line-height: 0.72rem;
  }
  .comfirm {
    background: #2c8aea;
    color: #fff;
    border: 0.02rem solid #4698de;
  }
  .cancel {
    background: #e0e0e0;
    border: 0.02rem solid #cccccc;
    color: #6b6b6b;
  }
}

.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix {
  overflow: hidden;
  zoom: 1;
}
</style>