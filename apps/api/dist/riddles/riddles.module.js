"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiddlesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const riddle_entity_1 = require("./riddle.entity");
const hint_entity_1 = require("../hints/hint.entity");
const riddles_service_1 = require("./riddles.service");
const riddles_controller_1 = require("./riddles.controller");
let RiddlesModule = class RiddlesModule {
};
exports.RiddlesModule = RiddlesModule;
exports.RiddlesModule = RiddlesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([riddle_entity_1.Riddle, hint_entity_1.Hint]),
        ],
        providers: [riddles_service_1.RiddlesService],
        controllers: [riddles_controller_1.RiddlesController],
        exports: [riddles_service_1.RiddlesService, typeorm_1.TypeOrmModule],
    })
], RiddlesModule);
//# sourceMappingURL=riddles.module.js.map