import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
		}

		const product = await prisma.product.findUnique({
			where: { id },
		});

		if (!product) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				message: 'Product fetched successfully',
				data: product,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /products/[id] error:', error);
		return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
	}
}
