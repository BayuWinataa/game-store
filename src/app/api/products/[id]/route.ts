import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
		}

		const product = await prisma.product.findUnique({
			where: { id },
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

export async function DELETE(request: Request, { params }: Params) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
		}

		// Check if product exists
		const product = await prisma.product.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						orderItems: true,
						favorites: true,
					},
				},
			},
		});

		if (!product) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		// Check if product has orders
		if (product._count.orderItems > 0) {
			return NextResponse.json(
				{
					message: `Cannot delete product. It has ${product._count.orderItems} order(s) associated with it`,
				},
				{ status: 409 }
			);
		}

		// Delete favorites first (cascade)
		if (product._count.favorites > 0) {
			await prisma.favorite.deleteMany({
				where: { productId: id },
			});
		}

		const deletedProduct = await prisma.product.delete({
			where: { id },
		});

		return NextResponse.json(
			{
				message: 'Product deleted successfully',
				data: deletedProduct,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('DELETE /products/[id] error:', error);
		return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: Params) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
		}

		// Check if product exists
		const existingProduct = await prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		const body = await request.json();
		const { name, description, price, categoryId, imageUrl, videoUrl } = body;

		// Validate at least one field is provided
		if (!name && !description && !price && categoryId === undefined && !imageUrl && !videoUrl) {
			return NextResponse.json({ message: 'At least one field is required for update' }, { status: 400 });
		}

		// Validate price if provided
		if (price !== undefined && (typeof price !== 'number' || price < 0)) {
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

		const updatedProduct = await prisma.product.update({
			where: { id },
			data: {
				...(name && { name }),
				...(description !== undefined && { description: description || null }),
				...(price !== undefined && { price: Number(price) }),
				...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
				...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
				...(categoryId !== undefined && { categoryId: categoryId || null }),
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
				message: 'Product updated successfully',
				data: updatedProduct,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('PUT /products/[id] error:', error);
		return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
	}
}
