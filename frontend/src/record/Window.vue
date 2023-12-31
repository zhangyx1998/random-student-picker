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
            <container
                flex-column
                flex-space-between
                content-left
                style="height: 100%;"
                :pad="false"
            >
                <h1
                    style="font-weight: normal; font-size: 3rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                >
                    <student-name
                        :name="info?.name"
                        :bold="1"
                    />
                </h1>
                <div
                    style="
                    user-select: none;
                    padding-left: 0.2em;
                    font-size: 0.6em;
                    color: var(--ct-gray-light);
                "
                >
                    <span v-if="record?.manual">Manually</span>
                    <span v-else>Randomly</span>
                    picked at {{ timeCreated }}
                </div>
            </container>
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
        <div style="margin: 1em"></div>
        <!-- Record Display -->
        <container
            class="credit-view"
            :class="{ credited }"
            style="padding: 0 0 0 0.5em;"
            flex-row
            content-center
        >
            <i
                class="fa fa-award"
                style="font-size: 2em; margin-right: 0.5em;"
            ></i>
            <container
                class="wrapper"
                flex-row
                content-center
                style="flex-grow: 1;"
                :pad="false"
            >
                <div
                    class="text-group"
                    style="height: 1em"
                >
                    <span class="y">Credit Received</span>
                    <span class="n">Not Credited</span>
                </div>
                <btn
                    v-if="!credited"
                    class="credit-button"
                    type="solid blue"
                    @click="credited = true"
                >
                    <i
                        class="fa fa-award"
                        style="height: 1em"
                    ></i>
                    <span class="btn-text">CREDIT</span>
                </btn>
                <btn
                    v-else
                    class="credit-button"
                    type="outlined gray"
                    @click="credited = false"
                >
                    <i
                        class="fa fa-undo"
                        style="height: 1em"
                    ></i>
                    <span class="btn-text">UNDO</span>
                </btn>
            </container>
        </container>
        <div style="margin: 1em"></div>
        <textarea
            v-model="comment"
            class="comment-text"
            placeholder="Add comment to this record"
            @blur="timeoutUpdateServerRecord.force"
            @keydown.enter="timeoutUpdateServerRecord.force"
        ></textarea>
        <div
            monospace
            style="font-size: 0.7em; color: var(--ct-gray); user-select: none; margin-bottom: .5em; text-align: center;"
        >
            CHANGES WILL BE SAVED AUTOMATICALLY
        </div>
        <!-- Refresh button -->
        <div
            v-if="regenerate"
            btn-group
            compact
        >
            <btn
                type="outlined green"
                @click="RETURN(true)"
            >
                <i class="fa fa-sync"></i>
                <span class="btn-text">Regenerate</span>
            </btn>
        </div>
        <div
            class="foot-note"
            style="padding-left: 1.5em; text-align: justify;"
        >
            <i
                class="fa fa-info-circle"
                style="width: 1em; margin: 0 0.5em 0 -1.5em;"
            ></i>This
            record will be counted into
            <span class="name"><student-name :name="info?.name" />'s</span>
            participation record.
            If you didn't intend for this, you can <btn
                type="seamless"
                style="padding: 0 0.3em; margin: 0; display: inline-block;"
                @click="deleteRecord"
            >
                <i class="fa fa-trash"></i>
                <span style="text-decoration: underline; margin-left: 0.2em;">
                    delete
                </span>
            </btn> this record.
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
// Components
import StudentStat from '../student/Stat.vue';
import StudentName from '../student/Name.vue';
import StudentMeta from '../student/Meta.vue';
// Common Utilities
import Timeout from '@CL/timeout';
// Utility APIs
import { alert, confirm } from '@win';
import { getRecord, updateRecord, deleteRecord } from '@/api/record';
import { getStudentInfo } from '@/api/student';
// Component
export default defineComponent({
    components: {
        StudentStat, StudentName, StudentMeta
    },
    setup(token, regenerate = false) {
        return {
            token,
            regenerate,
            comment: ref(),
            credited: ref(),
            timeout: undefined,
            firstLoad: ref(true),
            record: ref({}),
            info: ref(null),
            toggle: ref(false),
        };
    },
    computed: {
        timeCreated() {
            const { timestamp } = this.record;
            if (timestamp !== undefined) {
                const date = new Date(timestamp);
                return date.toLocaleString();
            } else {
                return 'N/A';
            }
        }
    },
    watch: {
        credited() { if (!this.firstLoad) this.timeoutUpdateServerRecord.force(); },
        comment() { if (!this.firstLoad) this.timeoutUpdateServerRecord(); }
    },
    async mounted() {
        this.timeoutUpdateServerRecord = Timeout(() => this.updateServerRecord(), 1000);
        await this.updateClientContent();
        this.firstLoad = false;
    },
    methods: {
        async deleteRecord() {
            const ack = await confirm
                .title('Delete Random Pick Record?')
                .props({ confirmColor: 'red', confirmText: 'Delete' })(
                    'Random pick will not be counted.',
                    'History of this random pick will be removed.',
                );
            if (ack) {
                await this.LOAD(
                    deleteRecord(this.token).then(r => { if (r instanceof Error) throw r; })
                );
                this.RETURN();
            }
        },
        async updateClientContent() {
            const request = async () => {
                const rec = await getRecord(this.token);
                if (rec instanceof Error) throw rec;
                const info = await getStudentInfo(rec.sid);
                if (info instanceof Error) throw info;
                return [info, rec];
            };
            const [info, rec] = await request().catch(e => {
                alert
                    .title('Error')(e.toString())
                    .then(() => this.RETURN());
            });
            // Update client content
            this.info = info;
            if (this.firstLoad) {
                const { credited = false, comment = '', ...record } = rec;
                this.credited = credited;
                this.comment = comment;
                this.record = record;
            }
        },
        async updateServerRecord(force = false) {
            const res = await updateRecord(this.token, {
                comment: this.comment,
                credited: this.credited,
            });
            if (res instanceof Error) alert.title('Error Updating Record')(res);
            // Fetch new record
            this.updateClientContent();
        }
    }
});
</script>

<style lang="scss" scoped>
[frame-prompt] {
    @media (min-width: 721px) {
        width: min(80vw, 520px);
    }
}

.foot-note {
    font-size: 0.8em;
    line-height: 1.2;
    font-weight: 500;
    color: var(--ct-gray-light);
    user-select: none;
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
        color: var(--ct-blue);
    }
}

.wrapper>.text-group>span {
    display: block;
    transition: .4s ease-in-out all;
    transform-style: preserve-3d;

    &.y {
        color: var(--ct-blue);
        transform: rotate3D(10, 0, 0, -90deg);
        opacity: 0;
    }

    &.n {
        color: var(--cb-gray);
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate3D(10, 0, 0, 90deg);
        opacity: 0;
    }

    .credit-view.credited &.y,
    .credit-view:not(.credited) &.n {
        transition-delay: .2s;
        transform: rotate3D(10, 0, 0, 0deg);
        opacity: 1;
    }
}

textarea {
    font-size: 1rem;
    border-radius: 10px;
    border: none;
    resize: vertical;
    width: 100%;
    border: none;
    padding: 1em;
    min-height: 6em;
    background-color: var(--cf-next-level);

    &:focus,
    &:active {
        background-color: transparent;
        outline: solid 1px var(--c-brand);
    }

    margin-bottom: .5em;
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
