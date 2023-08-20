import { databases } from "@/appwrite";
import { getTodosGroupedByColumns } from "@/lib/getTodosGroupedByColumns";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  // updateTodosOrderInDB: (todos: Todo[], columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  searchString: "",
  setSearchString: (searchString) => {
    set({ searchString });
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumns();
    // setting the global state with the board
    set({ board });
  },

  setBoardState: (board) => {
    set({ board });
  },

  updateTodoInDB: async (todo, columnId) => {
    const { $id, title } = todo;
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      $id,
      {
        title,
        status: columnId,
      }
    );
  },

  // remember the order of the todos in each column and update the database to reflect this order when a todo is moved to a different column or reordered in the same column
  // updateTodosOrderInDB: async (todos, columnId) => {
  //   // sort todos by order
  //   const todosWithOrder = todos.sort((a, b) => {
  //     return a.order! - b.order!;
  //   });

  //   console.log("todosWithOrder", todosWithOrder);

  //   // update the database with the new order of the todos and their new column id
  //   await Promise.all(
  //     todosWithOrder.map(async (todo) => {
  //       const { $id, title, order } = todo;
  //       await databases.updateDocument(
  //         process.env.NEXT_PUBLIC_DATABASE_ID!,
  //         process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  //         $id,
  //         {
  //           title,
  //           status: columnId,
  //           order,
  //         }
  //       );
  //     })
  //   );
  // },
}));
