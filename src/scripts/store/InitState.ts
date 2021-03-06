import type { GetState, SetState } from 'zustand';
import { localGet, type ConnectedTarget, type ConnectTargetEventMap, type ConnectTargetStatMap, type IStore } from '.';

export enum SocketStatus {
  Disconnected,
  Connecting,
  Connected
}

export interface IState {
  pubSubUri: string;
  connectionStatus: SocketStatus;
  autoConnect: any;
  connectTarget: string;
  connectedTargets: Map<string, ConnectedTarget>;
  activeConnectedTarget: ConnectedTarget | null;
  events: ConnectTargetEventMap;
  stats: ConnectTargetStatMap;
}

export default (_set: SetState<IStore>, _get: GetState<IStore>): IState => {
  const shouldAutoConnect = localGet('gh.autoConnect') || false;

  const InitState: IState = {
    autoConnect: shouldAutoConnect,
    connectedTargets: new Map(),
    connectionStatus: SocketStatus.Disconnected,
    connectTarget: '',
    activeConnectedTarget: null,
    pubSubUri: localGet('gh.pubSubUri') || process.env.URI_GH_PUBSUB || '//',
    events: {},
    stats: {}
  };

  return InitState;
};
