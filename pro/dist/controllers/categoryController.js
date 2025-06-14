"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const data_source_1 = require("../data-source");
const Category_1 = require("../entity/Category");
class CategoryController {
}
exports.CategoryController = CategoryController;
_a = CategoryController;
CategoryController.getAll = async (req, res) => {
    try {
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const categories = await categoryRepository.find({
            order: { name: "ASC" }
        });
        res.json(categories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            message: "Error fetching categories",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
};
CategoryController.getById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const category = await categoryRepository.findOne({
            where: { id },
            relations: ['complaints']
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    }
    catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({
            message: "Error fetching category",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
};
CategoryController.create = async (req, res) => {
    try {
        const { name, description, isActive = true } = req.body;
        // Validate required fields
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: "Category name is required" });
        }
        if (name.length > 100) {
            return res.status(400).json({ message: "Category name must not exceed 100 characters" });
        }
        if (description && description.length > 500) {
            return res.status(400).json({ message: "Description must not exceed 500 characters" });
        }
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        // Check if category with same name exists
        const existingCategory = await categoryRepository.findOne({
            where: { name: name.trim() }
        });
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }
        const category = categoryRepository.create({
            name: name.trim(),
            description: description?.trim(),
            isActive
        });
        await categoryRepository.save(category);
        res.status(201).json(category);
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            message: "Error creating category",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
};
CategoryController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        // Validate fields if provided
        if (name) {
            if (name.trim().length === 0) {
                return res.status(400).json({ message: "Category name cannot be empty" });
            }
            if (name.length > 100) {
                return res.status(400).json({ message: "Category name must not exceed 100 characters" });
            }
        }
        if (description && description.length > 500) {
            return res.status(400).json({ message: "Description must not exceed 500 characters" });
        }
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const category = await categoryRepository.findOne({
            where: { id },
            relations: ['complaints']
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        // Check if new name conflicts with existing category
        if (name && name !== category.name) {
            const existingCategory = await categoryRepository.findOne({
                where: { name: name.trim() }
            });
            if (existingCategory) {
                return res.status(400).json({ message: "Category with this name already exists" });
            }
        }
        // Update only provided fields
        if (name)
            category.name = name.trim();
        if (description !== undefined)
            category.description = description?.trim();
        if (isActive !== undefined)
            category.isActive = isActive;
        await categoryRepository.save(category);
        res.json(category);
    }
    catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({
            message: "Error updating category",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
};
CategoryController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        const category = await categoryRepository.findOne({
            where: { id },
            relations: ['complaints']
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        // Check if category has associated complaints
        if (category.complaints && category.complaints.length > 0) {
            return res.status(400).json({
                message: "Cannot delete category with associated complaints. Consider deactivating it instead."
            });
        }
        await categoryRepository.remove(category);
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            message: "Error deleting category",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
};
//# sourceMappingURL=categoryController.js.map