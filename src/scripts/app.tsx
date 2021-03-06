import { AppShell } from '@mantine/core';
import React, { useEffect, type ReactElement } from 'react';
import shallow from 'zustand/shallow';
import useStore, { GHPubSub_EventTypes, type IStore } from './store';
import EventViewerContainer from './ui/eventViewer/EventViewerContainer';
import Header from './ui/header';
import Navbar from './ui/navbar';

let u = new URLSearchParams(globalThis.location.search);
const connectTargets = u.getAll('connectTargets') || [];

const getState = (s: IStore) => ({
  connect: s.connect,
  autoConnect: s.autoConnect,
  pubSubUri: s.pubSubUri,
  pubsubRegisterChat: s.pubsubRegisterChat
});

export default function App(): ReactElement {
  const { connect, autoConnect, pubSubUri, pubsubRegisterChat } = useStore(getState, shallow);

  // Only autoconnect on startup!
  useEffect(() => {
    if (autoConnect) {
      connect(pubSubUri);

      connectTargets.forEach(connectTarget => {
        pubsubRegisterChat({ connectTarget, eventClassifications: [...GHPubSub_EventTypes] });
      });
    }
  }, []);

  return (
    <AppShell padding="md" navbar={<Navbar width={{ base: 400 }} p="md" />} header={<Header height={75} p="sm" />}>
      <EventViewerContainer />
    </AppShell>
  );
}
