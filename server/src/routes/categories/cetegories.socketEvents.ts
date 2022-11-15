import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class CategoriesSocketEvents {
  private server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;

  constructor() { }

  public init(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this.server = server;
    this.server.on('connection', (socket) => {
      console.log('Initialize events to categories');
      socket.on('subscribe-to-category', (categoryId: string)=>this.joinCategory(socket, categoryId));
      socket.on('unsubscribe-from-category', (categoryId: string) => this.disconnectFromCategory(socket, categoryId));
    })
  }

  private joinCategory(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, categoryId: string) {
    console.log('Сonnect to category', categoryId.length);
    if (socket.rooms.size) {
      Array.from(socket.rooms.keys()).forEach((room: string) => this.disconnectFromCategory(socket, room));
    }
    socket.join(categoryId);
  }

  private disconnectFromCategory(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, categoryId: string) {
    console.log('Disconnect from category', categoryId);
    socket.leave(categoryId);
    socket.rooms.delete(categoryId);
  }

  public broadcastSendCallToUpdate(categoryId: string) {
    if (this.server) {
      this.server.sockets.emit('call-update-category', categoryId);
    }
  }

  public broadcastSendCallToLike(categoryId: string) {
    if (this.server) {
      this.server.sockets.to(categoryId).emit('call-like-category', categoryId);
    }
  }
}

export const categoriesSocketEvents = new CategoriesSocketEvents();