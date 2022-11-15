import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class ReceiptsSocketEvents {
  private server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;

  constructor() { }

  public init(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this.server = server;
    this.server.on('connection', (socket) => {
      console.log('Initialize events to receipts');
      socket.on('subscribe-to-receipts', (receiptsIds: string[]) => this.joinReceipts(socket, receiptsIds));
      socket.on('unsubscribe-from-receipts', (receiptsIds: string[]) => this.disconnectFromReceipts(socket, receiptsIds));
    })
  }

  private joinReceipts(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, receiptsIds: string[]) {
    console.log('Сonnect to receipt', receiptsIds.length);
    for (const receiptId of receiptsIds) {
      socket.join(receiptId);
    }
  }

  private disconnectFromReceipts(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, receiptsIds: string[]) {
    console.log('Disconnect from receipt', receiptsIds.length);
    for (const receiptId of receiptsIds) {
      socket.leave(receiptId);
      socket.rooms.delete(receiptId);
    }
  }

  public broadcastSendCallToCreate(categoryId: string, receiptId: string) {
    if (this.server) {
      this.server.sockets.to(categoryId).emit('call-create-receipt', receiptId);
    }
  }

  public broadcastSendCallToUpdate(receiptId: string) {
    if (this.server) {
      this.server.sockets.to(receiptId).emit('call-update-receipt', receiptId);
    }
  }

  public broadcastSendCallToLike(receiptId: string) {
    if (this.server) {
      this.server.sockets.to(receiptId).emit('call-like-receipt', receiptId);
    }
  }

  public broadcastSendCallToDelete(receiptId: string) {
    if (this.server) {
      this.server.to(receiptId).emit('call-delete-receipt', receiptId);
    }
  }
}

export const receiptsSocketEvents = new ReceiptsSocketEvents();