<template>
    <div frame-prompt>
        <div class="password-field">
            <input
                ref="passwordInput"
                v-model="password"
                monospace
                type="password"
                name="password"
                autocomplete="current-password"
                placeholder="Enter Password"
                @keydown.enter="requestLogin"
            />
            <btn
                login-button
                :type="'seamless' + disabled"
                @click="requestLogin"
            >
                <i
                    class="fa fa-arrow-right"
                ></i>
            </btn>
        </div>
        <div
            v-if="err"
            style="color: var(--ct-red); margin: 1em 0 0 0; padding: 0; font-size: 0.8em;"
        >
            <i class="fa fa-exclamation-triangle"></i>&nbsp;
            <span v-if="err?.code === 401">
                Login failed, please retry.
            </span>
            <span v-else>
                Unknown error (Code {{ err.code ?? 'Unknown' }}):
                {{ err?.message ?? err?.toString() ?? "unknown message" }}
            </span>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { login } from '@/api/app';
export default defineComponent({
    setup() {
        const password = ref(''), err = ref(false);
        watch(password, val => {
            if (err.value?.code === 401 && val.length > 0) err.value = undefined;
        });
        return { password, err, passwordInput: ref() };
    },
    computed: {
        disabled() {
            if (this.password.length > 0) return '';
            else return ' disabled';
        }
    },
    mounted() {
        this.passwordInput?.focus();
    },
    methods: {
        async requestLogin() {
            if (this.disabled) return;
            this.err = undefined;
            const res = await login(this.password);
            if (res === true) {
                this.RETURN(true);
            } else {
                this.password = '';
                this.err = res;
            }
        }
    }
});
</script>

<style scoped lang="scss">
.password-field {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    height: 2em;
    flex-grow: 1;
    --cb: var(--ct-gray-light);
    background: none;
    outline: solid 1px var(--cb);

    &:focus-within {
        --cb: var(--cb-blue);
        outline-width: 3px;
    }

    &>* {
        height: 100% !important;
        margin: 0 !important;
    }

    input {
        z-index: -2;
        border: none;
        outline: none;
        padding: 0.5em 4em 0.5em 1em;
    }

    [login-button] {
        // z-index: -1;
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 0;
        width: 3em;
    }
}
</style>
