import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export type RichTextEditorRef = {
  saveCursorPosition: () => void;
  restoreCursorPosition: () => void;
};

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange }, ref) => {
    const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
    const cursorPositionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Find the textarea after rendering the editor
    useEffect(() => {
      if (previewMode === "edit") {
        const textarea = document.querySelector<HTMLTextAreaElement>('textarea#content');
        if (textarea) {
          textareaRef.current = textarea;
        }
      }
    }, [previewMode]);

    // Restore cursor position when switching back to edit mode
    useEffect(() => {
      if (previewMode === "edit" && textareaRef.current) {
        const { start, end } = cursorPositionRef.current;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, end);
      }
    }, [previewMode]);

    useImperativeHandle(ref, () => ({
      saveCursorPosition: () => {
        if (textareaRef.current) {
          cursorPositionRef.current = {
            start: textareaRef.current.selectionStart,
            end: textareaRef.current.selectionEnd,
          };
        }
      },
      restoreCursorPosition: () => {
        if (textareaRef.current) {
          const { start, end } = cursorPositionRef.current;
          textareaRef.current.setSelectionRange(start, end);
          textareaRef.current.focus();
        }
      },
    }));

    const handleToggle = () => {
      if (previewMode === "edit" && textareaRef.current) {
        cursorPositionRef.current = {
          start: textareaRef.current.selectionStart,
          end: textareaRef.current.selectionEnd,
        };
      }
      setPreviewMode((prev) => (prev === "edit" ? "preview" : "edit"));
    };

    return (
      <div className="w-full rounded border p-4" data-color-mode="light">
        <div className="mb-2">
          <button
            type="button"
            className="rounded border bg-gray-200 px-3 py-1 text-sm text-gray-800"
            onClick={handleToggle}
          >
            {previewMode === "edit" ? "Preview" : "Close Preview"}
          </button>
        </div>
        {previewMode === "preview" ? (
          <div data-test-id="content-preview">
            <MDEditor.Markdown source={value || " "} className="custom-preview" />
          </div>
        ) : (
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || "")}
            height={400}
            preview="edit"
            textareaProps={{
              id: "content",
              name: "content",
            }}
            visibleDragbar={false}
          />
        )}
      </div>
    );
  }
);

export default RichTextEditor;