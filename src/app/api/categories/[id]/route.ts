import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Category ID is required' }, { status: 400 });
		}

		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				products: {
					select: {
						id: true,
						name: true,
						price: true,
						imageUrl: true,
					},
				},
				_count: {
					select: { products: true },
				},
			},
		});

		if (!category) {
			return NextResponse.json({ message: 'Category not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				message: 'Category fetched successfully',
				data: category,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /categories/[id] error:', error);
		return NextResponse.json({ message: 'Failed to fetch category' }, { status: 500 });
	}
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Category ID is required' }, { status: 400 });
		}

		const body = await request.json();
		const { name, slug } = body;

		if (!name && !slug) {
			return NextResponse.json(
				{
					message: 'At least one field (name or slug) is required',
				},
				{ status: 400 }
			);
		}

		// Check if category exists
		const existingCategory = await prisma.category.findUnique({
			where: { id },
		});

		if (!existingCategory) {
			return NextResponse.json({ message: 'Category not found' }, { status: 404 });
		}

		// If slug is being updated, check if new slug already exists
		if (slug && slug !== existingCategory.slug) {
			const slugExists = await prisma.category.findUnique({
				where: { slug },
			});

			if (slugExists) {
				return NextResponse.json(
					{
						message: 'Category with this slug already exists',
					},
					{ status: 409 }
				);
			}
		}

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: {
				...(name && { name }),
				...(slug && { slug }),
			},
		});

		return NextResponse.json(
			{
				message: 'Category updated successfully',
				data: updatedCategory,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('PUT /categories/[id] error:', error);
		return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Category ID is required' }, { status: 400 });
		}

		// Check if category exists
		const existingCategory = await prisma.category.findUnique({
			where: { id },
			include: {
				_count: {
					select: { products: true },
				},
			},
		});

		if (!existingCategory) {
			return NextResponse.json({ message: 'Category not found' }, { status: 404 });
		}

		// Check if category has products
		if (existingCategory._count.products > 0) {
			return NextResponse.json(
				{
					message: `Cannot delete category. It has ${existingCategory._count.products} product(s) associated with it`,
				},
				{ status: 409 }
			);
		}

		await prisma.category.delete({
			where: { id },
		});

		return NextResponse.json(
			{
				message: 'Category deleted successfully',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('DELETE /categories/[id] error:', error);
		return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
	}
}
