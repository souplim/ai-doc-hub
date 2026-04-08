const ALLOWED_FILE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
  ".txt",
  ".doc",
  ".docx",
]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export const ACCEPT_ATTRIBUTE = [...ALLOWED_FILE_EXTENSIONS].join(",");

export const formatBytes = (size: number) => {
  if (size === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1,
  );
  const value = size / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const getFileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

const getFileExtension = (fileName: string) => {
  const extensionIndex = fileName.lastIndexOf(".");

  if (extensionIndex < 0) {
    return "";
  }

  return fileName.slice(extensionIndex).toLowerCase();
};

const isAllowedFile = (file: File) => {
  const extension = getFileExtension(file.name);

  return (
    ALLOWED_FILE_EXTENSIONS.has(extension) ||
    ALLOWED_MIME_TYPES.has(file.type.toLowerCase())
  );
};

export const mergeSelectedFiles = (
  currentFiles: File[],
  incomingFiles: File[],
) => {
  const mergedFiles = [...currentFiles];
  const existingFileKeys = new Set(currentFiles.map(getFileKey));

  incomingFiles.forEach((file) => {
    const fileKey = getFileKey(file);

    if (existingFileKeys.has(fileKey)) {
      return;
    }

    existingFileKeys.add(fileKey);
    mergedFiles.push(file);
  });

  return mergedFiles;
};

export const splitFilesByValidation = (files: File[]) => {
  const validFiles: File[] = [];
  const invalidFiles: File[] = [];

  files.forEach((file) => {
    if (isAllowedFile(file)) {
      validFiles.push(file);
      return;
    }

    invalidFiles.push(file);
  });

  return { validFiles, invalidFiles };
};
