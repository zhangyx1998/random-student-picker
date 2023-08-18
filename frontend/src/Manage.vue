<script setup>
import { ref, watch, onMounted } from 'vue';
import { alert } from '@win';
import StudentEntry from './components/student/ListEntry.vue';
import StudentName from './components/student/Name.vue';
import { getStudentList } from '@/src/api';

const list = ref([]);

async function updateStudentList() {
    const res = await getStudentList();
    if (res instanceof Error) {
        alert.title('Error')(res);
    } else {
        list.value = Object.entries(res);
    }
}

onMounted(updateStudentList);

function view(sid) {
    alert(`Viewing ${sid}`);
}
</script>

<template>
    <container
        class="entries"
        w1280
        flex-row
        flex-wrap
    >
        <template
            v-for="[sid, { name, stat }] in list"
            :key="sid"
        >
            <student-entry
                :stat="stat"
                @click="view(sid)"
            >
                <student-name :name="name" />
            </student-entry>
        </template>
        <template
            v-for="i of [1, 2, 3, 4, 5]"
            :key="i"
        >
            <student-entry style="opacity: 0; pointer-events: none;" />
        </template>
    </container>
</template>

<style scoped lang="scss">
.entries {
    // Vertically top align
    align-items: flex-start;
    // Horizontally left align
    justify-content: center;
}
</style>
