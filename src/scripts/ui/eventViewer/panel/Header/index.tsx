import useStore, { type IStore } from '-/scripts/store';
import { StyledEventViewer } from '-/scripts/styles/eventViewer';
import { Anchor, Group, Title, useMantineTheme } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { type EventClassifications } from 'golden-hammer-shared';
import React, { useCallback } from 'react';
import shallow from 'zustand/shallow';
import Options from './Options';
import Stats from './Stats';

const getState = (s: IStore) => ({
  activePubSub: s.activeConnectedTarget,
  clearEvents: s.clearEvents,
  pubsubRegisterChat: s.pubsubRegisterChat,
  pubsubUnregisterChat: s.pubsubUnregisterChat,
  activeEvents: s.events[s.activeConnectedTarget!.pubsub.connectTarget],
  activeStats: s.stats[s.activeConnectedTarget!.pubsub.connectTarget]
});

type EntryHeaderProps = {
  desiredEventTypes?: EventClassifications;
  setDesiredEventTypes: (types: EventClassifications) => void;
  searchTerm: string;
  setSearchTerm: (t: string) => void;
};

const EntryHeader = ({ desiredEventTypes, setDesiredEventTypes, searchTerm, setSearchTerm }: EntryHeaderProps) => {
  const { activePubSub, pubsubRegisterChat, pubsubUnregisterChat, clearEvents, activeEvents, activeStats } = useStore(
    getState,
    shallow
  );
  const [showPubSubTooltip, setShowPubSubTooltip] = useBooleanToggle(false);
  const [showDesiredFilterTooltip, setShowDesiredFilterTooltip] = useBooleanToggle(false);
  const toggleToolTip_pubsub = useCallback(() => setShowPubSubTooltip(!showPubSubTooltip), []);
  const toggleToolTip_desired = useCallback(() => setShowDesiredFilterTooltip(!showDesiredFilterTooltip), []);

  const {
    pubsub: { platformName, connectTarget, eventClassifications }
  } = activePubSub!;

  const onPubSubChange = useCallback(
    (eventClassifications: EventClassifications) => pubsubRegisterChat({ connectTarget, eventClassifications }),
    [connectTarget, eventClassifications]
  );
  const onClearEvents = useCallback(() => clearEvents(connectTarget), [connectTarget]);
  const onUnregister = useCallback(() => pubsubUnregisterChat(connectTarget), [connectTarget]);

  const colors = useMantineTheme().other.Platforms[platformName];
  const {
    classes: { PanelHeader }
  } = StyledEventViewer(colors);

  return (
    <Group grow direction="column" className={PanelHeader}>
      <Group>
        <Title order={4}>
          <Anchor href={`https://twitch.tv/${connectTarget}`} target="_blank">
            {connectTarget}
          </Anchor>
        </Title>

        <Options
          {...{
            onClearEvents,
            onPubSubChange,
            onUnregister,
            setDesiredEventTypes,
            setShowDesiredFilterTooltip,
            setShowPubSubTooltip,
            showDesiredFilterTooltip,
            showPubSubTooltip,
            toggleToolTip_desired,
            toggleToolTip_pubsub,
            searchTerm,
            setSearchTerm,
            desiredEventTypes: desiredEventTypes!,
            eventClassifications: eventClassifications!
          }}
        />
      </Group>

      <Stats events={activeEvents} stats={activeStats} />
    </Group>
  );
};

export default React.memo(EntryHeader);
