import { AppDataSource } from "../data-source";
import { Agency } from "../entity/Agency";

const initialAgencies = [
    {
        name: "Ministry of Infrastructure",
        description: "Responsible for infrastructure development and maintenance",
        contactEmail: "info@mininfra.gov.rw",
        contactPhone: "+250 788 123 456",
        address: "KG 7 Ave, Kigali",
        website: "www.mininfra.gov.rw",
        jurisdiction: "National",
        operatingHours: "Monday-Friday: 8:00 AM - 5:00 PM",
        isActive: true
    },
    {
        name: "Rwanda Environment Management Authority",
        description: "Handles environmental concerns and conservation",
        contactEmail: "info@rema.gov.rw",
        contactPhone: "+250 788 234 567",
        address: "KN 74 St, Kigali",
        website: "www.rema.gov.rw",
        jurisdiction: "National",
        operatingHours: "Monday-Friday: 8:00 AM - 5:00 PM",
        isActive: true
    },
    {
        name: "Rwanda National Police",
        description: "Handles public safety and security concerns",
        contactEmail: "info@police.gov.rw",
        contactPhone: "+250 788 345 678",
        address: "KN 3 Rd, Kigali",
        website: "www.police.gov.rw",
        jurisdiction: "National",
        operatingHours: "24/7",
        isActive: true
    },
    {
        name: "Ministry of Education",
        description: "Handles education-related issues",
        contactEmail: "info@mineduc.gov.rw",
        contactPhone: "+250 788 XXX XXX"
    },
    {
        name: "Ministry of Health",
        description: "Handles healthcare-related concerns",
        contactEmail: "info@moh.gov.rw",
        contactPhone: "+250 788 XXX XXX"
    },
    {
        name: "Rwanda Transport Development Agency",
        description: "Handles transportation infrastructure and services",
        contactEmail: "info@rtda.gov.rw",
        contactPhone: "+250 788 XXX XXX"
    },
    {
        name: "Water and Sanitation Corporation",
        description: "Handles water and sanitation services",
        contactEmail: "info@wasac.rw",
        contactPhone: "+250 788 XXX XXX"
    }
];

async function createAgencies() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        console.log("Database connection initialized");

        const agencyRepository = AppDataSource.getRepository(Agency);

        for (const agencyData of initialAgencies) {
            const existingAgency = await agencyRepository.findOne({
                where: { name: agencyData.name }
            });

            if (!existingAgency) {
                const agency = agencyRepository.create(agencyData);
                await agencyRepository.save(agency);
                console.log(`Created agency: ${agency.name}`);
            } else {
                console.log(`Agency already exists: ${agencyData.name}`);
            }
        }

        console.log("Agencies setup completed!");
    } catch (error) {
        console.error("Error creating agencies:", error);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

// Run the function
createAgencies().catch(error => {
    console.error("Failed to create agencies:", error);
    process.exit(1);
}); 