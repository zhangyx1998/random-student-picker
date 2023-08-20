<script setup>
import { ref, onMounted } from 'vue';
import { getRecordList } from '@/api/record.js';
import Entry from './record/ListEntry.vue';
const list = ref([]);

function localeDate(timestamp = 0) {
    return new Date(timestamp).toLocaleDateString(
        'en-us',
        { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
    );
}

async function load() {
    const res = await getRecordList();
    if (res instanceof Error) {
        alert.title('Error')(res.toString());
    } else {
        // Check if res is an Array
        if (!Array.isArray(res)) {
            console.error('Invalid response from server:', res);
            return alert.title('Error')(
                'Invalid response from server:',
                `expected Array, got ${typeof res}.`,
                'See console for details.'
            );
        }
        // Sort records descendent by timestamp
        res.sort((a, b) => b.timestamp - a.timestamp);
        // Unset current list
        list.value = [];
        // Categorize records by date
        let currentDay, currentList;
        for (const record of res) {
            const date = localeDate(record?.timestamp ?? 0);
            if (date !== currentDay) {
                currentDay = date;
                currentList = [];
                list.value.push([currentDay, currentList]);
            }
            // Push record to current list
            currentList.push(record);
        }
    }
}

onMounted(load);
</script>

<template>
    <container
        v-if="list.length === 0"
        flex-column
        flex-center
        content-center
        flex-grow
    >
        <span
            style="user-select: none; color: var(--ct-gray); text-align: center;"
        >
            <i
                class="fa fa-exclamation-triangle"
                style="font-size: 6em; margin-bottom: 1rem;"
            ></i>
            <h1>No Record</h1>
        </span>
    </container>
    <container
        v-else
        flex-column
        content-left
        w1024
    >
        <template
            v-for="[date, subList] in list"
            :key="date"
        >
            <div class="sub-list-header">
                <span
                    v-for="word, i in date.split(',')"
                    :key="i"
                >
                    {{ word.trim() }}
                </span>
            </div>
            <container
                flex-column
                :pad="false"
                class="sub-list"
            >
                <entry
                    v-for="record, i in subList"
                    :key="i"
                    v-bind="record"
                    @updated="load"
                />
            </container>
        </template>
    </container>
</template>

<style lang="scss" scoped>
.sub-list-header {
    font-size: 2em;
    :first-child {
        font-weight: bold;
        margin-right: 0.5em;
    }
    :not(:first-child):not(:last-child)::after {
        content: ', ';
    }
}
.sub-list {
    padding: 0.5em 0.2em;
    width: 100%;
}
</style>
