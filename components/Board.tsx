"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  // pulling several values from the store at once
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  // function to handle the drag and drop
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // if there is no destination, return
    if (!destination) return;

    // if the type of the draggable is column
    if (type === "column") {
      // create a new array of the columns
      const entries = Array.from(board.columns.entries());
      // remove the column from the source index
      const [removed] = entries.splice(source.index, 1);
      // insert the removed column at the destination index
      entries.splice(destination.index, 0, removed);
      // create a new map of the rearranged columns
      const rearrangedColumns = new Map(entries);
      // update the board with the new columns
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    // This step is needed as the indexes are stored as numbers 0,1,.2 etc. instead of id's in DND library
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // dragging within the same column
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = { ...startCol, todos: newTodos };
      const newColumns = new Map(board.columns);
      newColumns.set(newCol.id, newCol);
      console.log("newCol", newCol);
      console.log("newColumns", newColumns);
      console.log("newTodos", newTodos);

      setBoardState({ ...board, columns: newColumns });
      console.log("board", board);
    } else {
      // dragging from one column to another
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newFinishColumns = new Map(board.columns);
      const newFinishCol = { ...finishCol, todos: finishTodos };
      newFinishColumns.set(newFinishCol.id, newFinishCol);

      // update in the database
      console.log("finishCol", finishCol);
      console.log("newFinishCol", newFinishCol);
      console.log("newFinishColumns", newFinishColumns);
      console.log("todoMoved", todoMoved);
      console.log("newFinishCol.id", newFinishCol.id);
      console.log("finishTodos", finishTodos);

      updateTodoInDB(todoMoved, newFinishCol.id);

      setBoardState({ ...board, columns: newFinishColumns });
      console.log("board", board);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {/* rendering all the columns */}

            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
