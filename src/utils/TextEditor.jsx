import { CKEditor } from "ckeditor4-react";
import React, { useState } from "react";
import { useEffect } from "react";

const FullTextEditor = ({
  value,
  setValue,
  EditTable,
  setEditTable,
  clear,
}) => {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (editor && editor?.status === "ready" && EditTable) {
      editor.setData(value ? value : "");
    }
  }, [value, EditTable, editor]);

  useEffect(() => {
    if (clear) {
      editor.setData("");
    }
  }, [clear]);

  // const onInstanceReady = (evt) => {
  //   const readyEditor = evt.editor;
  //   setEditor(readyEditor);
  //   if (EditTable && value) {
  //     readyEditor.setData(value);
  //   }
  // };
  const onInstanceReady = (evt) => {
    const readyEditor = evt.editor;
    setEditor(readyEditor);

    const body = readyEditor.document && readyEditor.document.getBody();
    if (body) {
      body.setStyle("font-family", "Times New Roman");
      body.setStyle("font-size", "18px");
    }

    if (EditTable && value) {
      readyEditor.setData(value);
    }
  };


  // const onChange = (evt) => {
  //   setEditTable(false);
  //   var newContent = evt?.editor?.getData();
  //   setValue(newContent);
  // };

 const onChange = (evt) => {
  setEditTable(false);
  let newContent = evt?.editor?.getData();
  const hasFont = /font-(size|family)/.test(newContent);
  const hasSpanOrStyle = /style=[^>]*font/.test(newContent);
  if (!hasFont && !hasSpanOrStyle) {
    newContent = `<div style="font-size:18px; font-family:'Times New Roman', Times, serif;">${newContent}</div>`;
  }

  setValue(newContent); // now this styled content goes to the API
};


  const editorConfig = {
    contentsCss: ["/ckeditor-custom.css"], 
    bodyClass: "editor-content",

    font_defaultLabel: "Times New Roman",
    fontSize_defaultLabel: "18px",

    table_defaultAttributes: {
      style: "width:800px",
    },
    table_defaultStyles: {
      width: "800px",
    },
    extraPlugins:
      "basicstyles, image2, embed, autoembed, widget,clipboard, lineutils, dialog, dialogui, scayt, notification, toolbar, resize, justify, colorbutton, find, templates, colordialog, newpage, save, print, preview, pastefromword, pagebreak, font,stylescombo,uploadimage",
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
        items: ["Bold", "Italic", "Underline"],
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
    height: 250,
    enterMode: 2,
  };

  return (
    <div>
      <CKEditor
        initData={value ? value : ""}
        onChange={onChange}
        onInstanceReady={onInstanceReady}
        config={editorConfig}
      />
    </div>
  );
};

export default FullTextEditor;
