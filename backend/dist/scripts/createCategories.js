"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const Category_1 = require("../entity/Category");
const initialCategories = [
    {
        name: "Infrastructure",
        description: "Issues related to roads, bridges, public buildings, etc."
    },
    {
        name: "Public Services",
        description: "Issues with government services, documentation, etc."
    },
    {
        name: "Environment",
        description: "Environmental concerns, pollution, waste management, etc."
    },
    {
        name: "Public Safety",
        description: "Safety concerns, security issues, emergency services, etc."
    },
    {
        name: "Education",
        description: "Issues related to schools, education facilities, etc."
    },
    {
        name: "Healthcare",
        description: "Healthcare facility issues, medical services, etc."
    },
    {
        name: "Transportation",
        description: "Public transport issues, traffic concerns, etc."
    },
    {
        name: "Utilities",
        description: "Water, electricity, internet service issues, etc."
    }
];
async function createCategories() {
    try {
        await data_source_1.AppDataSource.initialize();
        const categoryRepository = data_source_1.AppDataSource.getRepository(Category_1.Category);
        for (const categoryData of initialCategories) {
            const existingCategory = await categoryRepository.findOne({
                where: { name: categoryData.name }
            });
            if (!existingCategory) {
                const category = categoryRepository.create(categoryData);
                await categoryRepository.save(category);
                console.log(`Created category: ${category.name}`);
            }
            else {
                console.log(`Category already exists: ${categoryData.name}`);
            }
        }
        console.log("Categories setup completed!");
    }
    catch (error) {
        console.error("Error creating categories:", error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
    }
}
createCategories();
//# sourceMappingURL=createCategories.js.map