import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const categories = await prisma.category.findMany({
			include: {
				_count: { select: { products: true } },
			},
			orderBy: { createdAt: 'desc' },
		});
		return NextResponse.json(
			{
				message: 'Categories fetched successfully',
				data: categories,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /categories error:', error);
		return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, slug } = body;

		if (!name || !slug) {
			return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
		}

		const existing = await prisma.category.findUnique({ where: { slug } });
		if (existing) {
			return NextResponse.json({ message: 'Category with this slug already exists' }, { status: 409 });
		}

		const newCategory = await prisma.category.create({ data: { name, slug } });
		return NextResponse.json({ message: 'Category created successfully', data: newCategory }, { status: 201 });
	} catch (error) {
		console.error('POST /categories error:', error);
		return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
	}
}
