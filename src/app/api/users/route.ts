import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const users = await prisma.user.findMany();
		return NextResponse.json(
			{
				message: 'Users fetched successfully',
				data: users,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /users error:', error);
		return NextResponse.json(
			{
				message: `Failed to fetch users`,
			},
			{ status: 500 }
		);
	}
}
