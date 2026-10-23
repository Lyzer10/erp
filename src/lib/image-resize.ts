// Shrinks product photos in the browser before upload so storage and bandwidth stay small.
export async function resizeProductImage(
  file: Blob & { name?: string },
  fileName = file.name ?? "image",
) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }
  if (file.size > 8_000_000) throw new Error("Choose an image smaller than 8 MB.");
  const source = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  const contentType = "image/webp" as const;
  const dataUrl = canvas.toDataURL(contentType, 0.82);
  if (dataUrl.length > 2_700_000) throw new Error("The compressed image is still too large.");
  return { dataUrl, fileName, contentType };
}
