import { useEffect, useMemo } from "react";
import { Socket } from "socket.io-client";

type SupportedItems = 'receipt' | 'category' | 'article';
type ActionType = 'create' | 'update' | 'delete' | 'like';

export const useSocketEvents = (
  socket: Socket,
  listenFor: SupportedItems,
  listenerTypes: ActionType[],
  cb: (id: string, actionType: ActionType) => void
) => {
  const uniqListeners = useMemo(() => [...new Set(listenerTypes)], [listenerTypes]);
  return useEffect(() => {
    uniqListeners.forEach((listener: ActionType) => {
      socket.on(`call-${listener}-${listenFor}`, (id: string) => cb(id, listener));
    });

    return () => {
      uniqListeners.forEach((listener: ActionType) => {
        socket.off(`call-${listener}-${listenFor}`);
      });
    }
  }, [socket, listenerTypes, cb, listenFor, uniqListeners])
}