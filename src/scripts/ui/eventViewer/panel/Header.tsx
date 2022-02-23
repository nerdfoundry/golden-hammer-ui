import useStore, { IStore } from '-/store';
import { StyledEventViewer } from '-/styles/eventViewer';
import EventTypesSelector from '-/ui/_shared/EventTypesSelector';
import {
  ActionIcon,
  Anchor,
  Box,
  Collapse,
  Divider,
  Group,
  Popover,
  Title,
  Tooltip,
  useMantineTheme
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import React, { useCallback } from 'react';
import { BsFilter } from 'react-icons/bs';
import { MdLeakAdd, MdLeakRemove } from 'react-icons/md';
import shallow from 'zustand/shallow';

const ConnectTargetEventSelector = ({ eventCategories, onChangeEventCategories, titleLabel }) => (
  <Group m={3} direction="column" spacing="xs">
    <Box>{titleLabel}:</Box>
    <Divider />
    <EventTypesSelector selectedEvents={eventCategories} onChange={onChangeEventCategories} />
  </Group>
);

const getState = (s: IStore) => ({
  activePubSub: s.activePubSub,
  pubsubRegisterChat: s.pubsubRegisterChat,
  pubsubUnregisterChat: s.pubsubUnregisterChat,
  events: s.events[s.activePubSub.pubsub.connectTarget]
});

const EntryHeader = ({ desiredEventTypes, setDesiredEventTypes }) => {
  const { activePubSub, pubsubRegisterChat, pubsubUnregisterChat, events } = useStore(getState, shallow);

  const [showStatistics, setShowStatistics] = useBooleanToggle(false);
  const [showPubSubTooltip, setShowPubSubTooltip] = useBooleanToggle(false);
  const [showDesiredFilterTooltip, setShowDesiredFilterTooltip] = useBooleanToggle(false);
  const toggleToolTip_pubsub = useCallback(() => setShowPubSubTooltip(!showPubSubTooltip), []);
  const toggleToolTip_desired = useCallback(() => setShowDesiredFilterTooltip(!showDesiredFilterTooltip), []);

  const onPubSubChange = _eventCategories => pubsubRegisterChat({ connectTarget, eventCategories: _eventCategories });
  const onUnregister = useCallback(() => pubsubUnregisterChat(connectTarget), []);

  const {
    pubsub: { platformName, connectTarget, eventCategories }
  } = activePubSub;

  const colors = useMantineTheme().other.Platforms[platformName];
  const { classes: cssClasses } = StyledEventViewer(colors);

  return (
    <Group grow direction="column" className={`${cssClasses.PanelHeader}`}>
      <Group>
        <Title order={4}>
          <Anchor href={`https://twitch.tv/${connectTarget}`} target="_blank">
            {connectTarget}
          </Anchor>
        </Title>

        <Group className="options">
          <Popover
            opened={showDesiredFilterTooltip}
            onClose={() => setShowDesiredFilterTooltip(false)}
            withArrow
            arrowSize={4}
            position="bottom"
            placement="end"
            width={250}
            target={
              <ActionIcon onClick={toggleToolTip_desired} variant="filled">
                <BsFilter />
              </ActionIcon>
            }
          >
            <ConnectTargetEventSelector
              titleLabel="Filter which Events to See"
              onChangeEventCategories={setDesiredEventTypes}
              eventCategories={desiredEventTypes}
            />
          </Popover>

          <Popover
            opened={showPubSubTooltip}
            onClose={() => setShowPubSubTooltip(false)}
            withArrow
            arrowSize={4}
            position="bottom"
            placement="end"
            width={250}
            target={
              <ActionIcon onClick={toggleToolTip_pubsub} variant="filled">
                <MdLeakAdd />
              </ActionIcon>
            }
          >
            <ConnectTargetEventSelector
              titleLabel="Modify which Events to Subscribe to"
              onChangeEventCategories={onPubSubChange}
              eventCategories={eventCategories}
            />
          </Popover>

          <Tooltip withArrow arrowSize={4} position="left" label="Unregister">
            <ActionIcon variant="filled" color="red" onClick={onUnregister}>
              <MdLeakRemove />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <div className="statsThumb" onClick={() => setShowStatistics(s => !s)}>
        <Collapse
          className="stats-container"
          in={showStatistics}
          transitionDuration={1000}
          transitionTimingFunction="linear"
        >
          <span># Events: {events.length}</span>
        </Collapse>
      </div>
    </Group>
  );
};

export default React.memo(EntryHeader);
