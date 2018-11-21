<template>
    <div ref="scrollParent" class="scroll" :style="'height:'+height"
         @scroll="handleScroll" @touchstart="touchStart = true" @touchend="onEnd">
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
            refreshST_MAP: 0,
            showPullUpContent: false,
            // 距离scroll顶部距离
            distanceToScrollTop: 0,
            touchEnd: false,
            touchStart: false,
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
                paddingTop: this.refreshST + 'px'
            };
        },
    },
    created() {
        this.maxST = this.unitConversion(this.maxScrollTop);
        this.refreshST_MAP = this.unitConversion(this.refreshScrollTop);
        this.refreshST = this.maxST - this.refreshST_MAP;
    },
    mounted() {
        this.$refs.scrollParent.scrollTop = this.maxST;
    },
    methods: {
        handleScroll(event) {
            const ST = event.target.scrollTop;
            const ST_MAP = -(ST - this.maxST);
            console.log(ST_MAP);
            this.Trigger();
        },
        // 触发器
        Trigger() {
            if (this.touchEnd) {
                clearTimeout(this.tId);
                this.tId = setTimeout(() => {
                    this.touchEnd = false;
                    const ST = this.$refs.scrollParent.scrollTop;
                    const ST_MAP = -(ST - this.maxST);
                    console.log(ST_MAP, this.refreshST_MAP, 'Trigger');
                    if (ST_MAP > 0) {
                        if (ST_MAP >= this.refreshST_MAP) {
                            this.changeScroll(ST, this.refreshST);
                        } else {
                            this.changeScroll(ST, this.maxST);
                        }
                    }
                }, 60);
            }
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
            const ST = this.$refs.scrollParent.scrollTop;
            const ST_MAP = -(ST - this.maxST);
            console.log(ST_MAP, 'onEnd');
            this.touchEnd = true;
            this.touchStart = false;
            this.Trigger();
        },
        changeScroll(startScroll, endScroll) {
            let duration = 500;
            if (endScroll - startScroll < 120) {
                duration = 250;
            }
            const getId = animation(startScroll, endScroll, duration, 'Circ.easeOut', (value) => {
                if (this.touchStart) {
                    try { window.cancelAnimationFrame(getId()) } catch (error) {}
                }
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
