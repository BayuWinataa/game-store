import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
				_count: {
					select: {
						favorites: true,
						orderItems: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
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
				message: 'Failed to fetch products',
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, description, price, categoryId, imageUrl, videoUrl } = body;

		// Validation
		if (!name || !price) {
			return NextResponse.json({ message: 'Name and price are required' }, { status: 400 });
		}

		if (typeof price !== 'number' || price < 0) {
			return NextResponse.json({ message: 'Price must be a positive number' }, { status: 400 });
		}

		// Check if category exists
		if (categoryId) {
			const categoryExists = await prisma.category.findUnique({
				where: { id: categoryId },
			});
			if (!categoryExists) {
				return NextResponse.json({ message: 'Category not found' }, { status: 404 });
			}
		}

		const newProduct = await prisma.product.create({
			data: {
				name,
				description: description || null,
				price: Number(price),
				imageUrl: imageUrl || null,
				videoUrl: videoUrl || null,
				categoryId: categoryId || null,
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
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
				message: 'Failed to create product',
			},
			{ status: 500 }
		);
	}
}
