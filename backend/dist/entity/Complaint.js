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
exports.Complaint = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Category_1 = require("./Category");
const Agency_1 = require("./Agency");
const ComplaintResponse_1 = require("./ComplaintResponse");
let Complaint = class Complaint {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Complaint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Complaint.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Complaint.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["pending", "in_progress", "resolved", "rejected"],
        default: "pending"
    }),
    __metadata("design:type", String)
], Complaint.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Complaint.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Complaint.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.complaints),
    __metadata("design:type", User_1.User)
], Complaint.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, category => category.complaints),
    __metadata("design:type", Category_1.Category)
], Complaint.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Agency_1.Agency, agency => agency.complaints),
    __metadata("design:type", Agency_1.Agency)
], Complaint.prototype, "agency", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ComplaintResponse_1.ComplaintResponse, response => response.complaint),
    __metadata("design:type", Array)
], Complaint.prototype, "responses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Complaint.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Complaint.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Complaint.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Complaint.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Complaint.prototype, "updatedAt", void 0);
Complaint = __decorate([
    (0, typeorm_1.Entity)()
], Complaint);
exports.Complaint = Complaint;
//# sourceMappingURL=Complaint.js.map