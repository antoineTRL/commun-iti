<script lang="ts" setup>
import { RoomStore } from "@/modules/room/store";
import { useState, useStore } from "@/app/platform";
import type { Room } from "@/modules/room/models/domain/Room";
import { ref } from 'vue';
const state = useState(RoomStore);
const store = useStore(RoomStore);
const redirect = ref(false);

function selectRoom(room: Room) {
    store.setCurrentRoom(room);
}
</script>

<template>
    <nav class="room-list">
        <ul>
            <li v-for="room in state.rooms" :key="room.id">
                <router-link :to="'/app/room/' + room.id" class="room-list-item" @click="selectRoom(room)">
                    {{ room.name }}
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use '@/app/styles/var';

.room-list {
    padding-top: 1px;
    > ul {
        margin: 0;
        list-style-type: none;
        padding-inline: 0;

        > li {
            margin: 0;
            text-decoration: none;
            display: block;

            a {
                color: var.$color-lighter;
                text-decoration: none;
                display: block;
                padding: map-get(var.$spaces, "2xs") map-get(var.$spaces, "xs");

                &:hover {
                    background-color: var.$color-light;
                }

                &.router-link-active {
                    color: #ffffff;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>

<script lang="ts">

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export default {
    beforeRouteEnter(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
        // Check if there's a current room
        if (!state.currentRoom && state.rooms.length > 0) {
            // If no current room and there are rooms available, redirect to the first room
            next({ path: `/app/room/${state.rooms[0].id}` });
        } else {
            // Continue with the normal route
            next();
        }
    },
};
</script>
