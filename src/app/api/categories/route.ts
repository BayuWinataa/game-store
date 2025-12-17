import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const categories = await prisma.category.findMany();
		return NextResponse.json(
			{
				message: 'Categories fetched successfully',
				data: categories,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /categories error:', error);
		return NextResponse.json(
			{
				message: `Failed to fetch categories`,
			},
			{ status: 500 }
		);
	}
}