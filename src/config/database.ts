import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const createPrismaClient = async(databaseUrl: string) => {
    const prisma = new PrismaClient({
        datasourceUrl: databaseUrl
    }).$extends(withAccelerate())

    return prisma; 
}; 
