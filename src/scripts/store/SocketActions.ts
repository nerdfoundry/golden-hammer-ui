import type {
  AdministrationEventData,
  EventClassifications,
  MonetizationEventData,
  PubSubConnectionResponse
} from 'golden-hammer-shared';
import type { IStore, StatMap, UINormalizedMessagingEvent } from '.';

const MAX_COUNT_EVENTS = 1000;

export const registerPubSub = (state: IStore, pubSubConnection: PubSubConnectionResponse) => {
  //Enforce lowercase name for store
  pubSubConnection.pubsub.connectTarget = pubSubConnection.pubsub.connectTarget.toLowerCase();

  let {
    pubsub: { connectTarget }
  } = pubSubConnection;

  return {
    activePubSub: pubSubConnection,
    connectedPubSubs: new Map(state.connectedPubSubs).set(connectTarget, pubSubConnection),
    stats: {
      ...state.stats,
      [connectTarget]: state.stats[connectTarget] || {}
    },
    events: {
      ...state.events,
      [connectTarget]: state.events[connectTarget] || []
    }
  };
};

export const unregisterPubSub = (state: IStore, pubSubConnection: PubSubConnectionResponse) => {
  //Enforce lowercase name for store
  pubSubConnection.pubsub.connectTarget = pubSubConnection.pubsub.connectTarget.toLowerCase();

  const newMap = new Map(state.connectedPubSubs);
  newMap.delete(pubSubConnection.pubsub.connectTarget);

  return {
    ...state,
    connectedPubSubs: newMap,
    activePubSub: null
  };
};

export function processSocketEvent(state: IStore, normalizedEvent: UINormalizedMessagingEvent) {
  let newEventMap = ringBufferEvents(state.events, normalizedEvent);
  newEventMap = filterAdminEvents(newEventMap, normalizedEvent);
  const newStatsMap = addStats(state.stats, normalizedEvent);

  return {
    ...state,

    stats: {
      ...newStatsMap
    },
    events: {
      ...newEventMap
    }
  };
}

function addStats(state: IStore['stats'], normalizedEvent: UINormalizedMessagingEvent) {
  const { category, subCategory } = normalizedEvent.eventClassification;
  const fqcn = `${category}.${subCategory}` as EventClassifications;

  const connectTarget = normalizedEvent.connectTarget.toLowerCase();
  const prevStats = state[connectTarget];

  const statMap: StatMap = {
    ...prevStats,
    TotalEvents: Number(prevStats['TotalEvents'] || 0) + 1,
    [category]: Number(prevStats[category] || 0) + 1,
    [fqcn]: Number(prevStats[fqcn] || 0) + 1
  };

  // Track monetization totals for UI display purposes
  if ('Monetization' === category && 'submysterygift' === normalizedEvent.platform.eventName) {
    statMap['Earnings'] =
      Number(statMap['Earnings'] || 0) + (normalizedEvent.eventData as MonetizationEventData).estimatedValue!;
  }

  return {
    ...state,
    [connectTarget]: statMap
  };
}

function ringBufferEvents(state: IStore['events'], normalizedEvent: UINormalizedMessagingEvent) {
  const newEventList = [...state[normalizedEvent.connectTarget], normalizedEvent];

  if (newEventList.length > MAX_COUNT_EVENTS) {
    newEventList.shift();
  }

  return {
    ...state,
    [normalizedEvent.connectTarget]: newEventList
  };
}

function filterAdminEvents(eventMap: IStore['events'], normalizedEvent: UINormalizedMessagingEvent) {
  if ('Administration' !== normalizedEvent.eventClassification.category) {
    return eventMap;
  }

  const filteredEvents = eventMap[normalizedEvent.connectTarget].map(prevEvent => {
    const data = normalizedEvent.eventData as AdministrationEventData;

    if ('Message' !== prevEvent.eventClassification.subCategory) {
      return prevEvent;
    }

    // Determines if the target type is a user, if we're not trying to remove a specific message
    const targetTypeUser = 'MessageRemoval' !== normalizedEvent.eventClassification.subCategory;
    // Note the different array access (1 v 0), as well as sub-member ID
    const testTargetId = targetTypeUser
      ? prevEvent.platform.eventData[0]['user-id']
      : prevEvent.platform.eventData[0]['id'];

    prevEvent.isRemoved = testTargetId === data.targetId;
    return prevEvent;
  });

  return {
    ...eventMap,
    [normalizedEvent.connectTarget]: filteredEvents
  };
}