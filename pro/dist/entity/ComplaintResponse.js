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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintResponse = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Complaint_1 = require("./Complaint");
let ComplaintResponse = class ComplaintResponse {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ComplaintResponse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], ComplaintResponse.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Complaint_1.Complaint, complaint => complaint.responses),
    __metadata("design:type", Complaint_1.Complaint)
], ComplaintResponse.prototype, "complaint", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], ComplaintResponse.prototype, "respondedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ComplaintResponse.prototype, "createdAt", void 0);
ComplaintResponse = __decorate([
    (0, typeorm_1.Entity)()
], ComplaintResponse);
exports.ComplaintResponse = ComplaintResponse;
//# sourceMappingURL=ComplaintResponse.js.map