<script setup>
import { ref, computed, onMounted } from 'vue';
import { alert } from '@win';
import StudentEntry from './student/ListEntry.vue';
import StudentName from './student/Name.vue';
import { getStudentList } from '@/api/student';

const
    list = ref([]),
    summary = computed(() => {
        const [count, credit] = list.value
            .reduce(([count, credit], [, { stat }]) => [
                count + (stat[0] ?? 0),
                credit + (stat[1] ?? 0)
            ], [0, 0]);
        return { count, credit };
    });

async function updateStudentList() {
    const res = await getStudentList();
    if (res instanceof Error) {
        alert.title('Error')(res);
    } else {
        list.value = Object.entries(res);
    }
}

onMounted(updateStudentList);
</script>

<template>
    <container
        w1280
        flex-row
        flex-space-between
        content-center
        class="header absolute"
        style="
            background-color: var(--cf-gray-light);
            box-shadow: 0 0 5px var(--c-box-shadow);
        "
    >
        <span
            monospace
            style="user-select: none; color: var(--ct-gray);"
        >
            Total
            <span style="font-weight: bold; user-select: all;">{{
                list.length
            }}</span> students,
            <span style="font-weight: bold; user-select: all;">{{
                summary.count
            }}</span> records,
            <span style="font-weight: bold; user-select: all;">{{
                summary.credit
            }}</span> credits
        </span>
        <container
            flex-row
            :pad="false"
        >
            <btn
                type="seamless brand"
                @click="alert.title('Batch Upload Student List')('Feature not implemented')"
            >
                <i
                    class="fa fa-upload"
                    style="margin-right: 0.5em;"
                ></i>
                UPLOAD
            </btn>
            <btn
                type="seamless brand"
                @click="alert.title('Export student list')('Feature not implemented')"
            >
                <i
                    class="fa fa-file-export"
                    style="margin-right: 0.5em;"
                ></i>
                EXPORT
            </btn>
        </container>
    </container>
    <container
        class="entries"
        w1280
        flex-row
        flex-wrap
    >
        <div class="header"></div>
        <template
            v-for="[sid, { name, stat }] in list"
            :key="sid"
        >
            <student-entry
                :stat="stat"
                :sid="sid"
                @updated="updateStudentList"
            >
                <student-name :name="name" />
            </student-entry>
        </template>

        <student-entry
            @click="alert.title('Add a student')('Feature not implemented')"
        >
            <span style="opacity: 0.6">
                <i
                    class="fa fa-plus"
                    style="margin-right: 0.5em;"
                ></i>
                Add a student ...
            </span>
        </student-entry>
        <template
            v-for="i in Array(5)"
            :key="i"
        >
            <student-entry style="opacity: 0; pointer-events: none;" />
        </template>
    </container>
</template>

<style scoped lang="scss">
.header {
    height: 3em;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    width: 100%;
    &.absolute {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
    }
}
.entries {
    z-index: 0;
    // Vertically top align
    align-items: flex-start;
    // Horizontally left align
    justify-content: center;
    // Scroll vertically
    overflow-y: scroll;
    // Max height
    max-height: calc(100vh - var(--header-height) - 3em);
}
</style>
