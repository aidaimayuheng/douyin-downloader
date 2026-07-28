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
 * 尝试将输入规范化为合法 URL。
 * - 纯域名路径（如 `v.douyin.com/xxx`）自动补全 `https://` 前缀
 * - 已经是 http(s) 的直接返回
 * - 其他情况返回 null
 */
export const normalizeUrl = (input: string): string | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 已经是完整 URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // 看起来像域名开头的路径（如 v.douyin.com/xxx）
  if (/^[\w.-]+\.\w+/.test(trimmed)) {
    const withProto = `https://${trimmed}`;
    try {
      new URL(withProto);
      return withProto;
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
