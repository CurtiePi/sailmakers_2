<template>
    <popup-modal ref="popup">
        <h2 style="margin-top: 0">{{ title }}</h2>
        <!-- eslint-disable vue/no-v-html -->
        <p :style="{'font-size': 'medium'}"><span v-html="message"></span></p>
        <!--eslint-enable-->
        <div class="btns">
            <div v-if="verification" class="verification">
                <p>Type "{{ verification }}" below to confirm</p>
                <input type="text" size="45" :placeholder="verification" @keyup="_enableButton($event)"/>
            </div>
            <button class="cancel-btn" @click="_cancel">{{ cancelButton}}</button>
            <button :disabled="verification ? true : false"  ref="okBtn" class="ok-btn" @click="_confirm">{{ okButton}}</button>
        </div>
    </popup-modal>
</template>

<script>
import PopupModal from '@/components/PopupModal.vue'

export default {
    name: 'ConfirmDialogue',

    components: { PopupModal },

    data: () => ({
        title: undefined,
        message: undefined,
        okButton: undefined,
        cancelButton: undefined,
        verification: undefined,

        resolvePromise: undefined,
        rejectPromise: undefined,
    }),

    methods: {
        show(opts = {}) {
            this.title = opts.title
            this.message = opts.message
            this.okButton = opts.okButton

            if (opts.cancelButton) {
                this.cancelButton = opts.cancelButton
            }

            if (opts.verification) {
                this.verification = opts.verification
            }

            this.$refs.popup.open()

            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        _confirm() {
            this.$refs.popup.close()
            this.resolvePromise(true)
        },

        _cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
        },

        _enableButton(evt) {
            if (evt.target.value == this.verification) {
                this.$refs.okBtn.disabled = false
            } else {
                this.$refs.okBtn.disabled = true
            }
        } 
    }
}
</script>

<style scoped>
.btns {
    display: flex;
    flex-direction: row;
    flex-flow: row wrap;
    justify-content: space-between;
    background-color: #f8f8ff;
    border: 1px solid rgba(213, 234, 231, .5);
    padding: 0.2em;
    font-family: Verdana, Arial, Tahoma, Serif;
}

.ok-btn {
    margin-right: 0.5em;
    background-color: #fcfcfc;
    color: #3297da;
    text-decoration: underline;
    font-weight: bold;
    font-size: 16px;
    line-height: 2.5rem;
    cursor: pointer;
}

.ok-btn:disabled,
.ok-btn[disabled]{
    background-color: #fcfcfc7e;
    color: #3297da7e;
    cursor: not-allowed;
    pointer-events: all !important;
}

.cancel-btn {
    margin-left: 0.5em;
    padding: 0.5em 1em;
    background-color: #3297da;
    color: #ffffff;
    border: 2px solid #0ec5a4;
    border-radius: 5px;
    font-weight: bold;
    font-size: 16px;
/*    text-transform: uppercase; */
    cursor: pointer;
}

.verification {
    flex: 1 1 40vw;
    font-size: medium;
    margin-bottom: 0.5em;
}

input {
    border-radius: 5px;
}
</style>
