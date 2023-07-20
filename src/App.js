import "./App.css";
import { useEffect } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

//following the steps @ https://prosemirror.net/docs/guide

function App() {
  useEffect(() => {
    //this being react we have to wrap everthing inside useEffect
    let doc = schema.node("doc", null, [
      schema.node("paragraph", null, [schema.text("One.")]),
      schema.node("horizontal_rule"),
      schema.node("paragraph", null, [schema.text("Two!")]),
    ]);

    let state = EditorState.create({
      schema,
      doc: doc, //passing in doc to set the initial state of the editor
      /*
        plugins extend the behvaior of the editor
        here we add history and configure keybinds for undo/redoing changes
        we also include the baseKeymap, this gives editor expected behaviour 
        for things like enter, delete etc, Prosemirror calls these 'commands'

      */
      plugins: [
        history(),
        keymap({ "Mod-z": undo, "Mod-y": redo }),
        keymap(baseKeymap),
      ],
    });
    let view = new EditorView(document.querySelector("#editor"), {
      state,
      dispatchTransaction(transaction) {
        /* 
        interactions with the editor generate 'state transactions'
        document isn't just modified in place, the 'state' of the editor gets updated too
        this function hooks into transactions so we can see the size of content in the editor
        by default it starts out at 2? not sure why yet.
        */
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
