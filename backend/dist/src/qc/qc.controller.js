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
exports.QCController = void 0;
const common_1 = require("@nestjs/common");
const qc_service_1 = require("./qc.service");
let QCController = class QCController {
    qcService;
    constructor(qcService) {
        this.qcService = qcService;
    }
    submit(taskId, data) {
        return this.qcService.submitQC(taskId, data);
    }
};
exports.QCController = QCController;
__decorate([
    (0, common_1.Post)(':taskId/submit'),
    __param(0, (0, common_1.Param)('taskId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], QCController.prototype, "submit", null);
exports.QCController = QCController = __decorate([
    (0, common_1.Controller)('qc'),
    __metadata("design:paramtypes", [qc_service_1.QCService])
], QCController);
//# sourceMappingURL=qc.controller.js.map