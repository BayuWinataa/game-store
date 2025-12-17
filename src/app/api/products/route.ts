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

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, description, price, categoryId, imageUrl, videoUrl } = body;
		const newProduct = await prisma.product.create({
			data: {
				name,
				description,
				price,
				imageUrl: imageUrl || null,
				videoUrl: videoUrl || null,
				categoryId: categoryId || null,
			},
		});
		return NextResponse.json(
			{
				message: 'Product created successfully',
				data: newProduct,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('POST /products error:', error);
		return NextResponse.json(
			{
				message: `Failed to create product`,
			},
			{ status: 500 }
		);
	}
}
