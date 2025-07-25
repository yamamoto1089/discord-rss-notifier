"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
const fs = __importStar(require("fs"));
const constants_1 = require("../utils/constants");
class CacheManager {
    static loadLastCheck() {
        try {
            if (fs.existsSync(constants_1.CACHE_FILE)) {
                const data = fs.readFileSync(constants_1.CACHE_FILE, "utf8");
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.log("キャッシュファイルの読み込みに失敗:", error.message);
        }
        return {};
    }
    static saveLastCheck(data) {
        try {
            fs.writeFileSync(constants_1.CACHE_FILE, JSON.stringify(data, null, 2));
        }
        catch (error) {
            console.log("キャッシュファイルの保存に失敗:", error.message);
        }
    }
}
exports.CacheManager = CacheManager;
//# sourceMappingURL=cacheManager.js.map