import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const products = await prisma.product.findMany();
		return NextResponse.json(
			{
				message: 'Products fetched successfully',
				data: products,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /products error:', error);
		return NextResponse.json(
			{
				message: `Failed to fetch products`,
			},
			{ status: 500 }
		);
	}
}
