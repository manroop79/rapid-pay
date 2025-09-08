import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    console.log("Initializing Prisma Client...");
    return new PrismaClient();
}

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma

export default prisma;