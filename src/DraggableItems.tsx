import React, { useState, Dispatch, SetStateAction } from 'react';
import List from './List';
import Recorder from './Recorder';
import BoxType from './types/box';
import DraggableContainer from './DraggableContainer';

interface Props {
  boxes: Array<BoxType>;
  setBoxes: Dispatch<SetStateAction<Array<BoxType>>>;
  setDisableAll: Dispatch<SetStateAction<boolean>>;
  fullDisable?: boolean;
  socket?: SocketIOClient.Socket;
  moveCard?: (
    dragIndex: number,
    hoverIndex: number,
    listId: number,
    lists: Array<any>
  ) => void;
  lists?: any;
  setLists?: Dispatch<SetStateAction<Array<any>>>;
  updateBoxes?: (boxes: Array<BoxType>) => void;

  // current box
  box: BoxType;
}

const InternalBox = ({
  setBoxes,
  boxes,
  setDisableAll,
  fullDisable,
  box,
  moveCard,
  updateBoxes,
  socket,
}: Props) => {
  const [playingList, setPlayList] = useState(false);
  const { left, top, title, id, blobUrl, type, cards, isListItem } = box;

  const deleteBox = () => {
    const confirmed = confirm(`Are you sure you want to delete "${title}"?`);
    if (confirmed) {
      const updatedBoxes = boxes.filter((box) => box.id !== id);
      updateBoxes(updatedBoxes);
    }
  };

  const onStop = (url) => {
    const updatedBoxes = boxes.map((box) => {
      if (box.id === id) {
        return {
          ...box,
          blobUrl: url,
        };
      }

      return box;
    });

    updateBoxes(updatedBoxes);
  };

  if (type === 'list') {
    const listItems: Array<any> =
      boxes &&
      boxes.length > 0 &&
      boxes
        .filter(boxItem => {
          const listItem = cards && cards.length > 0 && cards.find((cardId) => boxItem.id === cardId);

          if (listItem || listItem === 0) {
            return true;
          }

          return false;
        }) || [];
    

    return (
      <DraggableContainer
        {...box}
        deleteBox={deleteBox}
        blobUrl={blobUrl}
        fullDisable={fullDisable}
      >
        <List
          {...box}
          setDisableAll={setDisableAll}
          fullDisable={fullDisable}
          updateBoxes={updateBoxes}
          boxes={boxes}
          listItems={listItems}
          setPlayList={setPlayList}
          playingList={playingList}
        />
      </DraggableContainer>
    );
  }

  if (isListItem) {
    return null;
  }

  // this dynamic should be consolidated within card component
  return (
    <DraggableContainer
      id={id}
      left={left}
      top={top}
      type={type}
      title={title}
      deleteBox={deleteBox}
      blobUrl={blobUrl}
      fullDisable={fullDisable}
    >
      <Recorder
        fullDisable={fullDisable}
        setDisableAll={setDisableAll}
        onStop={onStop}
        blobUrl={blobUrl}
        socket={socket}
        title={title}
      />
    </DraggableContainer>
  );
};

export default InternalBox;
