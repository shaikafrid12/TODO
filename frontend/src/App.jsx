import { useState, useEffect } from "react";
import API from "./api";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await API.get("/");
        setTodos(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
        setError("Failed to load todos. Please check if the backend is running.");
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!text) return;
    try {
      const res = await API.post("/", { text });
      setTodos([...todos, res.data]);
      setText("");
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo.");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await API.put(`/${id}`, { completed: !completed });
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling todo:", err);
      setError("Failed to update todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo.");
    }
  };

  const startEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/${id}`, { text: editText });
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Error saving edit:", err);
      setError("Failed to save edit.");
    }
  };

  // Clear all completed
  const clearCompleted = async () => {
    try {
      const res = await API.delete("/");
      setTodos(res.data);
    } catch (err) {
      console.error("Error clearing completed todos:", err);
      setError("Failed to clear completed todos.");
    }
  };

  // Apply filter
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-red-600 p-4 sm:p-6 md:p-8">
      <div className="bg-indigo-200 shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 sm:mb-6">📝 To-Do App</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="flex mb-3 sm:mb-4">
            <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 border border-gray-300 rounded-l-md px-2 py-1 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
             />
              <button
            onClick={addTodo}
            className="bg-purple-600 text-white px-3 sm:px-4 rounded-r-md hover:bg-purple-700"
          >
            Add
          </button>
          </div>

          <div className="flex justify-between mb-3 sm:mb-4">
          <div className="space-x-1 sm:space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md ${filter === "active" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md ${filter === "completed" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={clearCompleted}
            className="text-xs sm:text-sm text-red-500 hover:underline"
          >
             Clear Completed
          </button>
        </div>
         <ul className="space-y-1 sm:space-y-2">
          {filteredTodos.map(todo => (
            <li
              key={todo._id}
              className="flex items-center justify-between bg-gray-100 px-2 py-1 sm:px-3 sm:py-2 rounded-md"
            >
              {editingId === todo._id ? (
                <div className="flex w-full">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border px-1 py-0.5 sm:px-2 sm:py-1 rounded-md mr-1 sm:mr-2"
                  />
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="text-green-600 font-bold mr-1 sm:mr-2"
                  >
                    💾
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-red-500 font-bold"
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                    className={`flex-1 cursor-pointer ${todo.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                  >
                    {todo.text}
                  </span>
                  <div className="space-x-1 sm:space-x-2">
                    <button
                      onClick={() => startEdit(todo._id, todo.text)}
                      className="text-blue-500 hover:underline"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="text-red-500 hover:underline"
                    >
                      ❌
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
         <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
          {todos.filter(t => !t.completed).length} tasks left
        </div>

      </div>
    </div>
  );
}

export default App;
