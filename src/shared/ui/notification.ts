import type { NotificationType } from 'naive-ui';
import { createDiscreteApi } from 'naive-ui';

interface NotifyOptions {
    content: string
    meta?: string
    duration?: number
}

const { notification } = createDiscreteApi(['notification']);

function notify(type: NotificationType, options: NotifyOptions) {
    notification[type]({
        content: options.content,
        meta: options.meta,
        duration: options.duration ?? 2500,
        keepAliveOnHover: true,
    });
}

export function notifyError(content: string, meta?: string) {
    notify('error', { content, meta });
}

export function notifyWarning(content: string, meta?: string) {
    notify('warning', { content, meta });
}
