"use client";

import { Editor } from "@tinymce/tinymce-react";

interface TinyEditorProps {
  value?: string;
  id?: string;
  onChange: (content: string) => void;
}

export function TinyEditor({ value, onChange, id }: TinyEditorProps) {
  return (
    <Editor
      id={id}
      tinymceScriptSrc="/tinymce/tinymce.js"
      value={value}
      onEditorChange={onChange}
      init={{
        promotion: false,
        min_height: 500,
        autoresize_bottom_margin: 150,
        content_style:
          "@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap')",
        plugins:
          "autoresize preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion",
        menubar: "file edit view insert format tools table help",
        toolbar:
          "undo redo | basicTitle titleWithImage | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | print | pagebreak anchor codesample | ltr rtl",
        quickbars_selection_toolbar:
          "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
        toolbar_mode: "wrap",
        contextmenu: "link image table",
        language: "pt_BR",
        language_url: "/langs/pt_BR.cjs",
        skin: "oxide",
        content_css: "default",
        file_picker_types: "image",
      }}
    />
  );
}
