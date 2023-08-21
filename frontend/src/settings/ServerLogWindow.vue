<template>
    <div style="width: 60em; min-width: 40vw; max-width: 100vw; height: 60vh; overflow: hidden; position:relative">
        <div
            ref="el"
            log-viewer
            style="width: 100%; height: 100%; overflow-y: scroll;"
            @scroll="handleScrollEvent"
        >
            <template
                v-for="(log, i) in logList"
                :key="i"
            >
                <div
                    v-if="filter(log)"
                    log
                    monospace
                    :class="[log.src, log.level]"
                >
                    <div
                        timestamp
                        style="min-width: 12em"
                    >
                        {{ log.timestamp }}
                    </div>
                    <div tag>
                        {{ log.src }}:{{ log.level.slice(0, 5).padEnd(5, '&nbsp;') }}
                    </div>
                    <div
                        message
                        :class="[log.src, log.level]"
                    >
                        {{ log.message }}
                    </div>
                </div>
            </template>
        </div>
        <btn
            v-if="!autoScroll"
            type="solid blue"
            style="position: absolute; bottom: 1em; right: 1em;"
            @click="autoScroll = true"
        >
            <i class="fa fa-arrow-down"></i>
        </btn>
    </div>
    <div btn-group>
        <btn
            type="outlined blue"
            @click="logList.splice(0, logList.length); $forceUpdate()"
        >
            <i class="fa fa-trash"></i>
            Clear Log
        </btn>
        <select
            v-model="filterLevel"
            monospace
            style="border-radius: 0.66em; border: 1px solid var(--ct-gray-dark); color: var(--ct-gray-dark)"
        >
            <option
                v-for="[key, val] in options"
                :key="val"
                :value="val"
            >
                {{ key[0].toUpperCase() }}{{ key.slice(1) }}
            </option>
        </select>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import dt from 'date-and-time';
import { auth } from '@/src/auth';
// Websocket URL
const URL = `ws://${location.host}/log`;
// Variables
export const
    wsAlive = ref(false),
    logList = [],
    el = ref(),
    autoScroll = ref(true),
    filterLevel = ref(1),
    // Non reactive
    logLevels = ['verbose', 'info', 'warn', 'error', 'panic'];
// Infinite loop that retries connection
let nextScroll, hasNewLog = false, prevScrollTop = 0, newLogCb = () => { };
function scrollLog(hasNew = false) {
    hasNewLog ||= hasNew;
    if (!autoScroll.value) return;
    if (!hasNewLog) return;
    if (nextScroll instanceof Promise) return;
    hasNewLog = false;
    const div = el.value;
    if (div instanceof HTMLDivElement) {
        div.scrollTo({
            top: div.scrollHeight,
            behavior: 'smooth'
        });
    }
    nextScroll = new Promise(r => {
        setTimeout(() => {
            nextScroll = undefined;
            r(scrollLog());
        }, 500);
    });
}
watch(autoScroll, val => { if (val) scrollLog(); });
function pushLog(event) {
    const log = JSON.parse(event.data);
    console.info(logList.push(log));
    newLogCb();
    // Scroll to bottom
    scrollLog(true);
}
function connectWS() {
    return new Promise(retry => {
        if (auth.value !== 'SERVER') return setTimeout(retry, 1000);
        const ws = new WebSocket(URL);
        ws.addEventListener('message', pushLog);
        ws.addEventListener('open', () => wsAlive.value = true);
        ws.addEventListener('close', () => {
            wsAlive.value = false;
            setTimeout(retry, 1000);
        });
        ws.addEventListener('error', () => wsAlive.value = false);
    }).then(connectWS);
}
// Native logs
const _log = level => function(message) {
    logList.push({
        level,
        src: 'WebApp',
        timestamp: dt.format(new Date, 'YYYY-MM-DD HH:mm:ss'),
        message
    });
};
export const log = Object.freeze({
    verbose: _log('verbose'),
    info: _log('info'),
    warn: _log('warn'),
    error: _log('error'),
    panic: _log('panic'),
});
// Watch for connection
watch(wsAlive, (alive, prev) => {
    if (alive === prev) return;
    if (alive) log.info('Connection established');
    else log.warn('Connection interrupted');
});
// Start infinite connect-retry loop
connectWS();
// Create log viewer frame component
export default defineComponent({
    setup() {
        return {
            wsAlive,
            logList,
            el,
            autoScroll,
            filterLevel,
            options: logLevels.map((l, i) => [l, i])
        };
    },
    mounted() {
        newLogCb = this.$forceUpdate.bind(this);
    },
    methods: {
        filter(log) {
            const
                level = log?.level ?? '',
                index = logLevels.indexOf(level);
            return index < 0 || index >= this.filterLevel;
        },
        handleScrollEvent(e) {
            const { scrollTop } = e?.target ?? {};
            if (scrollTop < prevScrollTop) autoScroll.value = false;
            prevScrollTop = scrollTop;
        }
    }
});
</script>

<style lang="scss" scoped>
div[log-viewer] {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;

  div[log] {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: top;
    padding: 0.4em 1em;
    border-bottom: 1px solid var(--cb-gray-light);

    &>* {
      display: block;
      margin: 0 0.5em;
    }

    [timestamp] {
      color: var(--ct-gray) !important;
      opacity: 0.6 !important;
      font-style: normal !important;
    }
  }

  .driver {
    font-style: italic;
  }

  .verbose {
    color: var(--ct-gray);
  }

  .info {
    color: var(--ct-green);
  }

  .warn {
    color: var(--ct-yellow);
  }

  .error {
    color: var(--ct-red);
  }

  .panic {
    color: var(--ct-red);
    background-color: var(--cf-yellow);
    font-weight: bold;
  }

  div[log].WebApp>* {
    opacity: 0.6;
  }

  div[log].verbose.WebApp {
    color: var(--ct-gray);
  }

  div[log].info.WebApp {
    background-color: var(--cf-green);
  }

  div[log].warn.WebApp {
    background-color: var(--cf-yellow);
  }

  div[log].error.WebApp {
    background-color: var(--cf-red);
  }

  div[log].panic.WebApp {
    color: var(--ct-yellow);
    background-color: var(--cf-red);
    font-weight: bold;
  }
}

div[btn-group] {
  i {
    margin-right: 0.5em;
  }
}
</style>
