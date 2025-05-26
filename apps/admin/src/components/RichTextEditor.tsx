import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { marked } from "marked";

//Defining what info our rich text editor requires
type RichTextEditorProps = {
  value: string; // The content of the editor
  onChange: (value: string) => void; // Calls when text changes
};

//This parent component saves where the cursor is in the text
//And puts the cursor back in same place when preview is closed
export type RichTextEditorRef = {
  saveCursorPosition: () => void;
  restoreCursorPosition: () => void;
};
//Creates text editor that can talk to parent component
const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange }, ref) => { //Value is what ive written, onChange tells postform I've changed the text
    //Grabs textbox on screen, the useref here is used to store textarea element
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    //Remembers where cursor is in text box
    const cursorPositionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
    //State to show or hide preview
    //UseState is used here to store the state of the preview
    const [showPreview, setShowPreview] = useState(false);

    //Creates channel between this and postform component, and defines what commands parent can use in this connection 
    useImperativeHandle(ref, () => ({
      //Called when postform saves cursor positon
      saveCursorPosition: () => {
        //Checks if textArea elements actually exists
        if (textareaRef.current) {
          //Storage container for cursor postion and finds current value of that container
          cursorPositionRef.current = {
            //Tells us character postions where text selection starts
            start: textareaRef.current.selectionStart,
            //Tells us character postions where text selection ends
            end: textareaRef.current.selectionEnd,
          };
        }
      },
      
      //Defines function that postform calls
      restoreCursorPosition: () => {
        //Checks if textArea elements actually exists
        if (textareaRef.current) {
          //Gets the start and end of the cursor position from the storage container
          const { start, end } = cursorPositionRef.current;
          textareaRef.current.setSelectionRange(start, end);
          textareaRef.current.focus();
        }
      },
    }));

    const togglePreview = () => {
      if (!showPreview) {
        // Save cursor position before showing preview
        if (textareaRef.current) {
          cursorPositionRef.current = {
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          };
        }
      }
      setShowPreview(!showPreview);

      if (showPreview) {
        // Restore cursor position and focus after closing preview
        setTimeout(() => {
          if (textareaRef.current) {
            const { start, end } = cursorPositionRef.current;
            textareaRef.current.setSelectionRange(start, end);
            textareaRef.current.focus();
          }
        }, 0);
      }
    };

    const formatText = (tag: string, attributes?: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = value.substring(start, end);

      const before = value.substring(0, start);
      const after = value.substring(end);

      // For strikethrough, use Markdown syntax instead of HTML tag
      if (tag === "s") {
        const formattedText = `${before}~~${selectedText}~~${after}`;
        onChange(formattedText);

        setTimeout(() => {
          textareaRef.current?.setSelectionRange(start + 2, end + 2);
        }, 0);
        return;
      }

      // For color formatting, use HTML span with style attribute
      if (tag === "span" && attributes) {
        const formattedText = `${before}<${tag} ${attributes}>${selectedText}</${tag}>${after}`;
        onChange(formattedText);

        setTimeout(() => {
          const totalAddedChars = tag.length + attributes.length + 3;
          textareaRef.current?.setSelectionRange(start + totalAddedChars, end + totalAddedChars);
        }, 0);
        return;
      }

      const formattedText = `${before}<${tag}>${selectedText}</${tag}>${after}`;
      onChange(formattedText);

      setTimeout(() => {
        textareaRef.current?.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
      }, 0);
    };

    const changeTextColor = (color: string) => {
      formatText("span", `style="color: ${color}"`);
    };

    return (
      <div className="w-full rounded border p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => formatText("b")}
              className="mr-2 rounded bg-gray-200 px-3 py-1"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => formatText("i")}
              className="mr-2 rounded bg-gray-200 px-3 py-1"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => formatText("u")}
              className="mr-2 rounded bg-gray-200 px-3 py-1"
            >
              Underline
            </button>
            <button
              type="button"
              onClick={() => formatText("s")}
              className="mr-2 rounded bg-gray-200 px-3 py-1"
            >
              Strikethrough
            </button>
            <div className="relative inline-block">
              <button
                type="button"
                className="rounded bg-gray-200 px-3 py-1 flex items-center gap-1"
                onClick={() => document.getElementById("colorpicker")?.click()}
              >
                Color
                <input
                  type="color"
                  id="colorpicker"
                  onChange={(e) => changeTextColor(e.target.value)}
                  className="absolute opacity-0 h-0 w-0"
                />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={togglePreview}
            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-800"
          >
            {showPreview ? "Close Preview" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div
            data-test-id="content-preview"
            className="min-h-[200px] w-full rounded border bg-white p-4"
            dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            id="content"
            name="content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            className="w-full rounded border p-2"
          ></textarea>
        )}
      </div>
    );
  }
);

export default RichTextEditor;