import { inject, injectable } from "inversify";
import { RoomAPI } from "./RoomAPI";
import { RoomStore } from "../store";
import type { NewRoom } from "../models/NewRoom";
import type { Room } from "../models/domain/Room";

@injectable()
export class RoomService {
  @inject(RoomAPI) api!: RoomAPI;
  @inject(RoomStore) store!: RoomStore;

  async create(newRoom: NewRoom): Promise<Room> {
    const room = await this.api.create(newRoom);
    this.store.appendRoom(room);
    return room;
  }

  async join(roomId: string): Promise<void> {
    const room = await this.api.join(roomId);
    this.store.appendRoom(room);
  }

  async fetchMore(): Promise<void> {
    const roomsPagination = this.store.state.roomsPagination;

    const paginatedData = await this.api.fetch({
      page: roomsPagination.page + 1,
      perPage: roomsPagination.perPage
    });

    this.store.appendRoom(...paginatedData.data);

    this.store.setRoomPagination({
      page: paginatedData.page,
      perPage: paginatedData.perPage,
      total: paginatedData.total
    });
  }

  async isRoomAvailable(name: string): Promise<boolean> {
    try {
      // Effectuez une requête API pour vérifier la disponibilité du nom du salon
      const response = await api.get(`/rooms/checkAvailability?name=${name}`);
      // Analysez la réponse pour savoir si le nom est disponible
      return response.data.available; // Suppose que la réponse a une propriété "available" indiquant la disponibilité
    } catch (error) {
      console.error("Erreur lors de la vérification de la disponibilité du nom du salon :", error);
      throw new Error("Une erreur s'est produite lors de la vérification de la disponibilité du nom du salon.");
    }
  }

  // IsInRoom async to check if the user is already in the room
    async isInRoom(roomId: string): Promise<boolean> {
        try {
        // Effectuez une requête API pour vérifier si l'utilisateur est déjà dans la salle
        const response = await api.get(`/rooms/${roomId}/isInRoom`);
        // Analysez la réponse pour savoir si l'utilisateur est déjà dans la salle
        return response.data.isInRoom; // Suppose que la réponse a une propriété "isInRoom" indiquant si l'utilisateur est déjà dans la salle
        } catch (error) {
        console.error("Erreur lors de la vérification de la disponibilité du nom du salon :", error);
        throw new Error("Une erreur s'est produite lors de la vérification de la disponibilité du nom du salon.");
        }
    }
}
