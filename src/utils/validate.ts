/** 抖音域名列表 */
const DOUYIN_DOMAINS = [
  "douyin.com",
  "iesdouyin.com",
];

/** 检查是否为抖音链接 */
export const isDouyinUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    const host = url.hostname;
    return DOUYIN_DOMAINS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
};

/**
 * 规范化抖音链接：
 * - `jingxuan?modal_id=XXX` → `/video/XXX`
 * - `discover?modal_id=XXX` → `/video/XXX`
 * - 其他带有 `modal_id` 参数的页面 → `/video/XXX`
 */
export const normalizeDouyinUrl = (urlStr: string): string => {
  try {
    const url = new URL(urlStr);
    if (!isDouyinUrl(urlStr)) return urlStr;

    // 已经是 /video/ 或 /note/ 格式，无需转换
    if (/^\/(video|note)\/\d+/.test(url.pathname)) return urlStr;

    // 从 modal_id 参数提取视频 ID
    const modalId = url.searchParams.get("modal_id");
    if (modalId && /^\d+$/.test(modalId)) {
      return `https://${url.hostname}/video/${modalId}`;
    }

    return urlStr;
  } catch {
    return urlStr;
  }
};

/**
 * 尝试将输入规范化为合法 URL。
 * - 纯域名路径（如 `v.douyin.com/xxx`）自动补全 `https://` 前缀
 * - 抖音非标准链接自动转换为 yt-dlp 可识别的格式
 * - 已经是 http(s) 的直接返回
 * - 其他情况返回 null
 */
export const normalizeUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 已经是完整 URL
  if (/^https?:\/\//i.test(trimmed)) {
    return normalizeDouyinUrl(trimmed);
  }

  // 看起来像域名开头的路径（如 v.douyin.com/xxx）
  if (/^[\w.-]+\.\w+/.test(trimmed)) {
    const withProto = `https://${trimmed}`;
    try {
      new URL(withProto);
      return normalizeDouyinUrl(withProto);
    } catch {
      // 不是合法 URL
    }
  }

  return null;
};

/** 检查字符串是否为有效的 URL */
export const isValidUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
