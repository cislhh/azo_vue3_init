interface ResolveOnlyOfficeDocumentUrlOptions {
    currentOrigin?: string;
    devAccessHost?: string;
    documentUrl: string;
    fileAccessHost?: string;
}

function isLoopbackHostname(hostname: string) {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

function applyAccessHost(baseUrl: URL, accessHost: string) {
    const normalizedAccessHost = accessHost.includes('://')
        ? new URL(accessHost)
        : new URL(`${baseUrl.protocol}//${accessHost}`);

    baseUrl.protocol = normalizedAccessHost.protocol;
    baseUrl.hostname = normalizedAccessHost.hostname;

    if (normalizedAccessHost.port) {
        baseUrl.port = normalizedAccessHost.port;
    }

    return baseUrl.toString();
}

export function resolveOnlyOfficeDocumentUrl(options: ResolveOnlyOfficeDocumentUrlOptions) {
    if (!options.currentOrigin) {
        return options.documentUrl;
    }

    const resolvedUrl = new URL(options.documentUrl, options.currentOrigin);
    const currentOriginUrl = new URL(options.currentOrigin);

    if (isLoopbackHostname(currentOriginUrl.hostname) && options.devAccessHost) {
        return applyAccessHost(resolvedUrl, options.devAccessHost);
    }

    if (options.fileAccessHost) {
        return applyAccessHost(resolvedUrl, options.fileAccessHost);
    }

    if (!isLoopbackHostname(currentOriginUrl.hostname)) {
        return resolvedUrl.toString();
    }

    return resolvedUrl.toString();
}
