import { databases } from "@/appwrite";

export const getTodosGroupedByColumns = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      $databaseId: todo.$databaseId,
      $collectionId: todo.$collectionId,
      $permissions: todo.$permissions,
      $updatedAt: todo.$updatedAt,
      title: todo.title,
      status: todo.status,
      // order: todo.order ?? 0,
      // get the image if it exists on the todo
      ...(todo.image && {
        image: JSON.parse(todo.image),
      }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  // if columns don't have inprogress, todo or done, add them with empty todos
  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
  columnTypes.forEach((columnType) => {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  });

  // sort columns by columnTypes
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort((a, b) => {
      return columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]);
    })
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
