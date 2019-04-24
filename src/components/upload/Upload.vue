<template>
    <div class="zm-upload">
        <!-- 单文件上传提供的slot -->
        <template v-if="multiple === false">
            <div class="del" v-if="fileList[0] && fileList[0].url" @click="delFile(0)">
                <slot name="del"></slot>
            </div>
            <template v-if="fileList[0] && fileList[0].url">
                <slot name="preview" :url="fileList[0].url"></slot>
            </template>
            <div @click="handleClickInput">
                <slot></slot>
            </div>
        </template>
        <input class="uploadDom" ref="uploadDom" type="file"
               :accept="accept" @change="addFile()" :multiple="multiple">
    </div>
</template>

<script>
import { deviceInfo } from 'utils/device';
import { setupWebViewJavascriptBridge } from 'utils/client';
export default {
    name: 'ZmUpload',
    props: {
        // 文件上传路径
        action: {
            type: String,
            default: '/common/upload_img'
        },
        // 是否自动上传
        autoUpload: {
            type: Boolean,
            default: false
        },
        // 初始数据
        fileData: {
            type: [Object, Array],
            default: () => {
                return [];
            }
        },
        // 文件选择类型
        accept: {
            type: String,
            default: 'image/*'
        },
        // 是否支持多文件选择
        multiple: {
            type: [String, Boolean],
            default: false
        },
        maxSelect: {
            type: [String, Number],
            default: 6
        },
        // 文件改变时的钩子
        onChange: {
            type: Function,
            default: () => {}
        },
        // 上传文件之前的钩子
        beforeUpload: {
            type: Function,
            default: () => {}
        },
        // 上传成功的钩子
        uploadSuccess: {
            type: Function,
            default: () => {
                return () => {};
            }
        }
    },
    data() {
        return {
            fileList: [],
            Dom: ''
        };
    },
    created() {
        let fileData = this.fileData;
        if (typeof fileData === 'object') {

            if (!Array.isArray(fileData)) {
                fileData = [fileData];
            }

            fileData.forEach(v => {
                if (v.file) {
                    this.fileList.push(v);
                }
            });
        }

    },
    mounted() {
        this.Dom = this.$refs.uploadDom;
    },
    methods: {
        handleClickInput() {
            if (deviceInfo.isZMAPP) {
                setupWebViewJavascriptBridge((bridge) => {
                    bridge.callHandler('w2cAddPhotos', { maxSelectNum: this.multiple ? 1 : this.maxSelect }, (data) => {
                        console.log(data);
                        let images;
                        if (typeof list === 'string') {
                            images = JSON.parse(data).images;
                        } else {
                            images = data.images;
                        }
                        if (typeof images === 'string') {
                            images = images.replace(/\[/, '["');
                            images = images.replace(/\]/, '"]');
                            images = images.replace(/,.data:/, '","data:');
                            images = JSON.parse(images);
                        }
                        const fileList = [];
                        images.forEach((base64) => {
                            fileList.push(this.transformBase64File(base64));
                        });
                        this.addFile(fileList);
                    });
                });
            } else {
                this.Dom.click();
            }
        },
        addFile(fileList) {
            let imgFileList;
            const uploadDom = this.$refs.uploadDom;
            if (Array.isArray(fileList)) {
                imgFileList = fileList;
            } else {
                imgFileList = uploadDom.files;
            }
            this.fileList = [];
            Object.keys(imgFileList).forEach((key) => {
                const file = imgFileList[key];
                if (typeof file === 'object') { // 低版本安卓测试会遍历length对象，导致报错
                    let lock = this.beforeUpload(file);
                    if (lock !== false) {
                        const url = this.getObjectURL(file);
                        const data = {
                            url: decodeURIComponent(url),
                            file
                        };
                        this.fileList.push(data);
                    }
                }
            });
            uploadDom.value = '';
            if (this.fileList.length) {
                this.onChange(this.fileList);
                if (this.autoUpload) {
                    this.upload();
                }
            }
        },
        delFile(sub) {
            this.fileList.splice(sub, 1);
            this.onChange(this.fileList);
        },
        clear() {
            this.fileList = [];
            this.onChange(this.fileList);
        },
        getObjectURL(file) {
            let url = null;
            if (file.dataURI) {
                url = file.dataURI;
            } else if (typeof window.createObjectURL !== 'undefined') {
                url = window.createObjectURL(file);
            } else if (typeof window.URL !== 'undefined') {
                try {
                    url = window.URL.createObjectURL(file);
                } catch (error) {
                    console.log(error.toString());
                }
            } else if (typeof window.webkitURL !== 'undefined') {
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        upload() {
            let allRequert = [];
            this.fileList.forEach((v, sub) => {
                const formData = new FormData();
                if (v.file.blob) {
                    formData.append('imageFile', v.file.blob, 'image.png.jpeg.jpg');
                } else {
                    formData.append('imageFile', v.file);
                }
                this.$loading.open('图片上传中...');
                let request = this.$axios.post(this.action, formData, {
                    onUploadProgress: this.onUploadProgress
                }).then((res) => {
                    this.$loading.close();
                    this.uploadSuccess(res, this.fileList[sub]);
                    return { res, file: this.fileList[sub].file };
                }).catch((res) => {
                    this.$loading.close();
                    this.$alert('错误', res.data.message).then(() => {});
                });
                allRequert.push(request);
            });
            return Promise.all(allRequert).then(posts => {
                return posts;
            });

        },
        onUploadProgress(e) {
            // let complete = (e.loaded / e.total * 100 | 0) + '%';
        },
        transformBase64File(base64) {
            let file = {};
            const data = base64.split(',');
            file.type = /data:(.+);/.exec(data[0])[1];
            let byteString = atob(data[1]);
            let ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ia], { type: file.type });
            file.blob = blob;
            file.size = blob.size;
            file.dataURI = base64;
            return file;
        },
        dataURItoBlob(base64Data) {
            let byteString;
            if (base64Data.split(',')[0].indexOf('base64') >= 0) { byteString = atob(base64Data.split(',')[1]) }
            else { byteString = unescape(base64Data.split(',')[1]) }
            let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
            let ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], { type: mimeString });
        },
    },
};
</script>

<style scoped lang="scss">
.zm-upload {
    > div {
        display: inline;
    }
}
.uploadDom {
    display: none;
}
</style>