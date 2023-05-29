import ws from "ws";
export interface Socket{
  id: number
  socket: ws.WebSocket
  uuid: string
}
export interface SocketIO{
  on(event: string, callback: (socket: Socket, args: any[]) => void): void
  emit(event: string, callback: (socket: Socket) => boolean, ...args: any[]): void
  iemit(event: string, ...args: any[]): void
  getSocket(id: number): Socket | undefined;
  sockets: Set<Socket>
}