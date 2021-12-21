import {mixColor} from "@alt1/base";
import * as a1lib from "@alt1/base";

export const DEBUG_COLORS = {
    WHITE: mixColor(255, 255, 255),
    PINK: mixColor(255, 0, 255),
    CYAN: mixColor(0, 255, 255)
}

export const debugOverlayRect = (color, x = 0, y = 0, width = 1, height = 1) => {
    alt1.overLayRect(color, x, y, width, height, 3000, 1);
}

export const debugOverlayRectLike = (color, rectLike: a1lib.RectLike) => {
    const {x, y, width, height} = rectLike;
    debugOverlayRect(color, x, y, width, height);
}