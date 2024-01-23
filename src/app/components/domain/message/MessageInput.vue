<script lang="ts" setup>
import RichTextEditor from "../../ui/RichTextEditor.vue";
import { MessageService } from "@/modules/message/services/MessageService";
import { useProvider, useState } from "@/app/platform";
import { RoomStore } from "@/modules/room/store";
import type { RichText } from "@/modules/message/models/domain";
import type { NewMessage } from "@/modules/message/models/NewMessage";

const [messageService] = useProvider([MessageService]);
const roomState = useState(RoomStore);

const sendMessage = (richTextContent: RichText) => {
    if (richTextContent && roomState.currentRoom) {
        const newMessage: NewMessage = {
            roomId: roomState.currentRoom.id,
            text: richTextContent
        };
        messageService.sendMessage(newMessage);
    }
};
</script>
<template>
    <div class="message-input stretch-wh">
        <rich-text-editor @input="sendMessage" />
    </div>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";

.message-input {
  border-top: 1px solid var.$color-light-gray;
  background-color: var.$color-light-gray;
}
</style>