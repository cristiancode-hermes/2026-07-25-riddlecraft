"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HintsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hint_entity_1 = require("./hint.entity");
const hints_service_1 = require("./hints.service");
let HintsModule = class HintsModule {
};
exports.HintsModule = HintsModule;
exports.HintsModule = HintsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hint_entity_1.Hint])],
        providers: [hints_service_1.HintsService],
        exports: [hints_service_1.HintsService, typeorm_1.TypeOrmModule],
    })
], HintsModule);
//# sourceMappingURL=hints.module.js.map