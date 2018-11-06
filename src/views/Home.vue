<template>
    <div class="home">
        <messageBox></messageBox>
    </div>
</template>

<script>
import messageBox from '../components/messagebox/messagebox.vue';

export default {
    name: 'Home',
    components: {
        messageBox
    },
};
</script>
