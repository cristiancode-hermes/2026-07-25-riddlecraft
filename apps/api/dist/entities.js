"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const user_entity_1 = require("./users/user.entity");
const user_settings_entity_1 = require("./users/user-settings.entity");
const category_entity_1 = require("./categories/category.entity");
const riddle_entity_1 = require("./riddles/riddle.entity");
const hint_entity_1 = require("./hints/hint.entity");
const daily_riddle_entity_1 = require("./daily-riddle/daily-riddle.entity");
const solve_attempt_entity_1 = require("./solve-attempts/solve-attempt.entity");
const achievement_entity_1 = require("./achievements/achievement.entity");
const user_achievement_entity_1 = require("./user-achievements/user-achievement.entity");
const comment_entity_1 = require("./comments/comment.entity");
exports.entities = [
    user_entity_1.User,
    user_settings_entity_1.UserSettings,
    category_entity_1.Category,
    riddle_entity_1.Riddle,
    hint_entity_1.Hint,
    daily_riddle_entity_1.DailyRiddle,
    solve_attempt_entity_1.SolveAttempt,
    achievement_entity_1.Achievement,
    user_achievement_entity_1.UserAchievement,
    comment_entity_1.Comment,
];
//# sourceMappingURL=entities.js.map