<script setup lang="ts">
  import { reactive } from "vue";
  import { useFormValidation } from "./composables/useFormValidation";
  import { useFetchRequest } from "./composables/useFetchRequest";

  const formData = reactive({ email: "", password: "" });

  const { errors, isValid } = useFormValidation(
    {
      email: [(value) => (value.length > 0 ? null : "Email обязателен")],
      password: [(value) => (value.length > 0 ? null : "Password обязателен")],
    },
    formData,
  );

  const { data, error, loading, execute } = useFetchRequest({
    url: "https://api.restful-api.dev/objects",
    method: "GET",
  });

  const sendForm = () => {
    if (isValid.value) {
      alert("ny valid poluchaetsa");
    } else {
      alert(Object.values(errors).join(", "));
    }
  };

  const fetchPhones = async () => {
    await execute();

    if (error.value) {
      alert("error:" + error.value);
    } else {
      alert("founded phone:" + data.value[0].name);
    }
  };
</script>

<template>
  <div>
    <form @submit.prevent="sendForm">
      <input
        type="text"
        v-model="formData.email"
      />
      <input
        type="text"
        v-model="formData.password"
      />
      <input
        type="submit"
        value="validate"
      />
    </form>
    <div>
      <button
        class="button"
        @click="fetchPhones"
      >
        fetch phones, loading: {{ loading }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .button {
    margin-top: 2rem;
  }
</style>
