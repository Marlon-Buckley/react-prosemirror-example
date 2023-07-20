import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
// removed strict mode here becauase it was
// rendering two instances of the Prosemirror editor
root.render(<App />);
