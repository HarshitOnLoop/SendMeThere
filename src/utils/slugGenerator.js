import { customAlphabet } from 'nanoid';

// URL-safe, readable characters only — no confusing 0/O or 1/l
const nanoid = customAlphabet('abcdefghjkmnpqrstuvwxyz23456789', 6);

/** Generate a random 6-char short slug */
export function generateSlug() {
  return nanoid();
}

/** Validate a user-defined custom slug */
export function validateSlug(slug) {
  if (!slug) return { valid: false, error: 'Slug cannot be empty.' };
  if (slug.length < 3) return { valid: false, error: 'Slug must be at least 3 characters.' };
  if (slug.length > 40) return { valid: false, error: 'Slug must be 40 characters or less.' };
  if (!/^[a-zA-Z0-9-]+$/.test(slug))
    return { valid: false, error: 'Only letters, numbers, and hyphens allowed.' };
  if (slug.startsWith('-') || slug.endsWith('-'))
    return { valid: false, error: 'Slug cannot start or end with a hyphen.' };
  // Reserved paths
  const reserved = ['open', 'api', 'favicon', 'assets', 'index'];
  if (reserved.includes(slug.toLowerCase()))
    return { valid: false, error: `"${slug}" is a reserved path. Choose another.` };
  return { valid: true };
}
