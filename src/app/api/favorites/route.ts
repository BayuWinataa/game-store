import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const favorites = await prisma.favorite.findMany();
		return NextResponse.json(
			{
				message: 'Favorites fetched successfully',
				data: favorites,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /favorites error:', error);
		return NextResponse.json(
			{
				message: `Failed to fetch favorites`,
			},
			{ status: 500 }
		);
	}
}
