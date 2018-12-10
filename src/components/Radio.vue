<template>
    <label class="zm-radio" :class="{isCheck:checked}">
        <span class="input__radio">
            <input type="checkbox" class="radio__original" v-model="checked"
                   @change="handleChange">
            <span v-if="checked" class="radio__inner" :style="{'border-color':fill}"></span>
            <span v-else class="radio__inner"></span>
        </span>
        <span class="input__label">
            <slot></slot>
        </span>
    </label>
</template>

<script>
export default {
    model: {
        prop: 'model',
        event: 'change:model'
    },
    props: {
        label: {
            type: [String, Boolean, Number],
            default: () => {
                return true;
            }
        },
        model: {
            type: [String, Boolean, Number],
            default: () => {
                return true;
            }
        },
        fill: {
            type: String,
            default: () => {
                return '#326be6';
            }
        }
    },
    data() {
        return {
            checked: false
        };
    },
    watch: {
        model(newValue, oldValue) {
            this.checked = (newValue === this.label);
        }
    },
    created() {
        this.checked = (this.model === this.label);
    },
    methods: {
        handleChange(e) {
            if (this.checked) {
                this.$emit('change:model', this.label);
            } else {
                this.$emit('change:model', '');
            }
            this.$emit('change', this.checked);
        }
    },
};
</script>

<style scoped lang="scss">
.zm-radio {
    color: #606266;
    font-weight: 500;
    font-size: 0.28rem;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    user-select: none;
    .input__radio {
        .radio__original {
            opacity: 0;
            outline: none;
            position: absolute;
            z-index: -1;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 0;
        }
        .radio__inner {
            border: 0.025rem solid #dcdfe6;
            border-radius: 100%;
            width: 0.3rem;
            height: 0.3rem;
            background-color: #fff;
            position: relative;
            cursor: pointer;
            display: inline-block;
            box-sizing: border-box;
            vertical-align: top;
            transition: border-width 0.15s ease-in;
        }
    }
    .input__label {
        padding-left: 0.16rem;
    }
}
.zm-radio.isCheck {
    .input__radio {
        .radio__inner {
            border-width: 0.09rem;
        }
    }
}
</style>