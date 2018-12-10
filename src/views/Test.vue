<template>
    <div>
        <input type="file" @change="addFile">
        <!-- <video style="width:100%" controls v-if="video"
               :src="video"></video> -->
    </div>
</template>

<script>
import v from 'assets/img/sw3syts.mp4';
export default {
    data() {
        return {
            video: 'media/sw3syts.mp4'
        };
    },
    created() {
        this.fetchAB(v);
    },
    methods: {
        addFile(e) {
            const file = e.target.files[0];
            const fr = new FileReader();
            fr.onload = function() {
                window.localStorage.video = this.result;
            };
            // fr.readAsArrayBuffer(file);
            // fr.readAsBinaryString(file);
            fr.readAsDataURL(file);
        },
        fetchAB(url, cb) {
            let xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                const buffer = xhr.response;
                const bytes = new Uint8Array(buffer);
                let binary = '';
                for (let len = bytes.byteLength, i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                console.log(btoa(binary));
            };
            xhr.send();
        }
    },
};
</script>

<style scoped>
</style>