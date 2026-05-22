// Browser-side GitHub publish for admin overrides.
// The PAT lives in admin's localStorage only — it never goes to a server.

const PAT_KEY = 'admin:githubPat:v1';
const REPO_KEY = 'admin:githubRepo:v1';
const DEFAULT_REPO = 'galaa3313/trader-book';
const FILE_PATH = 'public/admin-overrides.json';

export function getPat(): string {
  try { return localStorage.getItem(PAT_KEY) || ''; } catch { return ''; }
}
export function setPat(pat: string) {
  try {
    if (pat) localStorage.setItem(PAT_KEY, pat);
    else localStorage.removeItem(PAT_KEY);
  } catch {}
}
export function getRepo(): string {
  try { return localStorage.getItem(REPO_KEY) || DEFAULT_REPO; } catch { return DEFAULT_REPO; }
}
export function setRepo(repo: string) {
  try {
    if (repo) localStorage.setItem(REPO_KEY, repo);
    else localStorage.removeItem(REPO_KEY);
  } catch {}
}

// Unicode-safe base64 (atob/btoa choke on multi-byte chars like Mongolian).
function b64encodeUtf8(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

type PublishResult =
  | { ok: true; commitSha: string; commitUrl: string }
  | { ok: false; error: string };

export async function publishOverridesViaGitHub(json: string): Promise<PublishResult> {
  const pat = getPat();
  const repo = getRepo();
  if (!pat) return { ok: false, error: 'GitHub token тохируулаагүй байна' };
  if (!repo.includes('/')) return { ok: false, error: 'Repo формат "owner/name" байх ёстой' };

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${pat}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // 1. Fetch current SHA (404 OK if file doesn't exist yet)
  let sha: string | undefined;
  try {
    const r = await fetch(apiUrl + '?ref=main', { headers });
    if (r.status === 200) {
      const j = await r.json();
      sha = j.sha;
    } else if (r.status !== 404) {
      const t = await r.text();
      return { ok: false, error: `GET алдаа ${r.status}: ${t.slice(0, 200)}` };
    }
  } catch (e: any) {
    return { ok: false, error: `Сүлжээ алдаа: ${e.message || e}` };
  }

  // 2. PUT new content
  try {
    const body: any = {
      message: 'admin: update overrides',
      content: b64encodeUtf8(json),
      branch: 'main',
    };
    if (sha) body.sha = sha;
    const r = await fetch(apiUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!r.ok) {
      const t = await r.text();
      return { ok: false, error: `PUT алдаа ${r.status}: ${t.slice(0, 300)}` };
    }
    const j = await r.json();
    return {
      ok: true,
      commitSha: j.commit?.sha || '',
      commitUrl: j.commit?.html_url || `https://github.com/${repo}`,
    };
  } catch (e: any) {
    return { ok: false, error: `PUT алдаа: ${e.message || e}` };
  }
}
