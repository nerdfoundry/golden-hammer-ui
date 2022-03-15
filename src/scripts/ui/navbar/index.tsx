import { Group, Navbar, type NavbarProps } from '@mantine/core';
import type { PubSubConnectionResponse } from 'golden-hammer-shared';
import React, { useMemo } from 'react';
import shallow from 'zustand/shallow';
import useStore, { type IStore } from '../../store';
import { SocketStatus } from '../../store/InitState';
import { StyledNavBar } from '../../styles/navbar';
import SimulatorModal from '../EventSimulator/SimulatorModal';
import ConnectedTargetNavItem from './ConnectedTargetNavItem';
import InfoModal from './InfoModal';
import NoConnectedTargetsNavItem from './NoConnectedTargetsNavItem';
import PubSubConfig from './PubSubConfig';
import PubSubRegisterPanel from './PubSubRegisterPanel';

interface Props extends Omit<NavbarProps, 'children'> {}

const getStateVals = (s: IStore) => ({
  activePubSub: s.activePubSub,
  autoConnect: s.autoConnect,
  connectedPubSubs: s.connectedPubSubs,
  connectionStatus: s.connectionStatus,
  pubsubRegisterChat: s.pubsubRegisterChat,
  pubsubUnregisterChat: s.pubsubUnregisterChat,
  setActivePubSub: s.setActivePubSub
});

function NavBar(props: Props) {
  const {
    activePubSub,
    autoConnect,
    connectedPubSubs,
    connectionStatus,
    pubsubRegisterChat,
    pubsubUnregisterChat,
    setActivePubSub
  } = useStore(getStateVals, shallow);

  const hasTargetMaps = !!connectedPubSubs.size;
  const isConnected = SocketStatus.Connected === connectionStatus;
  const isConnecting = SocketStatus.Connecting === connectionStatus;

  const isActive = (conn: PubSubConnectionResponse) => activePubSub?.pubsub.connectTarget === conn.pubsub.connectTarget;

  const noTargetsView = <NoConnectedTargetsNavItem isConnected={isConnected} />;

  const pubSubNavItems = useMemo(
    () =>
      [...connectedPubSubs.values()].map(pubSubConn => (
        <ConnectedTargetNavItem
          key={pubSubConn.pubsub.connectTarget}
          targetClassMap={pubSubConn.pubsub}
          reSubEventCategories={pubsubRegisterChat}
          unregisterPubSub={pubsubUnregisterChat}
          onClick={() => setActivePubSub(pubSubConn)}
          className={isActive(pubSubConn) ? 'active' : ''}
        />
      )),
    [connectedPubSubs, activePubSub]
  );

  const {
    classes: { NavBarContainer, ScrollAreaContainer }
  } = StyledNavBar();

  return (
    <Navbar {...props} className={NavBarContainer}>
      <Navbar.Section>
        <Group position="right">
          <PubSubConfig />
          <SimulatorModal />
          <InfoModal />
        </Group>
      </Navbar.Section>

      <Navbar.Section grow className={ScrollAreaContainer}>
        {hasTargetMaps ? pubSubNavItems : noTargetsView}
      </Navbar.Section>

      <Navbar.Section>
        <PubSubRegisterPanel disabled={!isConnected} pubSubRegister={pubsubRegisterChat} />
      </Navbar.Section>
    </Navbar>
  );
}

export default React.memo(NavBar);
