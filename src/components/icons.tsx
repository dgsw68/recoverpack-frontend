/**
 * 앱 전역에서 쓰는 라인 아이콘 세트. 이모지 대신 사용해 톤을 일관되게 유지한다.
 * 스타일: 24x24 viewBox, stroke=currentColor, strokeWidth=1.8, round cap/join.
 */
import type { SVGProps } from "react";

function Base(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function FloodIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M3 17c1.2 1 2.2 1 3.4 0 1.2-1 2.2-1 3.4 0 1.2 1 2.2 1 3.4 0 1.2-1 2.2-1 3.4 0 1.2 1 2.2 1 3.4 0" />
      <path d="M3 12c1.2 1 2.2 1 3.4 0 1.2-1 2.2-1 3.4 0 1.2 1 2.2 1 3.4 0 1.2-1 2.2-1 3.4 0 1.2 1 2.2 1 3.4 0" />
      <path d="M12 3c-2 2.2-3 3.9-3 5.3A3 3 0 0 0 12 11a3 3 0 0 0 3-2.7C15 6.9 14 5.2 12 3Z" />
    </Base>
  );
}

export function FireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 3c1 2.5-.5 3.8-1.7 5.2C9 9.6 8 11 8 13a4 4 0 0 0 8 0c0-1.4-.5-2.3-1.3-3.3.6 1.8.1 3-1 3.6-.2-1.6-1-2.3-2-3.1-.7 1-1 1.8-1 2.8a1.7 1.7 0 0 0 3.4 0" />
      <path d="M8.3 15.5A4 4 0 0 0 12 20a4 4 0 0 0 3.7-4.5" />
    </Base>
  );
}

export function SnowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5" />
      <path d="M12 6 10 8m2-2 2 2M8.3 9 6 9.8m2.3-.8-1 2.2M15.7 9 18 9.8m-2.3-.8 1 2.2M8.3 15l-1 2.2M8.3 15 6 14.2m9.7.8 1 2.2m-1-2.2 2.3-.8" />
    </Base>
  );
}

export function TyphoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 8h11a3 3 0 1 0-2.8-4" />
      <path d="M3 12h14a3 3 0 1 1-2.8 4" />
      <path d="M6 16h9a3 3 0 1 1-2.5 4.6" />
    </Base>
  );
}

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h4l2 2h7A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-11Z" />
    </Base>
  );
}

export function EditNoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M14 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V10" />
      <path d="M9 12h5M9 15.5h3.5" />
      <path d="M14.5 11.5 20 6l-2-2-5.5 5.5-.7 2.7z" />
    </Base>
  );
}

export function TimelineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Base>
  );
}

export function PackageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
      <path d="M4 8l8 4.5L20 8M12 12.5V21" />
    </Base>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.2M12 8.3v.1" />
    </Base>
  );
}

export function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M12 3.5 21 19.5H3L12 3.5Z" />
      <path d="M12 10v4.2M12 16.8v.1" />
    </Base>
  );
}

export function SuccessIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.3 12.2l2.5 2.5 5-5.2" />
    </Base>
  );
}

export function FilePdfIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4" />
      <path d="M9.5 16.5v-3.8M9.5 12.7h1a1 1 0 1 1 0 2h-1M13.2 16.5v-3.8h1.3M13.2 14.6h1M17 16.5v-3.8h1.6" />
    </Base>
  );
}

export function FileSheetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4" />
      <path d="M9.3 12.7h6.4M9.3 15.3h6.4M12.5 12.7v5.5" />
    </Base>
  );
}

export function FileCsvIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4" />
      <path d="M9.5 13.3a1.4 1.4 0 0 0-2.5.9v1a1.4 1.4 0 0 0 2.5.9M13.3 13h-1a1 1 0 0 0 0 2h.5a1 1 0 0 1 0 2h-1.1M15.8 12.9l1 4 1-4" />
    </Base>
  );
}

export function FileTextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4" />
      <path d="M9.5 12.8h5M9.5 15.2h5M9.5 17.6h3" />
    </Base>
  );
}

export function ImageFileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4" />
      <circle cx="11" cy="13.3" r="1.1" />
      <path d="M9 17.5l2.3-2.5 1.6 1.7 1.4-1.6 2 2.4" />
    </Base>
  );
}
