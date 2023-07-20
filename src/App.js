import "./App.css";
import { useEffect } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";

//following the steps @ https://prosemirror.net/docs/guide

function App() {
  useEffect(() => {
    //this being react we have to wrap everthing inside useEffect
    let state = EditorState.create({
      schema,
      //plugins extend the behvaior of the editor
      //here we add history and configure keybinds for undo/redoing changes
      plugins: [history(), keymap({ "Mod-z": undo, "Mod-y": redo })],
    });
    let view = new EditorView(document.querySelector("#editor"), {
      state,
      dispatchTransaction(transaction) {
        //interactions with the editor generate 'state transactions'
        //document isn't just modified in place, the 'state' of the editor gets updated too
        //this function hooks into transactions so we can see the size of content in the editor
        //by default it starts out at 2? not sure why yet.
        console.log(
          "Document size went from",
          transaction.before.content.size,
          "to",
          transaction.doc.content.size
        );
        let newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });
  }, []);

  return (
    <div className="App">
      <div id="editor">
        <div id="content"></div>
      </div>
    </div>
  );
}

export default App;
