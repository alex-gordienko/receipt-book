import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class ArticlesSocketEvents {
  private server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined;

  constructor() { }

  public init(server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
    this.server = server;
    this.server.on('connection', (socket) => {
      console.log('Initialize events to articles');
      socket.on('subscribe-to-articles', (articleIds: string[]) => this.joinArticles(socket, articleIds));
      socket.on('unsubscribe-from-articles', (articleIds: string[]) => this.disconnectFromArticles(socket, articleIds));
    })
  }

  private joinArticles(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, articleIds: string[]) {
    console.log('Сonnect to articles', articleIds.length);
    for (const articleId of articleIds) {
      socket.join(articleId);
    }
  }

  private disconnectFromArticles(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, articleIds: string[]) {
    console.log('Disconnect from article', articleIds.length);
    for (const articleId of articleIds) {
      socket.leave(articleId);
      socket.rooms.delete(articleId);
    }
  }

  public broadcastSendCallToCreate(categoryId: string, articleId: string) {
    if (this.server) {
      this.server.sockets.to(categoryId).emit('call-create-article', articleId);
    }
  }

  public broadcastSendCallToUpdate(articleId: string) {
    if (this.server) {
      this.server.sockets.to(articleId).emit('call-update-article', articleId);
    }
  }

  public broadcastSendCallToLike(articleId: string) {
    if (this.server) {
      this.server.sockets.to(articleId).emit('call-like-article', articleId);
    }
  }

  public broadcastSendCallToDelete(articleId: string) {
    if (this.server) {
      this.server.to(articleId).emit('call-delete-article', articleId);
    }
  }
}

export const articlesSocketEvents = new ArticlesSocketEvents();