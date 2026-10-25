// P2P WebRTC Network Manager via PeerJS
// Matches [ P2P WEBRTC MESH ] in UI
import Peer, { type DataConnection } from 'peerjs';

export type NetworkMessage = 
  | { type: 'STATE_UPDATE'; state: any }
  | { type: 'PLAYER_ACTION'; action: string; payload: any }
  | { type: 'REACTION'; effectType: string; authorName: string }
  | { type: 'CHAT_MESSAGE'; message: any }
  | { type: 'JOIN_REQUEST'; player: { id: string; name: string; avatar: string } }
  | { type: 'LEAVE_REQUEST'; playerId: string };

const PEER_CONFIG = {
  debug: 0,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
    ],
    iceCandidatePoolSize: 10,
  },
};

export class P2PNetwork {
  private static peer: Peer | null = null;
  private static connections: Map<string, DataConnection> = new Map();
  private static hostConnection: DataConnection | null = null;
  public static isHost: boolean = false;
  public static myPeerId: string = '';

  // Generate clean room code like BOC-551
  public static generateRoomCode(): string {
    const letters = 'BOC';
    const num = Math.floor(100 + Math.random() * 900);
    return `${letters}-${num}`;
  }

  // Create room as Host
  public static async createRoom(
    roomId: string, 
    onMessage: (msg: NetworkMessage, peerId: string) => void,
    onPeerJoin?: (peerId: string) => void,
    onPeerLeave?: (peerId: string) => void
  ): Promise<string> {
    this.disconnect();
    this.isHost = true;
    
    // Peer ID namespace
    const peerId = `tuthank-room-${roomId.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      try {
        const peer = new Peer(peerId, PEER_CONFIG);

        peer.on('open', (id) => {
          this.peer = peer;
          this.myPeerId = id;
          resolve(id);
        });

        peer.on('connection', (conn) => {
          conn.on('open', () => {
            this.connections.set(conn.peer, conn);
            onPeerJoin?.(conn.peer);
          });

          conn.on('data', (data) => {
            onMessage(data as NetworkMessage, conn.peer);
          });

          conn.on('close', () => {
            this.connections.delete(conn.peer);
            onPeerLeave?.(conn.peer);
          });

          conn.on('error', () => {
            this.connections.delete(conn.peer);
            onPeerLeave?.(conn.peer);
          });
        });

        peer.on('error', (err) => {
          console.warn('Host peer warning:', err);
          if (!this.peer) {
            resolve(peerId);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // Join existing room
  public static async joinRoom(
    roomId: string,
    playerInfo: { id: string; name: string; avatar: string },
    onMessage: (msg: NetworkMessage) => void
  ): Promise<boolean> {
    this.disconnect();
    this.isHost = false;
    const targetPeerId = `tuthank-room-${roomId.toLowerCase()}`;

    return new Promise((resolve) => {
      try {
        const peer = new Peer(PEER_CONFIG);

        peer.on('open', (id) => {
          this.peer = peer;
          this.myPeerId = id;

          const conn = peer.connect(targetPeerId, { reliable: true });

          conn.on('open', () => {
            this.hostConnection = conn;
            // Send join request
            conn.send({
              type: 'JOIN_REQUEST',
              player: playerInfo
            } as NetworkMessage);
            resolve(true);
          });

          conn.on('data', (data) => {
            onMessage(data as NetworkMessage);
          });

          conn.on('error', (err) => {
            console.error('Connection to host failed:', err);
            resolve(false);
          });

          setTimeout(() => {
            if (!this.hostConnection) resolve(false);
          }, 7000);
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
          resolve(false);
        });
      } catch {
        resolve(false);
      }
    });
  }

  // Host broadcasts to all clients
  public static broadcast(msg: NetworkMessage) {
    if (!this.isHost) return;
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(msg);
      }
    });
  }

  // Host sends message to a specific client peer
  public static sendToPeer(peerId: string, msg: NetworkMessage) {
    const conn = this.connections.get(peerId);
    if (conn && conn.open) {
      conn.send(msg);
    }
  }

  // Client sends to Host
  public static sendToHost(msg: NetworkMessage) {
    if (this.hostConnection && this.hostConnection.open) {
      this.hostConnection.send(msg);
    }
  }

  // Disconnect
  public static disconnect() {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    if (this.hostConnection) {
      this.hostConnection.close();
      this.hostConnection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    this.isHost = false;
  }
}
