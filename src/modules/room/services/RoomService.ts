import { inject, injectable } from "inversify";
import { RoomAPI } from "./RoomAPI";
import { RoomStore } from "../store";
import type { NewRoom } from "../models/NewRoom";
import type { Room } from "../models/domain/Room";
import type { PaginatedQuery } from "@/modules/infrastructure/models";

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

  async isRoomAvailable(roomName: string): Promise<boolean> {
    // Votre logique pour vérifier la disponibilité du nom du salon
    // Cela pourrait impliquer une requête à l'API pour vérifier la disponibilité du nom

    // Exemple simplifié
    const existingRooms = this.store.state.rooms;
    const isAvailable = !existingRooms.some(room => room.name === roomName);

    return isAvailable;
  }
  async isInRoom(roomId: string): Promise<boolean> {
    // Votre logique pour vérifier si l'utilisateur est déjà dans le salon
    // Cela pourrait impliquer une requête à l'API pour vérifier la présence de l'utilisateur dans le salon

    // Exemple simplifié
    const existingRooms = this.store.state.rooms;
    return existingRooms.some(room => room.id === roomId);
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

  async reloadRooms() {
    const roomsPagination = this.store.state.roomsPagination;

    await this.fetch(
        {
          page: 0,
          perPage: roomsPagination.perPage
        },
        false
    );
  }

  private async fetch(pagination: PaginatedQuery, append: boolean) {
    const paginatedData = await this.api.fetch(pagination);

    if (append) {
      this.store.appendRoom(...paginatedData.data);
    } else {
      this.store.setRooms(paginatedData.data);
    }

    this.store.setRoomPagination({
      page: paginatedData.page,
      perPage: paginatedData.perPage,
      total: paginatedData.total
    });
  }
}
 