<template>
  <div class="container">
    <form @submit="onSubmit">
      <img src="./assets/vue.svg" alt="Vue logo">
      <JsonForms
        :data="data"
        :renderers="renderers"
        :schema="schema"
        :uischema="uischema"
        @change="onChange"
      />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  JsonForms,
  JsonFormsChangeEvent
} from "@jsonforms/vue";
import {
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import OktaAuth, {
  type IdxTransaction
} from '@okta/okta-auth-js';
import {
  defineComponent
} from 'vue';
import type {
  JsonSchema,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';
import {
  transformTransaction
} from './transform/transform-transaction';
</script>

<script lang="ts">
type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonObject | JsonArray | JsonPrimitive; };
type JsonArray = Array<JsonObject | JsonArray | JsonPrimitive>;
type Data = {
  transaction: IdxTransaction | null;
  schema: JsonSchema;
  uischema: Layout | UISchemaElement;
  data: JsonObject;
}

export default defineComponent({
  name: 'App',
  computed: {
    authClient() {
      return new OktaAuth({
        issuer: import.meta.env.VITE_APP_ISSUER,
        clientId: import.meta.env.VITE_APP_CLIENT_ID,
        redirectUri: import.meta.env.VITE_APP_REDIRECT_URI,
        devMode: !import.meta.env.PROD,
      });
    },
    renderers: () => Object.freeze(vanillaRenderers),
  },
  mounted() {
    this.authClient.idx.start()
      .then((transaction) => {
        this.transaction = transaction;
        const form = this.transformTransaction(transaction);
        this.schema = form.schema;
        this.uischema = form.uischema;
        this.data = form.data;
      });
  },
  methods: {
    onSubmit(e: Event) {
      e.preventDefault();
      this.authClient.idx.proceed(this.data)
        .then((transaction) => {
          this.transaction = transaction;
          const form = this.transformTransaction(transaction);
          this.schema = form.schema;
          this.uischema = form.uischema;
          this.data = form.data;
        });
    },
    onChange(event: JsonFormsChangeEvent) {
      this.data = event.data;
    },
    transformTransaction
  },
  data: (): Data => ({
    transaction: null,
    schema: {},
    uischema: { type: 'VerticalLayout' },
    data: {}
  }),
})
</script>

<style>
  .container {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .input {
    width: calc(var(--width-card) - 2rem);
    margin-bottom: 0;
  }
  .label {
    margin-top: 1rem;
  }
  .error {
    color: #c32;
  }
</style>
