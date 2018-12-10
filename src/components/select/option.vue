<template>
    <div class="optionContainer">
        <div class="content">
            <div class="content-item" :style="{'width':(100/compositeIndex.length)-1+'%'}" :ref="`contentItem-${itemIndex}`"
                 v-picker="{get,set,itemIndex}" v-for="(selectIndex,itemIndex) in compositeIndex" :key="itemIndex">
                <div class="option-item">
                    <div class="item" :class="{ active : selectIndex === index }" v-for="(val,index) in getOptionItem(itemIndex,selectIndex)"
                         :key="val.value">
                        {{ val.label }}
                    </div>
                </div>
            </div>
        </div>
        <div class="line"></div>
    </div>
</template>

<script>
export default {
    directives: {
        picker: {
            bind(el, binding, vm) {
                const _value = binding.value;
                const { set, get, itemIndex } = _value;
                let startY = '';
                let differY = '';
                let dom = el.children[0];
                let len = dom.children.length;
                let maxY = -(len - 1);
                let r = Number.parseFloat(document.documentElement.style.fontSize);
                // /* 初始idnex和初始位移先从props的initial取，没有则全为0 */
                let index = get(itemIndex);
                let currentY = -index;
                el.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (dom.style.transform === 'translateY(0px)') {
                        currentY = 0;
                        maxY = -(dom.children.length - 1);
                    }
                    let ev = e.touches[0];
                    startY = ev.clientY;
                });

                el.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    let ev = e.touches[0];
                    differY = ev.clientY - startY;
                    dom.style.transition = 'transform 0s';
                    dom.style.transform = `translateY(${currentY * r + differY}px)`;
                });

                el.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    let ev = e.changedTouches[0];
                    differY = ev.clientY - startY;
                    dom.style.transition = 'transform .3s';
                    if (differY <= -r / 2) {
                        currentY += Math.floor(differY / r);
                        if (currentY <= maxY)currentY = maxY;
                    }
                    else if (differY >= r / 2) {
                        currentY += Math.floor(differY / r);
                        if (currentY >= 0)currentY = 0;
                    }
                    dom.style.transform = `translateY(${currentY}rem)`;
                    /* 记录当前位移在数组中的索引,必须取整，否则会出现浮点数 */
                    index = Math.floor(Math.abs(currentY / 1));
                    set(itemIndex, index);
                });
            }
        }
    },
    props: {
        options: {
            type: Array,
            default: () => {
                return [];
            }
        },
        select: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            compositeIndex: []
        };
    },
    watch: {
        select(newValue, oldValue) {
            this.setSelect();
        }
    },
    mounted() {
        this.compositeIndex = this.isChildren();
        this.setSelect();
        const lock = this.compositeIndex.length;
        if (lock) {
            this.$nextTick(() => {
                this.setPosition();
            });
        }
    },
    methods: {
        // 初始options级数，所有级默认为第一个
        isChildren(options = this.options) {
            let childrenIndex = [];
            if (Array.isArray(options) && options.length) {
                childrenIndex.push(0);
                const { children } = options[0];
                if (children) {
                    const c = this.isChildren(children);
                    childrenIndex = childrenIndex.concat(c);
                }
            }
            return childrenIndex;
        },
        // 获取每个级联的数组
        getOptionItem(itemIndex, selectIndex) {
            let data = this.options;
            if (itemIndex !== 0) {
                this.compositeIndex.slice(1, itemIndex + 1).forEach((v, sub, arr) => {
                    const parentSelect = this.compositeIndex[sub];
                    data = data[parentSelect].children;
                });
            }
            return data;
        },
        // 主动设置级联索引
        setSelect(_options = this.options) {
            if (this.select.length) {
                const _index = [];
                let options = _options;
                let lock = true;
                this.select.forEach((value, sub) => {
                    if (lock) {
                        lock = false;
                        if (sub !== 0) {
                            options = options[sub - 1].children;
                        }
                        for (let i = 0, j = options.length; i < j; i++) {
                            if (options[i].value === value) {
                                _index.push(i);
                                lock = true;
                                break;
                            }
                        }
                    }
                });
                // 需重新赋值触发视图更新
                this.compositeIndex = Object.assign([], this.compositeIndex, _index);
                this.$emit('change', this.compositeIndex);
                this.$nextTick(() => {
                    this.setPosition();
                });
            }
        },
        clearSelect() {
            this.compositeIndex = this.compositeIndex.map(() => {
                return 0;
            });
            this.$emit('change', []);
            this.$nextTick(() => {
                this.setPosition();
            });
        },
        setPosition() {
            this.compositeIndex.forEach((v, sub) => {
                const dom = this.$refs[`contentItem-${sub}`][0].children[0];
                const r = Number.parseFloat(document.documentElement.style.fontSize);
                const currentY = -v * r;
                dom.style.transform = `translateY(${currentY}px)`;
            });
        },
        set(index, value) {
            this.$set(this.compositeIndex, index, value);
        },
        get(index) {
            return this.compositeIndex[index];
        }
    },
};
</script>

<style scoped lang="scss">
.optionContainer {
    position: relative;
    height: calc(100% - 1rem);
    background-color: #f8f8f8;
}
.content {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    .content-item {
        height: 100%;
        display: inline-block;
        overflow: hidden;
        .option-item {
            width: 100%;
            margin-top: -0.5rem;
            position: relative;
            top: 50%;
            z-index: 10;
            .item {
                width: 100%;
                height: 1rem;
                line-height: 1rem;
                font-size: 0.3rem;
                color: #707274;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
                &.active {
                    color: #000;
                    font-weight: bold;
                }
            }
        }
    }
}
.line {
    width: 100%;
    height: 1rem;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -0.5rem;
    border-top: 0.025rem solid #ddd;
    border-bottom: 0.025rem solid #ddd;
}
</style>