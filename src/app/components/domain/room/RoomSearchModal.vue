<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useFormModal } from "@/app/components/ui/modal";
import type { FormInstance, FormRules } from "element-plus";
import { useProvider } from "@/app/platform";
import { RoomAPI } from "@/modules/room/services/RoomAPI";
import { RoomService } from "@/modules/room/services/RoomService";
import type { Room } from "@/modules/room/models/domain/Room";

const [roomApi, roomService] = useProvider([RoomAPI, RoomService]);
const form = ref<FormInstance | null>(null);
const loading = ref(false);
const router = useRouter();
const foundRooms = ref<Room[]>([]);

const formRules = reactive<FormRules>({
    roomId: [
        {
            required: true,
            message: "Veuillez sélectionner un salon"
        }
    ]
});

const { isVisible, hide, show, formModel } = useFormModal(
    {
        roomId: ""
    },
    form
);

async function onSubmit(form?: FormInstance) {
    if (!form) {
        return;
    }

    try {
        loading.value = true;
        await form.validate();

        // Redirect to the selected room
        const selectedRoom = foundRooms.value.find(room => room.id === formModel.roomId);

        if (selectedRoom) {
            // Check if the user is already in the room
            const isInRoom = await roomService.isInRoom(selectedRoom.id);

            if (isInRoom) {
                console.log("User is already in the room");
                // Handle the case where the user is already in the room
            } else {
                // Retrieve full details of the room
                const fullRoomDetails = await roomApi.findById(selectedRoom.id);

                if (fullRoomDetails) {
                    // Join the room and redirect
                    await roomService.join(fullRoomDetails.id);
                    router.push(`/app/room/${fullRoomDetails.id}`);
                } else {
                    console.error('Room details not found for room ID:', selectedRoom.id);
                    // Handle the case where room details are not available
                }
            }
        } else {
            console.error('Selected room not found:', formModel.roomId);
        }

        hide();
    } catch (e) {
        console.error('Error during search or joining of the room:', e);
        // Show a user-friendly error message to the user
        // You can use a UI library to display notifications or create your own logic
    } finally {
        loading.value = false;
    }
}

/**
 * Search rooms that contain the given text.
 * Store the result into foundRooms.
 * @param text
 */
async function searchRooms(text: string) {
    try {
        loading.value = true;
        foundRooms.value = await roomApi.search(text);
    } catch (e) {
        console.error("Error searching for rooms:", e);
        // Show a user-friendly error message to the user
        // You can use a UI library to display notifications or create your own logic
    } finally {
        loading.value = false;
    }
}

defineExpose({
    show,
    hide
});
</script>

<template>
    <el-dialog v-model="isVisible" title="Rejoindre un salon" width="30%">
        <el-form
                ref="form"
                :model="formModel"
                :rules="formRules"
                label-position="top"
                @submit.prevent="onSubmit(form!)"
        >
            <el-form-item label="Rechercher un salon" prop="roomId">
                <el-select
                        class="search-input"
                        v-model="formModel.roomId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="Tapez le nom du salon"
                        :remote-method="searchRooms"
                        :loading="loading"
                >
                    <el-option
                            v-for="item in foundRooms"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="form-actions">
                <el-button native-type="reset" @click="hide()">Annuler</el-button>

                <el-button type="primary" native-type="submit" :loading="loading" @click="onSubmit(form!)">
                    Rejoindre
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.search-input {
    width: 100%;
}
</style>