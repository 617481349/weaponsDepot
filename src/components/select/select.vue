<template>
    <div class="zm-select" :class="classList" @click="handleFocus">
        <input v-model="selectLabel" @click="handleMenuEnter" class="input__inner"
               readonly="value" type="text" :placeholder="placeholder">
        <span class="input__suffixx"><img src="~assets/img/@3/arrow_bottom.png" alt=""></span>
        <div class="select__options">
            <div class="mask" @click="classList.isUnfold = false"></div>
            <div class="container">
                <div class="head clearfix">
                    <div class="fl" @click="classList.isUnfold = false">取消</div>
                    <div class="fr" @click="handleSelect()">确定</div>
                </div>
                <zm-option ref="selectOption" v-if="options.length" :options="options"
                           :select="model" @change="handleSelect">
                </zm-option>
                <div class="notDataTips" v-else>
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ZmOption from './option.vue';
export default {
    components: {
        ZmOption
    },
    model: {
        prop: 'model',
        event: 'updata:model'
    },
    props: {
        placeholder: {
            type: [Number, String],
            default: () => {
                return '';
            }
        },
        options: {
            type: Array,
            default: () => {
                return [];
            }
        },
        model: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            classList: {
                isFocus: false,
                isUnfold: false
            },
            select: [],
            selectLabel: '',
        };
    },
    created() {
        document.addEventListener('click', this.handleBlur, true);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleBlur, true);
    },
    methods: {
        handleFocus() {
            this.classList.isFocus = true;
        },
        handleBlur(e) {
            try {
                const path = this.eventPath(e);
                // 兼容低版本安卓
                let lock = false;
                for (let i = 0, j = path.length; i < j; i++) {
                    if (path[i] === this.$el) {
                        lock = true;
                        break;
                    }
                }
                if (!lock) {
                    this.classList.isFocus = false;
                    this.classList.isUnfold = false;
                }
            } catch (error) {
                this.classList.isFocus = false;
                this.classList.isUnfold = false;
                console.log(error.toString(), 'select.vue:handleBlur');
            }

        },
        handleMenuEnter() {
            this.classList.isUnfold = !this.classList.isUnfold;
        },
        handleSelect(compositeIndex) {
            if (this.options.length) {
                if (!Array.isArray(compositeIndex)) {
                    compositeIndex = this.$refs.selectOption.compositeIndex;
                }
                this.formatingSelect(compositeIndex);
                this.selectLabel = this.getLabel();
            } else {
                this.classList.isUnfold = false;
            }
        },
        clearSelect() {
            this.$refs.selectOption.clearSelect();
        },
        formatingSelect(compositeIndex) {
            this.select = [];
            compositeIndex.forEach((selectIndex, itemIndex) => {
                if (itemIndex === 0) {
                    this.select.push(this.options[selectIndex]);
                } else {
                    const parentSelect = compositeIndex[itemIndex - 1];
                    this.select.push(this.options[parentSelect].children[selectIndex]);
                }
            });
            this.$emit('change', this.select);
            this.classList.isUnfold = false;
        },
        getLabel() {
            let label = '';
            this.select.forEach((v, sub, { length }) => {
                label += v.label;
                if (sub < length - 1) {
                    label += ' / ';
                }
            });
            return label;
        },
        getValue(inLabel = false) {
            const { length } = this.select;
            let _value = '';
            if (length === 1) {
                if (inLabel) {
                    _value = {
                        label: this.select.label,
                        value: this.select.value
                    };
                } else {
                    _value = this.select.value;
                }
            } else {
                _value = [];
                this.select.forEach((v) => {
                    const { value, label } = v;
                    if (inLabel) {
                        _value.push({ label, value });
                    } else {
                        _value.push(value);
                    }
                });
            }
            return _value;
        },
        eventPath(event) {
            let el = event.target;
            let path = event.path || (event.composedPath && event.composedPath());
            if (path) {
                return path;
            } else {
                path = [];
                while (el) {
                    path.push(el);
                    if (el.tagName === 'HTML') {
                        path.push(document);
                        path.push(window);
                        return path;
                    }
                    el = el.parentElement;
                }
            }

        },
    },
};
</script>

<style scoped lang="scss">
.zm-select {
    width: 100%;
    position: relative;

    .input__inner {
        width: 100%;
        height: 0.92rem;
        transition: border-color 0.2s;
    }
    .input__suffixx {
        width: 0.5rem;
        height: 100%;
        text-align: center;
        line-height: 0.98rem;
        position: absolute;
        right: 0.2rem;
        top: 0;
        img {
            width: 0.28rem;
            transition: transform 0.3s;
            transform: rotate(0deg);
        }
    }
    .select__options {
        width: 100%;
        height: 0;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100;
        .mask {
            width: 100%;
            height: 100%;
            background: #000;
            opacity: 0.2;
        }
        .container {
            width: 100%;
            height: 0;
            position: absolute;
            bottom: 0;
            transition: height 0.3s;
            .head {
                height: 1rem;
                line-height: 1rem;
                padding: 0 0.1rem;
                font-size: 0.34rem;
                color: #326be6;
                background: #fff;
                > div {
                    cursor: pointer;
                    user-select: none;
                    padding: 0 0.3rem;
                }
            }
            .notDataTips {
                height: 3.6rem;
                background-color: #f8f8f8;
                line-height: 3.6rem;
                text-align: center;
                font-size: 0.32rem;
                color: #5a5a5a;
            }
        }
    }
}

.zm-select.isFocus {
    .input__inner {
        border-color: #409eff;
    }
}

.zm-select.isUnfold {
    .input__suffixx img {
        transform: rotate(180deg);
    }

    .select__options {
        height: 100%;
        .container{
            height: 4.6rem;
        }
    }
}
</style>