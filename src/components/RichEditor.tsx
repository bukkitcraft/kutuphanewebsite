"use client";

import { loadSummernoteLite } from "@/lib/summernote-loader";
import { useEffect, useRef, useState } from "react";

export function RichEditor({
  value,
  onChange,
  placeholder = "Yazmaya başlayın..."
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const focusedRef = useRef(false);
  const valueRef = useRef(value);
  const [editorReady, setEditorReady] = useState(false);

  onChangeRef.current = onChange;
  valueRef.current = value;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let cancelled = false;

    void loadSummernoteLite().then(($) => {
      if (cancelled || !el.isConnected) return;

      const $host = $(el);
      $host.summernote({
        height: 360,
        placeholder,
        dialogsInBody: true,
        disableDragAndDrop: false,
        tabsize: 2,
        fontNames: [
          "Arial",
          "Arial Black",
          "Comic Sans MS",
          "Courier New",
          "Georgia",
          "Helvetica",
          "Impact",
          "Tahoma",
          "Times New Roman",
          "Trebuchet MS",
          "Verdana",
          "Roboto"
        ],
        toolbar: [
          ["style", ["style"]],
          [
            "font",
            ["bold", "italic", "underline", "strikethrough", "superscript", "subscript", "clear"]
          ],
          ["fontname", ["fontname"]],
          ["fontsize", ["fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["height", ["height"]],
          ["table", ["table"]],
          ["insert", ["link", "picture", "hr"]],
          ["view", ["fullscreen", "codeview", "undo", "redo", "help"]]
        ],
        popover: {
          image: [
            ["imagesize", ["imageSize100", "imageSize50", "imageSize25"]],
            ["float", ["floatLeft", "floatRight", "floatNone"]],
            ["remove", ["removeMedia"]]
          ],
          link: [["link", ["linkDialogShow", "unlink"]]],
          table: [
            ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
            ["delete", ["deleteRow", "deleteCol", "deleteTable"]]
          ],
          air: [["color", ["color"]], ["font", ["bold", "underline", "clear"]]]
        },
        callbacks: {
          onChange(html: string) {
            onChangeRef.current(html);
          },
          onFocus() {
            focusedRef.current = true;
          },
          onBlur() {
            focusedRef.current = false;
          },
          onImageUpload(files: unknown) {
            const list = Array.isArray(files)
              ? files
              : files && typeof (files as FileList).length === "number"
                ? Array.from(files as FileList)
                : [];
            void (async () => {
              for (const file of list) {
                if (!(file instanceof File)) continue;
                const body = new FormData();
                body.append("file", file);
                try {
                  const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body,
                    credentials: "include"
                  });
                  if (!res.ok) continue;
                  const data = (await res.json()) as { url?: string };
                  if (data.url) {
                    $host.summernote("insertImage", data.url);
                  }
                } catch {
                  /* yükleme başarısız */
                }
              }
            })();
          }
        }
      });

      const initial = valueRef.current?.trim() ? valueRef.current : "<p><br></p>";
      $host.summernote("code", initial);
      if (!cancelled && el.isConnected) {
        setEditorReady(true);
      }
    });

    return () => {
      cancelled = true;
      setEditorReady(false);
      const $ = (window as Window & { jQuery?: JQueryStatic }).jQuery;
      if ($?.fn && typeof ($.fn as { summernote?: unknown }).summernote === "function") {
        try {
          $(el).summernote("destroy");
        } catch {
          /* yok edildi */
        }
      }
    };
  }, [placeholder]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !editorReady || focusedRef.current) return;

    const $ = (window as Window & { jQuery?: JQueryStatic }).jQuery;
    if (!$?.fn || typeof ($.fn as { summernote?: unknown }).summernote !== "function") {
      return;
    }

    try {
      const $host = $(el);
      const current = $host.summernote("code") as string;
      const next = value?.trim() ? value : "<p><br></p>";
      if (current !== next) {
        $host.summernote("code", next);
      }
    } catch {
      /* editor henuz hazir degil */
    }
  }, [value, editorReady]);

  return <div ref={hostRef} className="summernote-root" />;
}
