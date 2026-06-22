type DragEntry = {
  isDirectory: boolean;
};

type DragItemWithEntry = DataTransferItem & {
  webkitGetAsEntry?: () => DragEntry | null;
};

export const isDirectoryItem = (item: DataTransferItem) => {
  const entry = (item as DragItemWithEntry).webkitGetAsEntry?.();
  return entry?.isDirectory ?? false;
};
