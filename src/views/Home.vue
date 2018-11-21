<template>
    <div class="home">
        <lee-scroll height="80vh" maxScrollTop="3rem" refreshScrollTop="1rem">
            <p class="item" v-for="(item,index) in new Array(100)" :key="index">{{ index }}</p>
        </lee-scroll>
    </div>
</template>

<script>
import leeScroll from 'components/scroll';
export default {
    name: 'Home',
    components: {
        leeScroll
    }
};
</script>
<style lang="scss" scoped>
.home{
    padding-top:1rem;
}
.item{
    font-size: 0.36rem;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 0.025rem solid #dadada;
}
</style>

