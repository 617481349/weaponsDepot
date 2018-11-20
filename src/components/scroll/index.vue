<template>
    <div ref="scrollParent" class="scroll" :style="'height:'+height"
         @scroll="handleScroll" @touchend="onEnd">
        <div class="scrollChild">
            <!-- 下拉刷新提示DOM -->
            <div class="pulldownContent" :style="pullDownStyle">Refresh</div>
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
import animation from './Tween/animation.js';
export default {
    props: {
        height: {
            type: String,
            default: () => {
                return '100vh';
            }
        },
        maxScrollTop: {
            type: String,
            default: '2.69rem'
        },
        refreshScrollTop: {
            type: String,
            default: '0.9rem'
        }
    },
    data() {
        return {
            maxST: 0,
            refreshST: 0,
            showPullUpContent: false,
            // 距离scroll顶部距离
            distanceToScrollTop: 0,
            // 是否触摸已经结束
            touchEnd: false,
            // 触摸结束刷新条件
            touchEndRefresh: false,
            // 用于记录Scroll事件回调定时器ID,函数节流所需变量
            tId: 0,
            pullDownInfo: {}
        };
    },
    computed: {
        pullDownStyle() {
            return {
                height: this.maxST + 'px',
                paddingTop: this.maxST - this.refreshST + 'px'
            };
        },
    },
    created() {
        this.maxST = this.unitConversion(this.maxScrollTop);
        this.refreshST = this.unitConversion(this.refreshScrollTop);
    },
    mounted() {
        this.$refs.scrollParent.scrollTop = this.maxST;
    },
    methods: {
        handleScroll(event) {
            // console.log(`distanceScroll:${-(event.target.scrollTop - this.maxST)}`);
            this.Trigger();
        },
        // 触发器
        Trigger() {
            clearTimeout(this.tId);
            this.tId = setTimeout(() => {
                if (this.touchEnd) {
                    this.touchEnd = false;
                    /**
                     * 验证是否触发下拉逻辑
                     * maxST参数是下拉的最大值，同时也是下拉提示区的高度
                     * 所以(准)顶部的scrollTop的值就是下拉提示区的高度
                     * 只要scrollTop值比下拉提示区的高度小了，那就是超出了滚动内容区域了
                     * scrollTop比maxST少多少，就是超出的部分
                     * 需要触发回弹动画
                     * */
                    /**
                     * 触发回弹动画有1种特殊情况
                     * 就是scrollTop<=refreshScrollTop(触发下拉刷新逻辑的高度)的情况
                     */
                    // 判断上拉回弹条件是否成立
                    if (this.$refs.scrollParent.scrollTop < this.maxST) {
                        // 判断上拉刷新条件是否满足
                        if (
                            this.$refs.scrollParent.scrollTop <=
                                this.refreshScrollTop &&
                            this.touchEndRefresh
                        ) {
                            this.changeScroll(
                                this.$refs.scrollParent.scrollTop,
                                this.refreshScrollTop
                            );
                        } else {
                            this.changeScroll(
                                this.$refs.scrollParent.scrollTop,
                                this.maxST
                            );
                        }
                        this.touchEndRefresh = false;
                    }
                }
            }, 50);
        },
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
            this.touchEnd = true;
            if (this.$refs.scrollParent.scrollTop < this.maxST) {
                this.touchEndRefresh = true;
            }
            this.Trigger();
        },
        changeScroll(startScroll, endScroll) {
            console.log(endScroll - startScroll);
            let duration = 500;
            if (endScroll - startScroll < 120) {
                duration = 250;
            }
            animation(startScroll, endScroll, duration, 'Circ.easeOut', (value) => {
                this.$refs.scrollParent.scrollTop = value;
            });
        },
        unitConversion(target) {
            const r = parseFloat(document.querySelector('html').style.fontSize);
            if (target.indexOf('rem') > -1) {
                return parseFloat(target) * r;
            } else {
                return parseFloat(target);
            }
        },
    
    },
};
</script>

<style scoped lang="scss">
.scroll {
  overflow: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;
  .scrollChild {
    &.trs {
      transition: 0.5s all;
    }
    .pulldownContent {
      width: 100%;
      text-align: center;
      font-size: 0.32rem;
      box-sizing: border-box;
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
