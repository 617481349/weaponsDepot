<template>
    <div ref="scrollParent" class="scroll" :style="'height:'+height" @scroll="onScroll" @touchend="onEnd">
        <div class="scrollChild">
            <!-- 下拉刷新提示DOM -->
            <div class="pulldownContent" :style="pullDownStyle">下拉刷新</div>
            <!-- 滚动组件内容插槽 -->
            <div ref="scrollContent">
                <slot></slot>
            </div>
            <!-- 上拉加载提示DOM -->
            <div v-if="showPullUpContent" class="pullupContent">上拉加载</div>
        </div>
    </div>
</template>
<script>
    // requestAnimationFrame兼容逻辑
    let lastTime = 0
    const vendors = ['ms', 'moz', 'webkit', 'o']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            const currTime = new Date().getTime()
            const timeToCall = Math.max(0, 16 - (currTime - lastTime))
            const id = window.setTimeout(function() {
                callback(currTime + timeToCall)
            }, timeToCall)
            lastTime = currTime + timeToCall
            return id
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id)
        }
    }
</script>

<script>
export default {
    data() {
        return {
            showPullUpContent: false,
            // 距离scroll顶部距离
            distanceToScrollTop: 0,
            // 滚动条位置
            scrollY: 0,
            // 下拉拖动translateY最大值
            maxTranslateY: 300,
            // 是否触摸已经结束
            touchEnd: false,
            // 触摸结束刷新条件
            touchEndRefresh: false,
            // 用于记录Scroll事件回调定时器ID,函数节流所需变量
            tId: 0,
            pullDownStyle: {
                height: this.maxScrollTop + 'px',
                paddingTop: this.refreshScrollTop + 'px'
            },
            pullDownInfo: {}
        }
    },
    props: ['height', 'maxScrollTop', 'refreshScrollTop'],
    methods: {
        /**
         * 函数节流：
         * 由于滚动监听事件回调触发会非常频繁，很耗性能，且需要节流来判断滚动是否已经结束，所以这里添加了函数节流
         * 每次滚动都会清除定时器(tId),只有停止滚动了(经验值为50毫秒)定时器的代码才会执行
         * 拖动有2种情况
         * 1：惯性拖动，这种拖动在滚动结束前触摸已经结束
         * 2：触摸拖动，这种拖动只有在触摸结束时才算滚动结束
         * 总结以上2种拖动都有个共同点，就是滚动结束时触摸都是结束状态
         */
        onEnd() {
            this.touchEnd = true
            if (this.$refs.scrollParent.scrollTop < this.maxScrollTop) {
                this.touchEndRefresh = true
            }
            this.Trigger()
        },
        onScroll(event) {
            this.Trigger()
        },
        // 触发器
        Trigger() {
            clearTimeout(this.tId)
            this.tId = setTimeout(() => {
                if (this.touchEnd) {
                    this.touchEnd = false
                    /**
                     * 验证是否触发下拉逻辑
                     * maxScrollTop参数是下拉的最大值，同时也是下拉提示区的高度
                     * 所以(准)顶部的scrollTop的值就是下拉提示区的高度
                     * 只要scrollTop值比下拉提示区的高度小了，那就是超出了滚动内容区域了
                     * scrollTop比maxScrollTop少多少，就是超出的部分
                     * 需要触发回弹动画
                     * */
                    /**
                     * 触发回弹动画有1种特殊情况
                     * 就是scrollTop<=refreshScrollTop(触发下拉刷新逻辑的高度)的情况
                     */
                    // 判断上拉回弹条件是否成立
                    if (this.$refs.scrollParent.scrollTop < this.maxScrollTop) {
                        // 判断上拉刷新条件是否满足
                        if (
                            this.$refs.scrollParent.scrollTop <=
                                this.refreshScrollTop &&
                            this.touchEndRefresh
                        ) {
                            this.changeScroll(
                                this.$refs.scrollParent.scrollTop,
                                this.refreshScrollTop
                            )
                        } else {
                            this.changeScroll(
                                this.$refs.scrollParent.scrollTop,
                                this.maxScrollTop
                            )
                        }
                        this.touchEndRefresh = false
                    }
                }
            }, 50)
        },
        changeScroll(startScroll, endScroll) {
            let beforeScrollTop = startScroll
            const scrollAnimation = () => {
                let nowScrollTop = this.$refs.scrollParent.scrollTop
                if (beforeScrollTop == nowScrollTop) {
                    nowScrollTop += 20
                    if (nowScrollTop > endScroll) {
                        nowScrollTop = endScroll
                    }
                    beforeScrollTop = this.$refs.scrollParent.scrollTop = nowScrollTop
                    if (this.$refs.scrollParent.scrollTop < endScroll) {
                        requestAnimationFrame(scrollAnimation)
                    }
                }
            }
            scrollAnimation()
        }
    },
    created() {},
    mounted() {
        this.$refs.scrollParent.scrollTop = 300
    }
}
</script>

<style scoped lang="scss">
.scroll {
  overflow: scroll;
  position: relative;
  .scrollChild {
    &.trs {
      transition: 0.5s all;
    }
    .pulldownContent {
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      font-size: 32px;
    }
    .pullupContent {
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    }
  }
}
</style>
