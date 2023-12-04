<script lang="ts" setup>
import RoomSearchModal from "@/app/components/domain/room/RoomSearchModal.vue";
import { useProvider, useState } from "@/app/platform";
import { RoomService } from "@/modules/room/services/RoomService";
import { RoomStore } from "@/modules/room/store";
import { Plus, Search } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import RoomCreationModal from "@/app/components/domain/room/RoomCreationModal.vue";

const state = useState(RoomStore);
const [roomService] = useProvider([RoomService]);
const modalRef = ref<InstanceType<typeof RoomCreationModal> | null>(null);
const searchModalRef = ref<InstanceType<typeof RoomSearchModal> | null>(null);
onMounted(() => {
    if (state.rooms.length === 0) {
        roomService.fetchMore();
    }
});

function openModal() {
    if (modalRef.value) {
        modalRef.value.show();
    }
}
function openSearchModal() {
    if (searchModalRef.value) {
        searchModalRef.value.show();
    }
}
</script>

<template>
    <div class="room-menu-item">
        <div class="room-menu-title">Salon actuel</div>

        <div class="room-menu-main">
            <div class="room-menu-name">{{ state.currentRoom?.name }}</div>
            <div class="room-menu-actions">
                <el-button :icon="Plus" size="default" circle @click="openModal" />
                <el-button :icon="Search" size="default" circle @click="openSearchModal" />
            </div>
        </div>

        <!-- Utilisez la template ref pour ouvrir la modal -->
        <RoomCreationModal ref="modalRef" />
        <RoomSearchModal ref="searchModalRef" />
    </div>
</template>

<style lang="scss" scoped>
@use "@/app/styles/var";

.room-menu-item {
  padding: map-get(var.$spaces, "xs");
  color: white;

  .room-menu-title {
    font-size: 70%;
    color: rgba(255, 255, 255, 0.7);
  }
  .room-menu-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .room-menu-actions {
      display: flex;
      gap: map-get(var.$spaces, "2xs");
    }
  }
}
</style>