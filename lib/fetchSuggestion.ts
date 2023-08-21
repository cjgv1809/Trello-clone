import formatTodosForOpenAI from "./formatTodosForOpenAI";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForOpenAI(board);

  const response = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      todos,
    }),
  });

  const data = await response.json();

  const { content } = data;

  return content;
};

export default fetchSuggestion;
