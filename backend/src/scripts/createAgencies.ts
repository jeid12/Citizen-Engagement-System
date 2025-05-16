import { AppDataSource } from "../data-source";
import { Agency } from "../entity/Agency";

const initialAgencies = [
    {
        name: "Ministry of Infrastructure",
        description: "Responsible for infrastructure development and maintenance",
        contactEmail: "info@mininfra.gov.rw",
        contactPhone: "+250 788 XXX XXX"
    },
    {
        name: "Rwanda Environment Management Authority",
        description: "Handles environmental concerns and conservation",
        contactEmail: "info@rema.gov.rw",
        contactPhone: "+250 788 XXX XXX"
    },
    {
        name: "Rwanda National Police",
        description: "Handles public safety and security concerns",
        contactEmail: "info@police.gov.rw",
        contactPhone: "+250 788 XXX XXX"
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
        await AppDataSource.initialize();
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
        await AppDataSource.destroy();
    }
}

createAgencies(); 