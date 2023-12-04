<script lang="ts" setup>
import { MessageService } from "@/modules/message/services/MessageService";
import { useProvider, useState } from "@/app/platform";
import { RoomStore } from "@/modules/room/store";
import type { RichText } from "@/modules/message/models/domain";

const [messageService] = useProvider([MessageService]);
const roomState = useState(RoomStore);

</script>
<template>
  <div class="message-input stretch-wh">
    
  </div>
</template>
<style lang="scss" scoped>
@use "@/app/styles/var";

.message-input {
  border-top: 1px solid var.$color-light-gray;
  background-color: var.$color-light-gray;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { MessageService } from "@/modules/message/services/MessageService";
import { useProvider, useState } from "@/app/platform";
import { RoomStore } from "@/modules/room/store";
import type { RichText } from "@/modules/message/models/domain";

const [messageService] = useProvider([MessageService]);
const roomState = useState(RoomStore);

export default defineComponent({
  name: "MessageInput",
  setup() {
    const { currentRoom } = roomState;
    const { sendMessage } = messageService;

    async function onSendMessage(content: RichText) {
      if (!currentRoom) {
        return;
      }

      await sendMessage(currentRoom.id, content);
    }

    return {
      onSendMessage,
    };
  },
});
</script>

