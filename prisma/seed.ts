import 'dotenv/config';
import { PrismaClient, Role } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {

	await prisma.user.upsert({
		where: { email: 'admin@tokokita.com' },
		update: {},
		create: {
			id: 'admin-uuid-001',
			email: 'admin@tokokita.com',
			username: 'admin',
			password: 'adminpassword',
			role: Role.ADMIN,
		},
	});

	await prisma.user.upsert({
		where: { email: 'user@tokokita.com' },
		update: {},
		create: {
			id: 'user-uuid-001',
			email: 'user@tokokita.com',
			username: 'user',
			password: 'userpassword',
			role: Role.USER,
		},
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
