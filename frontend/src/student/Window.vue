<template>
    <div
        frame-prompt
        style="padding-top: 1em; padding-bottom: 1em;"
    >
        <container
            flex-row
            flex-space-between
            content-center
            :pad="false"
            style="margin-bottom: 1.5em; position: relative;"
        >
            <h1
                style="font-weight: normal; font-size: 3rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >
                <student-name
                    :name="info?.name"
                    :bold="1"
                />
            </h1>
            <student-stat
                :total="info?.stat?.[0]"
                :credit="info?.stat?.[1]"
                style="width: 4rem"
            />
        </container>
        <container
            class="foldable"
            :class="{ toggle }"
            flex-column
            :pad="false"
        >
            <container
                class="header"
                flex-row
                flex-space-between
                content-center
                :pad="false"
                @click="toggle = !toggle"
            >
                <div>Detailed Student Information</div>
                <i
                    class="fa"
                    :class="`fa-caret-${toggle ? 'down' : 'left'}`"
                ></i>
            </container>
            <template v-if="toggle">
                <student-meta
                    :meta="info?.meta"
                    style="font-size: 0.9em;"
                />
            </template>
        </container>
    </div>
    <!-- Delete button -->
    <div
        btn-group
        compact
    >
        <btn
            type="solid green"
            @click="addRecord"
        >
            <i class="fa fa-edit"></i>
            <span class="btn-text">Add Record</span>
        </btn>
        <btn
            type="solid blue"
            @click="alert.title('Confirm deletion')('Feature not implemented')"
        >
            <i class="fa fa-list"></i>
            <span class="btn-text">View Records</span>
        </btn>
        <btn
            type="outlined red"
            @click="alert.title('Confirm deletion')('Feature not implemented')"
        >
            <i class="fa fa-exclamation-triangle"></i>
            <span class="btn-text">Delete Student</span>
        </btn>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
// Components
import StudentStat from '../student/Stat.vue';
import StudentName from '../student/Name.vue';
import StudentMeta from '../student/Meta.vue';
import { recordWindow } from '../record/Window.vue';
// Utility APIs
import { alert } from '@win';
import { createRecord } from '@/api/record';
import { getStudentInfo } from '@/api/student';
// Component Export
const component = defineComponent({
    components: {
        StudentStat, StudentName, StudentMeta
    },
    setup(sid) {
        return {
            sid,
            alert,
            info: ref(null),
            toggle: ref(true),
        };
    },
    computed: {
        timeCreated() {
            if (this.timestamp !== undefined) {
                const date = new Date(this.timestamp);
                return date.toLocaleString();
            } else {
                return 'N/A';
            }
        }
    },
    watch: {
        credited() { if (!this.flag_loading) this.timeoutUpdateServerRecord.force(); },
        comment() { if (!this.flag_loading) this.timeoutUpdateServerRecord(); }
    },
    mounted() {
        this.refresh();
    },
    methods: {
        async refresh() {
            const info = await getStudentInfo(this.sid);
            if (info instanceof Error) {
                alert.title('Error')(info);
            } else {
                this.info = info;
            }
        },
        async addRecord() {
            const res = await createRecord(this.sid);
            if (res instanceof Error) {
                await alert.title('Error')(res);
            } else {
                await recordWindow.title('New Record')(res);
            }
            this.refresh();
        }
    }
});
// Export Window Launcher
import Win from '@win';
export const studentWindow = Win(component, 'Student Information', true, {});
</script>

<style lang="scss" scoped>
[frame-prompt] {
    width: min(80vw, 520px);
}

.credit-view {
    height: 3em;
    user-select: none;

    &>i {
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: transparent;
        transition-duration: 1s !important;
    }

    &>.wrapper {
        height: 100%;
        &>.text-group {
            display: block;
            flex-grow: 1;
            font-size: 1.5em;
            text-align: left;
            font-weight: bold;
            position: relative;
            perspective: 10em;
        }
        &>.credit-button {
            font-size: 0.8em;
            min-height: 80%;
        }
    }

    &:not(.credited) {
        &>* {
            color: var(--cb-gray);
        }

        &>i {
            color: transparent;
            fill: none;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: var(--cb-gray-dark);
        }
    }

    &.credited>* {
        color: var(--c-brand);
    }
}

.foldable {
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--cf-next-level);

    &:hover,
    &:active {
        box-shadow: 0 0 3px var(--cb-gray-dark);
    }

    &:not(.toggle) {
        outline: 1px solid var(--cb-gray);
    }


    &.toggle>.header {
        border-color: var(--cb-gray);

        &>* {
            color: var(--ct);
        }
    }

    &>.header {
        user-select: none;
        // background-color: var(--cf-gray);
        padding: 0.4em 0 0.4em 0.6em;
        border-bottom: 1px solid transparent;

        // --ct: var(--cf);
        &>* {
            color: var(--ct-gray-light);
            margin: 0;
            font-size: 0.8em;
            font-weight: bold;
            display: block;
        }

        i {
            font-size: 1.2em;
            width: 1em;
        }

        &> :last-child {
            padding: 0;
            height: 100%;
            min-width: 1.6em;
        }
    }

    &> :not(.header) {
        margin: 0.5em 0;
    }

    margin-bottom: 0.5em;
}

.btn-text {
    margin-left: 0.5em;
    display: inline-block;
    min-width: 4em;
    text-align: center;
}
</style>
