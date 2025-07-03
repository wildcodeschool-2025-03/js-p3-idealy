export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

export function validateFiles(files: File[]) {
  const validFiles: File[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`❌ Type non autorisé : ${file.name}`);
      continue;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errors.push(`❌ ${file.name} dépasse les ${MAX_FILE_SIZE_MB} Mo`);
      continue;
    }

    validFiles.push(file);
  }

  return { validFiles, errors };
}
