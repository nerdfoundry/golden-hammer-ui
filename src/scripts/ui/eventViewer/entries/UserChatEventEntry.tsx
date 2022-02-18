import { UserChatEventData } from '-/store/PubSubMessaging';
import React from 'react';
import { EntryViewProps } from '../panel/EventEntryFactory';

const buildMessageChunk = (chunk: UserChatEventData.MessageBuffer) => {
  switch (chunk.type) {
    case 'word':
      return <span>{chunk.content}</span>;
    case 'uri':
      return (
        <a href={chunk.content} target="_blank">
          {chunk.content}
        </a>
      );
    case 'emote':
      return <img src={chunk.meta.uri} />;
  }
};

export default function UserChatEventEntry({ normalizedEvent }: EntryViewProps) {
  const data: UserChatEventData = normalizedEvent.eventData as UserChatEventData;

  const prefix = <span className="userName">{data.userName}:</span>;

  switch (normalizedEvent.eventClassification.subCategory) {
    case 'Presence':
      return (
        <>
          {prefix} {data.presence}ed the Chat.
        </>
      );
    case 'Message':
      const children = data.messageBuffers.map(buildMessageChunk).reduce((c, chunkChild, idx, arr) => {
        c.push(chunkChild);

        if (idx <= arr.length) {
          c.push(<span>&nbsp;</span>);
        }

        return c;
      }, []);

      return (
        <>
          {prefix} {children}
        </>
      );
  }
}