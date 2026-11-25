import { CKEditor } from "ckeditor4-react";
import React, { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  STYLES – injected into the editor iframe
// ─────────────────────────────────────────────────────────────
const PREVIEW_EDITOR_CSS = `
  body {
    margin: 0 !important;
    padding: 28px !important;
    background: linear-gradient(180deg, #eef6ff 0%, #f8fbff 40%, #f4f7fb 100%) !important;
    font-family: Cambria, "Times New Roman", serif !important;
    font-size: 16px !important;
    color: #1f2937 !important;
  }

  .ai-rendered-content {
    max-width: 880px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #dbe4f0;
    border-radius: 24px;
    padding: 36px 42px;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.10);
  }

  /* ── Headings ── */
  .ai-rendered-content h1 {
    margin: 0 0 24px;
    font-size: 30px;
    line-height: 1.2;
    font-weight: 700;
    color: #0f172a;
    text-align: center;
    padding-bottom: 16px;
    border-bottom: 3px solid #0f766e;
  }

  .ai-rendered-content h2 {
    margin: 28px 0 12px;
    font-size: 22px;
    line-height: 1.3;
    font-weight: 700;
    color: #0f766e;
    padding-bottom: 8px;
    border-bottom: 1px solid #cfe3f5;
  }

  .ai-rendered-content h3 {
    margin: 22px 0 10px;
    font-size: 18px;
    line-height: 1.4;
    font-weight: 700;
    color: #1d4ed8;
  }

  /* ── Body text ── */
  .ai-rendered-content p {
    margin: 0 0 14px;
    font-size: 16px;
    line-height: 1.85;
    color: #334155;
  }

  .ai-rendered-content ul,
  .ai-rendered-content ol {
    margin: 0 0 18px;
    padding-left: 24px;
  }

  .ai-rendered-content li {
    margin-bottom: 10px;
    line-height: 1.8;
    color: #334155;
  }

  .ai-rendered-content strong {
    color: #0f172a;
    font-weight: 700;
  }

  .ai-rendered-content em {
    color: #475569;
  }

  .ai-rendered-content code {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 14px;
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
  }

  .ai-rendered-content hr {
    border: none;
    height: 1px;
    margin: 24px 0;
    background: linear-gradient(90deg, #99f6e4, #60a5fa);
  }

  /* ── 3-Column Details Grid ── */
  .ai-rendered-content .basic-details-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 24px;
    margin: 0 0 24px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #f0fdfa, #eff6ff);
    border: 1px solid #dbe4f0;
    border-radius: 16px;
  }

  .ai-rendered-content .basic-details-row .detail-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
  }

  .ai-rendered-content .basic-details-row .detail-item .detail-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #0f766e;
    margin-bottom: 2px;
  }

  .ai-rendered-content .basic-details-row .detail-item .detail-value {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.4;
    word-break: break-word;
  }

  /* ── Section Label ── */
  .ai-rendered-content .ai-section-label {
    display: block;
    margin: 20px 0 10px;
    padding: 12px 14px;
    border-left: 4px solid #0f766e;
    border-radius: 0;
    background: linear-gradient(135deg, #f0fdfa, #eff6ff);
    color: #0f172a;
    font-size: 15px;
    font-weight: 700;
  }

  /* ── Tables ── */
  .ai-rendered-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    overflow: hidden;
    border-radius: 16px;
  }

  .ai-rendered-content th,
  .ai-rendered-content td {
    border: 1px solid #dbe4f0;
    padding: 12px 14px;
    text-align: left;
    vertical-align: top;
  }

  .ai-rendered-content th {
    background: #eff6ff;
    color: #0f172a;
    font-weight: 700;
  }

  /* ── Blockquote ── */
  .ai-rendered-content blockquote {
    margin: 18px 0;
    padding: 14px 18px;
    border-left: 4px solid #2563eb;
    background: #f8fbff;
    border-radius: 12px;
    color: #334155;
  }
`;

// ─────────────────────────────────────────────────────────────
//  EDITOR CONFIGURATION
// ─────────────────────────────────────────────────────────────
const EDITOR_CONFIG = {
  contentsCss: ["/NewCkeditor/ckeditor/contents.css"],
  bodyClass: "editor-content",
  font_defaultLabel: "Times New Roman",
  fontSize_defaultLabel: "16px",
  allowedContent: true,
  extraAllowedContent:
    "div(*)[*]{*}; span(*)[*]{*}; p(*)[*]{*}; table(*)[*]{*}; thead tbody tr th td(*)[*]{*}",
  table_defaultAttributes: { style: "width:100%" },
  table_defaultStyles: { width: "100%" },
  extraPlugins:
    "lineheight,tableresize,basicstyles,image2,embed,autoembed,widget,clipboard,lineutils,dialog,dialogui,scayt,notification,toolbar,resize,justify,colorbutton,find,templates,colordialog,newpage,save,print,preview,pastefromword,pagebreak,font,stylescombo,uploadimage",
  removePlugins: "forms",
  toolbar: [
    {
      name: "document",
      items: ["Source", "Save", "NewPage", "Preview", "Print", "Templates"],
    },
    {
      name: "clipboard",
      items: [
        "Cut",
        "Copy",
        "Paste",
        "PasteText",
        "PasteFromWord",
        "Undo",
        "Redo",
      ],
    },
    { name: "editing", items: ["Find", "Replace", "SelectAll", "Scayt"] },
    "/",
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "Subscript", "Superscript"],
    },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "Outdent",
        "Indent",
        "Blockquote",
        "CreateDiv",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
        "JustifyBlock",
        "BidiLtr",
        "BidiRtl",
        "Language",
        "lineheight",
      ],
    },
    { name: "links", items: ["Link", "Unlink", "Anchor"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    {
      name: "insert",
      items: [
        "Image",
        "Table",
        "HorizontalRule",
        "Smiley",
        "SpecialChar",
        "PageBreak",
        "Iframe",
        "Embed",
      ],
    },
    "/",
    { name: "styles", items: ["Styles", "Format", "Font", "FontSize"] },
    { name: "tools", items: ["Maximize", "ShowBlocks"] },
    { name: "others", items: ["-"] },
  ],
  colorButton_colors:
    "000,800000,8B0000,FF0000,FFA500,FFD700,008000,00FF00,000080,0000FF,800080,FF00FF",
  colorButton_enableMore: true,
  colorButton_backColors:
    "FFFFCC,FFCC99,FF9999,99CCFF,CCFFFF,CCFFCC,FFFF99,CC99FF",
  height: 420,
  enterMode: 2,
  line_height: ".5;.75;1;1.15;1.25;1.5;1.75;2;2.5;3",
};

// ─────────────────────────────────────────────────────────────
//  UTILITY: Build 3-column details grid
// ─────────────────────────────────────────────────────────────
export const buildBasicDetailsRow = (fields = []) => {
  const items = fields
    .map(
      ({ label, value }) => `
      <div class="detail-item">
        <span class="detail-label">${label}</span>
        <span class="detail-value">${value || "—"}</span>
      </div>`,
    )
    .join("");
  return `<div class="basic-details-row">${items}</div>`;
};

// ─────────────────────────────────────────────────────────────
//  UTILITY: Escape HTML for plain-text fallback
// ─────────────────────────────────────────────────────────────
const escapeHtml = (content = "") =>
  String(content)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// ─────────────────────────────────────────────────────────────
//  UTILITY: Wrap raw content in styled container
// ─────────────────────────────────────────────────────────────
const sanitizeContent = (content) => {
  if (!content || typeof content !== "string") {
    return '<div class="ai-rendered-content"><p></p></div>';
  }

  const trimmed = content.trim();

  if (!trimmed) {
    return '<div class="ai-rendered-content"><p></p></div>';
  }

  // Already wrapped – return as-is
  if (trimmed.includes("ai-rendered-content")) {
    return trimmed;
  }

  // Contains HTML – wrap it
  if (/<[a-z][\\s\\S]*>/i.test(trimmed)) {
    return `<div class="ai-rendered-content">${trimmed}</div>`;
  }

  // Plain text – escape and wrap
  return `<div class="ai-rendered-content"><p>${escapeHtml(trimmed).replace(/\\n/g, "<br/>")}</p></div>`;
};

// ─────────────────────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────────────────────
const FullTextSummaryEditor = ({
  value,
  setValue,
  EditTable,
  setEditTable,
  clear,
}) => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const lastEditorData = useRef("");

  // ── Inject custom CSS into editor iframe ──
  const injectEditorStyles = useCallback((instance) => {
    try {
      const doc = instance?.document?.$;
      const head = doc?.head;

      if (!doc || !head || head.querySelector("#ai-preview-editor-styles")) {
        return;
      }

      const styleTag = doc.createElement("style");
      styleTag.id = "ai-preview-editor-styles";
      styleTag.type = "text/css";
      styleTag.appendChild(doc.createTextNode(PREVIEW_EDITOR_CSS));
      head.appendChild(styleTag);
    } catch (err) {
      console.warn("[CKEditor] Style injection failed:", err);
    }
  }, []);

  // ── Apply body styles ──
  const applyBodyStyles = useCallback((instance) => {
    try {
      const body = instance.document?.getBody();
      if (body) {
        body.setStyle("font-family", "Cambria, Times New Roman, serif");
        body.setStyle("font-size", "16px");
        body.setStyle("background", "#eef6ff");
        body.setStyle("padding", "28px");
      }
    } catch (err) {
      console.warn("[CKEditor] Body style application failed:", err);
    }
  }, []);

  // ── Clear editor when `clear` prop changes ──
  useEffect(() => {
    if (clear && editorRef.current) {
      editorRef.current.setData("");
      setValue("");
      lastEditorData.current = "";
    }
  }, [clear, setValue]);

  // ── Sync external value into editor (when EditTable mode) ──
  useEffect(() => {
    if (editorInstance?.status === "ready" && EditTable) {
      const safeContent = sanitizeContent(value);

      if (safeContent !== lastEditorData.current) {
        // Defer to avoid race conditions during render
        requestAnimationFrame(() => {
          try {
            editorInstance.setData(safeContent);
            lastEditorData.current = safeContent;
          } catch (err) {
            console.error("[CKEditor] setData failed:", err);
            editorInstance.setData("");
          }
        });
      }
    }
  }, [value, EditTable, editorInstance]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (editorInstance && !editorInstance.isDestroyed()) {
        editorInstance.destroy(true);
      }
    };
  }, [editorInstance]);

  // ── Editor ready handler ──
  const onInstanceReady = useCallback(
    (evt) => {
      const readyEditor = evt.editor;
      editorRef.current = readyEditor;
      setEditorInstance(readyEditor);

      injectEditorStyles(readyEditor);
      applyBodyStyles(readyEditor);

      const safeContent = sanitizeContent(value);
      readyEditor.setData(safeContent);
      lastEditorData.current = safeContent;
    },
    [value, injectEditorStyles, applyBodyStyles],
  );

  // ── Content change handler ──
  const onChange = useCallback(
    (evt) => {
      setEditTable(false);
      const newContent = evt.editor.getData();
      lastEditorData.current = newContent;
      setValue(newContent);
    },
    [setEditTable, setValue],
  );

  return (
    <div className="full-text-summary-editor">
      <CKEditor
        initData={value || ""}
        onChange={onChange}
        onInstanceReady={onInstanceReady}
        config={EDITOR_CONFIG}
      />
    </div>
  );
};

export default FullTextSummaryEditor;
