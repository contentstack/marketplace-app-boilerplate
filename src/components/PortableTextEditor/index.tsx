import React from "react";
import {
  defineSchema,
  EditorEventListener,
  EditorProvider,
  keyGenerator,
  PortableTextBlock,
  PortableTextChild,
  PortableTextEditable,
  RenderAnnotationFunction,
  RenderBlockFunction,
  RenderChildFunction,
  RenderDecoratorFunction,
  RenderStyleFunction,
  useEditor,
  useEditorSelector,
} from "@portabletext/editor";
// import * as selectors from "@portabletext/editor/selectors";
import { useState } from "react";
import "./editor.css";

// Define the schema for the editor
// All options are optional
// Only the `name` property is required, but you can define a `title` and an `icon` as well
// You can use this schema definition later to build your toolbar
const schemaDefinition = defineSchema({
  // Decorators are simple marks that don't hold any data
  decorators: [{ name: "strong" }, { name: "em" }, { name: "underline" }],
  // Annotations are more complex marks that can hold data
  annotations: [
    { name: "link" },

    // GUSTO CUSTOM FIELDS
    {
      name: "Kale",
      value: "kale",
    },
    {
      name: "Guava",
      value: "guava",
    },
    {
      name: "Cursive",
      value: "cursive",
    },
    {
      name: "Monospace",
      value: "monospace",
    },
  ],
  // Styles apply to entire text blocks
  // There's always a 'normal' style that can be considered the paragraph style
  styles: [{ name: "Paragraph" }, { name: "h1" }, { name: "h2" }, { name: "h3" }, { name: "blockquote" }],
  // Lists apply to entire text blocks as well
  lists: [{ name: "bullet" }, { name: "number" }],
  // Inline objects hold arbitrary data that can be inserted into the text
  inlineObjects: [{ name: "stock-ticker" }],
  // Block objects hold arbitrary data that live side-by-side with text blocks
  blockObjects: [{ name: "image" }],
});

type Props = {
  initialValue: string;
  onChange: (value: string) => void;
};

function GustoRichTextEditor({ initialValue, onChange }: Props) {
  const [value, setValue] = useState<Array<PortableTextBlock> | undefined>(
    () => initialValue && JSON.parse(initialValue)
  );

  return (
    <div
      style={{
        border: "1px solid lightgray",
        // minHeight: "100%",
        padding: "0.5em",
        borderRadius: 8,
      }}>
      <EditorProvider initialConfig={{ initialValue: value, schemaDefinition }}>
        {/* Subscribe to editor changes */}
        <EditorEventListener
          on={(event) => {
            if (event.type === "mutation") {
              setValue(event.value);
              onChange(JSON.stringify(event.value, null, 2));
            }
          }}
        />
        {/* Toolbar needs to be rendered inside the `EditorProvider` component */}
        <Toolbar />
        {/* Component that controls the actual rendering of the editor */}
        <PortableTextEditable
          style={{
            borderTop: "1px solid lightgray",
            paddingBottom: "1.25em",
            paddingTop: "1.25em",
            paddingLeft: "0.5em",
            paddingRight: "0.5em",
            minHeight: "300px",
          }}
          // Control how decorators are rendered
          renderDecorator={renderDecorator}
          // Control how annotations are rendered
          renderAnnotation={renderAnnotation}
          // Required to render block objects but also to make `renderStyle` take effect
          renderBlock={renderBlock}
          // Control how styles are rendered
          renderStyle={renderStyle}
          // Control how inline objects are rendered
          renderChild={renderChild}
          // Rendering lists is harder and most likely requires a fair amount of CSS
          // First, return the children like here
          // Next, look in the imported `editor.css` file to see how list styles are implemented
          renderListItem={({ children }: { children: React.ReactNode }) => <>{children}</>}
        />
      </EditorProvider>
      {/* Useful for debugging */}
      {/* <pre style={{ border: "1px dashed black", padding: "0.5em" }}>
        {JSON.stringify(value, null, 2)}
      </pre> */}
    </div>
  );
}

const renderDecorator: RenderDecoratorFunction = (props) => {
  if (props.value === "strong") {
    return <strong>{props.children}</strong>;
  }
  if (props.value === "em") {
    return <em>{props.children}</em>;
  }
  if (props.value === "underline") {
    return <u>{props.children}</u>;
  }
  return <>{props.children}</>;
};

const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    return <span style={{ textDecoration: "underline" }}>{props.children}</span>;
  }
  if (props.schemaType.name === "Kale") {
    return <span style={{ color: "green" }}>{props.children}</span>;
  }
  if (props.schemaType.name === "Guava") {
    return <span style={{ color: "red" }}>{props.children}</span>;
  }
  if (props.schemaType.name === "Cursive") {
    return <span style={{ fontFamily: "cursive" }}>{props.children}</span>;
  }
  if (props.schemaType.name === "Monospace") {
    return <span style={{ fontFamily: "Monospace" }}>{props.children}</span>;
  }

  return <>{props.children}</>;
};

const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === "image" && isImage(props.value)) {
    return (
      <div
        style={{
          border: "1px dotted grey",
          padding: "0.25em",
          marginBlockEnd: "0.25em",
        }}>
        IMG: {props.value.src}
      </div>
    );
  }

  return <div style={{ marginBlockEnd: "0.25em" }}>{props.children}</div>;
};

function isImage(props: PortableTextBlock): props is PortableTextBlock & { src: string } {
  return "src" in props;
}

const renderStyle: RenderStyleFunction = (props) => {
  if (props.schemaType.value === "h1") {
    return <h1>{props.children}</h1>;
  }
  if (props.schemaType.value === "h2") {
    return <h2>{props.children}</h2>;
  }
  if (props.schemaType.value === "h3") {
    return <h3>{props.children}</h3>;
  }
  if (props.schemaType.value === "blockquote") {
    return <blockquote>{props.children}</blockquote>;
  }
  return <>{props.children}</>;
};

const renderChild: RenderChildFunction = (props) => {
  return <>{props.children}</>;
};

function Toolbar() {
  const decoratorButtons = schemaDefinition.decorators.map((decorator) => (
    <DecoratorButton key={decorator.name} decorator={decorator.name} />
  ));

  const annotationButtons = schemaDefinition.annotations.map((annotation) => (
    <AnnotationButton key={annotation.name} annotation={annotation} />
  ));

  const styleButtons = schemaDefinition.styles.map((style) => <StyleButton key={style.name} style={style.name} />);

  const listButtons = schemaDefinition.lists.map((list) => <ListButton key={list.name} list={list.name} />);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        marginBottom: 8,
      }}>
      {styleButtons}
      {decoratorButtons}
      {listButtons}
      {annotationButtons}
      {/* {imageButton} */}
    </div>
  );
}

function DecoratorButton(props: { decorator: string }) {
  // Obtain the editor instance
  const editor = useEditor();
  // Check if the decorator is active using a selector
  // const active = useEditorSelector(editor, selectors.isActiveDecorator(props.decorator));
  const active = false;

  return (
    <button
      style={{
        background: active ? "rgba(211, 211, 211, 0.592)" : "unset",
      }}
      onClick={() => {
        // Toggle the decorator
        editor.send({
          type: "decorator.toggle",
          decorator: props.decorator,
        });
        // Pressing this button steals focus so let's focus the editor again
        editor.send({ type: "focus" });
      }}>
      {props.decorator}
    </button>
  );
}

function AnnotationButton(props: { annotation: { name: string } }) {
  const editor = useEditor();
  // const active = useEditorSelector(editor, selectors.isActiveAnnotation(props.annotation.name));
  const active = false;

  return (
    <button
      style={{
        background: active ? "rgba(211, 211, 211, 0.592)" : "unset",
      }}
      onClick={() => {
        editor.send({
          type: "annotation.toggle",
          annotation: {
            name: props.annotation.name,
            value: props.annotation.name === "link" ? { href: "https://example.com" } : {},
          },
        });
        editor.send({ type: "focus" });
      }}>
      {props.annotation.name}
    </button>
  );
}

function StyleButton(props: { style: string }) {
  const editor = useEditor();
  // const active = useEditorSelector(editor, selectors.isActiveStyle(props.style));
  const active = false;

  return (
    <button
      style={{
        background: active ? "rgba(211, 211, 211, 0.592)" : "unset",
      }}
      onClick={() => {
        editor.send({ type: "style.toggle", style: props.style });
        editor.send({ type: "focus" });
      }}>
      {props.style}
    </button>
  );
}

function ListButton(props: { list: string }) {
  const editor = useEditor();
  // const active = useEditorSelector(editor, selectors.isActiveListItem(props.list));
  const active = false;

  return (
    <button
      style={{
        background: active ? "rgba(211, 211, 211, 0.592)" : "unset",
      }}
      onClick={() => {
        editor.send({
          type: "list item.toggle",
          listItem: props.list,
        });
        editor.send({ type: "focus" });
      }}>
      {props.list}
    </button>
  );
}

export default GustoRichTextEditor;
