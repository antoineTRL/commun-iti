<script setup lang="ts">
import ImageAttachement from "./attachements/ImageAttachement.vue";
import YoutubeAttachement from "./attachements/YoutubeAttachement.vue";
import VideoAttachement from "./attachements/VideoAttachement.vue";
import WebsiteAttachement from "./attachements/WebsiteAttachement.vue";
import type {
    MessageAttachement,
    WebsiteMessageAttachement,
    YoutubeMessageAttachement
} from "@/modules/message/models/domain";

defineProps<{
  attachements: MessageAttachement[];
}>();
</script>

<template>
  <div class="message-attachements">
    <template v-for="(attachement, i) in attachements" :key="i">
      <image-attachement v-show="attachement.type === 'image'"
                         :src="(attachement as ImageAttachement)?.src"  />
        <youtube-attachement
                v-show="attachement.type === 'youtube'"
                :attachement="attachement as YoutubeMessageAttachement"
        />
        <video-attachement
                v-show="attachement.type === 'video'"
                :src="(attachement as VideoAttachement)?.src"
        />
        <website-attachement
                v-show="attachement.type === 'website'"
                :attachement="attachement as WebsiteMessageAttachement"
        />
    </template>
  </div>
</template>
<style lang="scss">
@use "sass:map";
@use "@/app/styles/var";

.message-attachements {
  padding-top: map-get(var.$spaces, "2xs");
  display: flex;
  flex-wrap: wrap;
  gap: map-get(var.$spaces, "2xs");
}
</style>
