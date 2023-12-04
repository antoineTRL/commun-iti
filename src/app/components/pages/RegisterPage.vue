<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { UserAPI } from "@/modules/user/services";
import { AuthenticationService } from "@/modules/authentication/services";
import { useProvider } from "@/app/platform";
import type { FormRules, FormInstance } from "element-plus";

const [userApi, authService] = useProvider([UserAPI, AuthenticationService]);
const router = useRouter();

const registerModel = reactive({
  username: "",
  password: "",
  passwordConfirmation: ""
});

const userNameRegex = /^(\w+)$/i;

const registerFormRules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: "Pseudo obligatoire"
    },
      {
          pattern: userNameRegex,
          message: "Format du pseudo invalide. Utilisez des caractères alphanumériques."
      }
  ],
  password: [
      {
      required: true,
      message: "Mot de passe obligatoire"
    }
  ],
  passwordConfirmation: [
    {
      required: true,
      message: "Confirmation du mot de passe obligatoire"
    },
    {
      validator: (rule, value, callback) => {
        if (value !== registerModel.password) {
          callback(new Error("Les mots de passe ne correspondent pas"));
        } else {
          callback();
        }
      }
    }
  ]
});

async function onSubmit(form?: FormInstance) {
    if (!form) {
        return;
    }

    try {
        await form.validate();

        // Vérifier si l'utilisateur existe déjà
        const userExists = await userApi.exists(registerModel.username);

        if (userExists) {
            // Afficher un message indiquant que l'utilisateur existe déjà
            ElMessage.error("Cet utilisateur existe déjà. Veuillez choisir un autre nom d'utilisateur.");
            return; // Arrêter le processus d'enregistrement
        }

        // Si la validation réussit, enregistrer l'utilisateur via userApi
        await userApi.register({
            username: registerModel.username,
            password: registerModel.password
            // Ajoutez d'autres champs si nécessaire pour l'enregistrement
        });

        // Redirection vers une page après l'enregistrement réussi, par exemple :
        router.push('/login'); // Changer '/confirmation' par votre route appropriée

    } catch (error) {
        // Gérer les erreurs de validation ou d'enregistrement ici
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        ElMessage.error("Erreur lors de l'enregistrement. Veuillez réessayer.");
    }
}

</script>
<template>
  <div class="register center-children full-h">
    <main class="width-s">
      <h1 class="register-title">Créer un compte</h1>

      <div class="register-form">
        <el-form
          ref="form"
          :model="registerModel"
          :rules="registerFormRules"
          label-position="top"
          class="register-form"
          @submit.prevent="onSubmit($refs.form)"
        >
          <el-form-item label="Pseudo" prop="username">
            <el-input v-model="registerModel.username" />
          </el-form-item>

          <el-form-item label="Mot de passe" prop="password">
              <el-input v-model="registerModel.password" />
          </el-form-item>

          <el-form-item label="Confirmez votre mot de passe" prop="passwordConfirmation">
              <el-input v-model="registerModel.passwordConfirmation" />
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button type="primary" native-type="submit"> Créer mon compte </el-button>

              <router-link to="/login">J'ai déjà un compte</router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style scoped lang="scss">
@use "@/app/styles/var";
@use "@/app/styles/mixins";
@use "sass:list";

.form-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
