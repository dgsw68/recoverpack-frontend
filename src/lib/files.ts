import { uid } from "./storage";
import type { FileCategory, UploadedFile } from "./types";

/**
 * 업로드된 File 객체를 localStorage 저장용 UploadedFile 메타데이터로 변환합니다.
 * 이미지는 canvas로 축소한 썸네일(data URL)만 저장해 용량을 아낍니다.
 */

const MAX_THUMB = 480; // px

function guessCategory(file: File): FileCategory {
  const name = file.name.toLowerCase();
  if (/(영수증|receipt)/.test(name)) return "receipt";
  if (/(견적|estimate|quote)/.test(name)) return "estimate";
  if (/(재난|문자|alert|sms)/.test(name)) return "disaster_alert";
  return "image";
}

async function makeThumbnail(file: File): Promise<string | undefined> {
  if (!file.type.startsWith("image/")) return undefined;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });

    const scale = Math.min(1, MAX_THUMB / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.72);
  } catch {
    // 축소 실패 시 원본 data URL 사용
    return dataUrl;
  }
}

export async function fileToUploadedFile(file: File): Promise<UploadedFile> {
  const isImage = file.type.startsWith("image/");
  const previewUrl = await makeThumbnail(file);
  return {
    id: uid("file"),
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    fileType: guessCategory(file),
    file,
    previewUrl,
    isImage,
    createdAt: new Date().toISOString(),
  };
}

export async function filesToUploadedFiles(
  files: FileList | File[],
): Promise<UploadedFile[]> {
  const arr = Array.from(files);
  return Promise.all(arr.map(fileToUploadedFile));
}
