<script setup lang="ts">
import UserProfileMenuItem from './UserProfileMenuItem.vue';
import RoomMenuItem from './RoomMenuItem.vue';
import RoomList from '@/app/components/domain/room/RoomList.vue';
import { useStore } from '@/app/platform';
import { RoomStore } from '@/modules/room/store';

const store = useStore(RoomStore);

function selectRoom(room) {
    store.setCurrentRoom(room);
}
</script>

<template>
    <div class="left-menu stretch-wh">
        <div class="left-menu-top">
            <UserProfileMenuItem class="user" />
        </div>

        <h3>Salons</h3>

        <div class="left-menu-middle">
            <RoomList :rooms="store.state.rooms" @selectRoom="selectRoom" />
        </div>

        <div class="left-menu-bottom">
            <RoomMenuItem />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/app/styles/var';

.left-menu {
  display: flex;
  flex-direction: column;

  .left-menu-middle {
    flex: 1;
  }
  h3 {
    color: white;
    text-align: center;
    background-color: var.$color-light;
    padding: map-get(var.$spaces, '2xs');
  }

  .left-menu-bottom {
    border-top: 1px solid var.$color-light;
  }
}
</style>
