export const SITE_NAME = "Evermote";
export const SITE_VERSION = "0.1.0";
export const SITE_DESCRIPTION =
  "Evermote is an experimental, open-source personal-agent starter with resumable threads, approval-gated planning, optional scoped memory, and read-only research.";
export const GITHUB_URL = "https://github.com/Bosheng2020/evermote";
export const SOCIAL_IMAGE_ALT =
  "Evermote — an open-source personal agent with inspectable boundaries";

const LOCAL_SITE_URL = "http://localhost:3000";

function withProtocol(value: string): string {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
}

function resolveSiteUrl(): URL {
  const configuredUrl = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]
    .map((value) => value?.trim())
    .find((value): value is string => value !== undefined && value.length > 0);

  if (configuredUrl === undefined) {
    return new URL(LOCAL_SITE_URL);
  }

  try {
    const url = new URL(withProtocol(configuredUrl));
    const hasSupportedProtocol = url.protocol === "http:" || url.protocol === "https:";
    const hasCredentials = url.username.length > 0 || url.password.length > 0;
    const hasOnlyOrigin =
      (url.pathname === "" || url.pathname === "/") &&
      url.search.length === 0 &&
      url.hash.length === 0;

    if (!hasSupportedProtocol || url.hostname.length === 0 || hasCredentials || !hasOnlyOrigin) {
      throw new TypeError("The configured site URL must be a credential-free HTTP(S) origin.");
    }

    url.pathname = "/";
    return url;
  } catch (error) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL must be a valid, credential-free HTTP(S) origin without a path, query, or fragment.",
      { cause: error },
    );
  }
}

export const SITE_URL = resolveSiteUrl();

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

export function webApplicationJsonLd() {
  return {
    "@id": `${absoluteUrl("/")}#software`,
    "@type": "WebApplication",
    applicationCategory: "UtilitiesApplication",
    browserRequirements: "Requires JavaScript and a modern web browser",
    description: SITE_DESCRIPTION,
    featureList: [
      "Resumable agent conversations",
      "Approval-gated current-thread planning",
      "Explicit, scoped profile memory when storage and identity are configured",
      "Read-only public-web research",
      "User-visible tool and approval states",
    ],
    license: `${GITHUB_URL}/blob/main/LICENSE`,
    name: SITE_NAME,
    operatingSystem: "Any operating system with a modern web browser",
    sameAs: [GITHUB_URL],
    softwareVersion: SITE_VERSION,
    url: absoluteUrl("/"),
  };
}

export function softwareSourceCodeJsonLd() {
  return {
    "@id": `${GITHUB_URL}#source`,
    "@type": "SoftwareSourceCode",
    codeRepository: GITHUB_URL,
    description: SITE_DESCRIPTION,
    license: `${GITHUB_URL}/blob/main/LICENSE`,
    name: `${SITE_NAME} source code`,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js 24",
    targetProduct: { "@id": `${absoluteUrl("/")}#software` },
    version: SITE_VERSION,
  };
}
