"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_settings_entity_1 = require("./user-settings.entity");
let UsersService = class UsersService {
    userRepo;
    settingsRepo;
    constructor(userRepo, settingsRepo) {
        this.userRepo = userRepo;
        this.settingsRepo = settingsRepo;
    }
    async findById(id) {
        return this.userRepo.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return this.userRepo.findOne({ where: { email } });
    }
    async findByUsername(username) {
        return this.userRepo.findOne({ where: { username } });
    }
    async createUser(data) {
        const user = this.userRepo.create(data);
        const saved = await this.userRepo.save(user);
        // Create default settings
        const settings = this.settingsRepo.create({ userId: saved.id });
        await this.settingsRepo.save(settings);
        return saved;
    }
    async updateUser(id, data) {
        await this.userRepo.update(id, data);
        return this.userRepo.findOne({ where: { id } });
    }
    async addXp(id, xp) {
        const user = await this.findById(id);
        if (!user)
            throw new Error('User not found');
        user.xp += xp;
        // Check level up
        const newLevel = this.calculateLevel(user.xp);
        user.level = newLevel;
        return this.userRepo.save(user);
    }
    calculateLevel(xp) {
        let level = 1;
        while (xp >= this.xpForLevel(level + 1)) {
            level++;
        }
        return level;
    }
    xpForLevel(level) {
        return Math.round(500 * Math.pow(level, 1.5));
    }
    async getSettings(userId) {
        return this.settingsRepo.findOne({ where: { userId } });
    }
    async updateSettings(userId, data) {
        const settings = await this.settingsRepo.findOne({ where: { userId } });
        if (!settings) {
            const created = this.settingsRepo.create({ userId, ...data });
            return this.settingsRepo.save(created);
        }
        Object.assign(settings, data);
        return this.settingsRepo.save(settings);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_settings_entity_1.UserSettings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map