<script lang="ts" setup>
import { MessageService } from "@/modules/message/services/MessageService";
import { useProvider, useState } from "@/app/platform";
import { RoomStore } from "@/modules/room/store";
import type { RichText } from "@/modules/message/models/domain";
import RichTextEditor from "@/app/components/ui/RichTextEditor.vue";
import {ref, UnwrapRef} from "vue";
import type {NewMessage} from "@/modules/message/models/NewMessage";

const [messageService] = useProvider([MessageService]);
const roomState = useState(RoomStore);

// Créer une variable réactive pour stocker le texte saisi par l'utilisateur
const text = ref<RichText | null>(null);

// Créer une fonction pour envoyer le message au serveur
const sendMessage = async () => {
    // Vérifier que le texte n'est pas vide et que le salon est sélectionné
    if (text.value && roomState.currentRoom) {
        // Créer un objet NewMessage avec le texte et l'id du salon
        const newMessage: { text: { tokens: UnwrapRef<RichText["tokens"]> } | null; roomId: string } = {
            text: text.value,
            roomId: roomState.currentRoom.id
        };

        // Utiliser le service MessageService pour envoyer le message
        await messageService.sendMessage(newMessage);

        // Réinitialiser le texte à null
        text.value = null;
    }
};

</script>
<template>
  <div class="message-input stretch-wh">

      <!-- Utiliser le composant RichTextEditor pour afficher le champ de saisie -->
      <RichTextEditor v-model="text" />

      <!-- Utiliser un bouton pour appeler la fonction sendMessage -->
      <button @click="sendMessage">Envoyer</button>

  </div>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";

//.message-input {
//  border-top: 1px solid var.$color-light-gray;
//  background-color: var.$color-light-gray;
//}

.message-input {
  border-top: 1px solid var.$color-light-gray;
  background-color: var.$color-light-gray;
  display: flex;
  align-items: center;
  padding: 10px;

  button {
    margin-left: 10px;
    background-color: var.$color-primary;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
}

</style>

