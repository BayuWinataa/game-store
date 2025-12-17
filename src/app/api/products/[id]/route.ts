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

export async function PATCH(request: Request, { params }: Params) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
		}
		const body = await request.json();
		const { name, description, price, categoryId, imageUrl, videoUrl } = body;
		const updatedProduct = await prisma.product.update({
			where: { id },
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
