import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { marked } from "marked";

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
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const cursorPositionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
    const [showPreview, setShowPreview] = useState(false);

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

    const formatText = (tag: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = value.substring(start, end);

      const before = value.substring(0, start);
      const after = value.substring(end);

      const formattedText = `${before}<${tag}>${selectedText}</${tag}>${after}`;
      onChange(formattedText);

      setTimeout(() => {
        textareaRef.current?.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
      }, 0);
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
              className="rounded bg-gray-200 px-3 py-1"
            >
              Underline
            </button>
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