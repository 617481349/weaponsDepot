/**
 * 战盟web ESLint 规则 - Vue
 *
 * 包含所有 ESLint 规则，以及所有 eslint-plugin-vue 规则
 * 使用 babel-eslint 和 vue-eslint-parser 作为解析器
 *
 * @fixable 表示此配置支持 --fix
 * @off 表示此配置被关闭了，并且后面说明了关闭的原因
 * @change 表示此配置没关闭但修改了，并且后面说明了原因
 */

module.exports = {
    // 以当前目录为根目录，不再向上查找 .eslintrc.js
    root: true,

    extends: [
        'plugin:vue/recommended',
        // 'plugin:import/errors',
        './.eslintrc.base.js'
    ],

    settings: {
        'import/resolver': {
            // 设置webpack配置文件，使eslint能识别webpack里的配置（主要是识别alias）
            'webpack': {
                config: './node_modules/@vue/cli-service/webpack.config.js'
            }
        }
    },

    globals: {
        // 这里填入项目需要的全局变量
        // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
        //
        // jQuery: false,
        // $: false
    },

    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true
    },

    parserOptions: {
        // 设置 js 的解析器为 babel-eslint
        // https://github.com/mysticatea/vue-eslint-parser#-options
        parser: 'babel-eslint',
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            // @TODO Deprecated https://eslint.org/docs/user-guide/configuring#deprecated
            experimentalObjectRestSpread: true,
            jsx: false,
            modules: true
        }
    },

    rules: {
        // 基础
        // plugin:vue/base
        // 定义了的 jsx element 必须使用
        'vue/jsx-uses-vars': 'error',
        // 必须 避免可能的错误
        // plugin:vue/essential
        //
        // 计算属性禁止包含异步方法
        'vue/no-async-in-computed-properties': 'error',
        // 禁止重复的二级键名
        'vue/no-dupe-keys': 'error',
        // 禁止出现重复的属性
        'vue/no-duplicate-attributes': 'error',
        // 禁止出现语法错误
        'vue/no-parsing-error': 'error',
        // 禁止覆盖保留字
        'vue/no-reserved-keys': 'off',
        // @fixable 组件的 data 属性的值必须是一个函数
        'vue/no-shared-component-data': 'error',
        // 禁止在计算属性中对属性修改
        'vue/no-side-effects-in-computed-properties': 'error',
        // 禁止 <template> 使用 key 属性
        // @off 太严格了
        'vue/no-template-key': 'off',
        // 禁止在 <textarea> 中出现 {{message}}
        'vue/no-textarea-mustache': 'error',
        // 禁止注册未使用过的组件
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'vue/no-unused-components': 'error',
        // 禁止模板中出现未使用的变量
        // 如 v-for 中的(item, index)
        'vue/no-unused-vars': 'error',
        // 禁止 v-if 和 v-for 指令在同个元素上使用
        'vue/no-use-v-if-with-v-for': 'error',
        // <component> 必须有 v-bind:is
        'vue/require-component-is': 'error',
        // @fixable prop 必须是一个构造器
        // 简单来说要用 Number 而不是字符串 'Number' 来申明 prop 的类型
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'vue/require-prop-type-constructor': 'error',
        // render 函数必须有返回值
        'vue/require-render-return': 'error',
        // v-for 指令的元素必须有 v-bind:key
        'vue/require-v-for-key': 'error',
        // prop 的默认值必须匹配它的类型
        'vue/require-valid-default-prop': 'error',
        // 计算属性必须有返回值
        'vue/return-in-computed-property': 'error',
        // template 的根节点必须合法
        'vue/valid-template-root': 'error',
        // v-bind 指令必须合法
        'vue/valid-v-bind': 'error',
        // v-cloak 指令必须合法
        'vue/valid-v-cloak': 'error',
        // v-else-if 指令必须合法
        'vue/valid-v-else-if': 'error',
        // v-else 指令必须合法
        'vue/valid-v-else': 'error',
        // v-for 指令必须合法
        'vue/valid-v-for': 'error',
        // v-html 指令必须合法
        'vue/valid-v-html': 'error',
        // v-if 指令必须合法
        'vue/valid-v-if': 'error',
        // v-model 指令必须合法
        'vue/valid-v-model': 'error',
        // v-on 指令必须合法
        'vue/valid-v-on': 'error',
        // v-once 指令必须合法
        'vue/valid-v-once': 'error',
        // v-pre 指令必须合法
        'vue/valid-v-pre': 'error',
        // v-show 指令必须合法
        'vue/valid-v-show': 'error',
        // v-text 指令必须合法
        'vue/valid-v-text': 'error',


        //
        //
        // 强烈推荐 提高可读性
        // plugin:vue/strongly-recommended
        //
        // @fixable 限制自定义组件的属性风格
        // 默认为 hyphenated name 如 my-prop
        'vue/attribute-hyphenation': 'error',
        // @fixable 限制关闭标签是否要另起一行
        // @off 太严格
        'vue/html-closing-bracket-newline': 'off',
        // @fixable html 的结束标签前的空格必须符合规定
        'vue/html-closing-bracket-spacing': 'error',
        // @fixable html 的结束标签必须符合规定
        'vue/html-end-tags': 'error',
        // @fixable html 的indent数量必须符合规定
        // @change 从默认的2个改为4个，符合一般需求
        'vue/html-indent': ['error', 4],
        // @fixable 没有内容时，组件必须自闭和
        // @off 没必要限制
        'vue/html-self-closing': 'off',
        // 限制每行允许的最多属性数量
        // @change 从默认的1个改为3个，增加可读性
        'vue/max-attributes-per-line': [
            'error', {
                'singleline': 3,
                'multiline': {
                    'max': 4,
                    'allowFirstLine': true
                }
            }
        ],
        // @fixable 统一 {{}} 中空格风格，{{ type }} 为正确的
        'vue/mustache-interpolation-spacing': 'error',
        // @fixable 限制组件的 name 属性的值的风格
        'vue/name-property-casing': 'error',
        // @fixable 禁止出现连续空格
        'vue/no-multi-spaces': 'error',
        // 禁止内部定义的参数名字与外部定义的参数名字相同
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'vue/no-template-shadow': 'error',
        // @fixable prop 属性的格式必须符合要求
        // 正确：myProp: true      错误: 'my-prop': true
        'vue/prop-name-casing': 'error',
        // 必须指定 prop 的默认值（除非required为true或者类型为Boolean）
        'vue/require-default-prop': 'error',
        // prop 必须有类型限制
        'vue/require-prop-types': 'error',
        // @fixable 限制 v-bind 的风格，默认简写
        'vue/v-bind-style': 'error',
        // @fixable 限制 v-style 的风格，默认简写
        'vue/v-on-style': 'error',


        //
        //
        // 推荐 最小化任意选择和认知开销
        // plugin:vue/recommended
        //
        // @fixable 限制元素属性的顺序
        // @off 太严格了
        'vue/attributes-order': 'off',
        // @fixable 标签属性的引号类型必须符合要求，默认双引号
        'vue/html-quotes': 'error',
        // 禁止使用 v-html 以防止 XSS 共计
        // @off 太严格了
        'vue/no-v-html': 'error',
        // @fixable 组件的属性必须为一定的顺序
        'vue/order-in-components': [
            'error', {
                'order': [
                    'el',
                    'name',
                    'parent',
                    'functional',
                    ['delimiters', 'comments'],
                    ['components', 'directives', 'filters'],
                    'extends',
                    'mixins',
                    'inheritAttrs',
                    'model',
                    ['props', 'propsData'],
                    'data',
                    'computed',
                    'watch',
                    'LIFECYCLE_HOOKS',
                    'methods',
                    ['template', 'render'],
                    'renderError'
                ]
            }
        ],
        // 禁止在模板中的表达式中出现 this
        'vue/this-in-template': 'error',


        //
        //
        // 未分类的
        //
        // @fixable 模板中组件的标签名格式必须符合规定
        // @change 统一 html 中标签风格
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        // @fixable 标签内的多行文本前后都要有换行
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'vue/multiline-html-element-content-newline': 'error',
        // @fixable 禁止标签属性等号两边的空格
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'vue/no-spaces-around-equal-signs-in-attribute': 'error',
        // @fixable 统一 script 标签下的缩进
        // TODO eslint-plugin-vue ^5.0 版本才支持该选项
        // 'script-indent': [
        //     'error', 4, {
        //         'baseIndent': 0,
        //         'switchCase': 0,
        //         'ignores': []
        //     }
        // ],
        // @fixable 标签内的单行文本前后都要有换行
        // @off 太严格了
        'vue/singleline-html-element-content-newline': 'off'
    }
};
