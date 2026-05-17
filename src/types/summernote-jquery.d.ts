/// <reference types="jquery" />

interface JQuery {
  summernote(options?: Record<string, unknown>): JQuery;
  summernote(command: "destroy"): JQuery;
  summernote(command: "code"): string;
  summernote(command: "code", html: string): JQuery;
  summernote(command: "insertImage", url: string): JQuery;
}
