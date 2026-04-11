export const EMU_PER_MM = 36000;
export const A4_PAGE_WIDTH_EMU = 210 * EMU_PER_MM;
export const A4_PAGE_HEIGHT_EMU = 297 * EMU_PER_MM;

interface ResolvePdfPageSizeEmuInput {
    heightEmu?: number | null;
    rotation?: number | null;
    widthEmu?: number | null;
}

interface CalculatePdfStampPositionInput {
    marginEmu: number;
    pageHeightEmu: number;
    pageWidthEmu: number;
    stampHeightEmu: number;
    stampWidthEmu: number;
}

function isLandscapeRotation(rotation?: number | null) {
    if (rotation == null) {
        return false;
    }

    const normalizedRotation = Math.abs(rotation) % 360;

    return normalizedRotation === 90 || normalizedRotation === 270;
}

export function resolvePdfPageSizeEmu(input: ResolvePdfPageSizeEmuInput) {
    const widthEmu = input.widthEmu ?? A4_PAGE_WIDTH_EMU;
    const heightEmu = input.heightEmu ?? A4_PAGE_HEIGHT_EMU;

    if (isLandscapeRotation(input.rotation)) {
        return {
            heightEmu: widthEmu,
            widthEmu: heightEmu,
        };
    }

    return {
        heightEmu,
        widthEmu,
    };
}

export function calculatePdfStampPosition(input: CalculatePdfStampPositionInput) {
    return {
        x: Math.max(0, input.pageWidthEmu - input.stampWidthEmu - input.marginEmu),
        y: Math.max(0, input.pageHeightEmu - input.stampHeightEmu - input.marginEmu),
    };
}
