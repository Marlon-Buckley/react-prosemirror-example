import React, { useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser, Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { undo, redo } from "prosemirror-history";
import { history } from "prosemirror-history";

import "./App.css";

const customKeys = {
  "Mod-z": undo,
  "Shift-Mod-z": redo, // mac
  "Mod-y": redo, // windows
};

function App() {
  const [editorView, setEditorView] = useState(null);

  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
      marks: schema.spec.marks,
    });

    const view = new EditorView(document.querySelector("#editor"), {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(
          document.querySelector("#content")
        ),
        plugins: [keymap({ ...customKeys, ...baseKeymap }), history()],
      }),
    });

    setEditorView(view);

    return () => {
      view.destroy();
    };
  }, []);

  const copySelection = (state, dispatch) => {
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to, "\n");
    navigator.clipboard.writeText(selectedText);
  };

  const pasteSelection = async (state, dispatch) => {
    const textToPaste = await navigator.clipboard.readText();
    const dispatchPaste = state.tr.replaceSelectionWith(
      state.schema.text(textToPaste)
    );
    dispatch(dispatchPaste);
  };

  return (
    <div className="App">
      <div className="menu">
        <button
          onClick={() => copySelection(editorView.state, editorView.dispatch)}
        >
          Copy
        </button>
        <button
          onClick={() => pasteSelection(editorView.state, editorView.dispatch)}
        >
          Paste
        </button>
      </div>
      <div id="editor" />
      <div id="content" />
    </div>
  );
}

export default App;
