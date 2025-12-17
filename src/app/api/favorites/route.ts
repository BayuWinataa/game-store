import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json({ message: 'User ID is required as query parameter' }, { status: 400 });
		}

		// Check if user exists
		const userExists = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userExists) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		const favorites = await prisma.favorite.findMany({
			where: { userId },
			include: {
				product: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

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
				message: 'Failed to fetch favorites',
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { userId, productId } = body;

		// Validation
		if (!userId || !productId) {
			return NextResponse.json({ message: 'User ID and Product ID are required' }, { status: 400 });
		}

		// Check if user exists
		const userExists = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userExists) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		// Check if product exists
		const productExists = await prisma.product.findUnique({
			where: { id: productId },
		});

		if (!productExists) {
			return NextResponse.json({ message: 'Product not found' }, { status: 404 });
		}

		// Check if already favorited
		const existingFavorite = await prisma.favorite.findUnique({
			where: {
				userId_productId: {
					userId,
					productId,
				},
			},
		});

		if (existingFavorite) {
			return NextResponse.json({ message: 'Product already in favorites' }, { status: 409 });
		}

		const newFavorite = await prisma.favorite.create({
			data: {
				userId,
				productId,
			},
			include: {
				product: {
					include: {
						category: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});

		return NextResponse.json(
			{
				message: 'Product added to favorites successfully',
				data: newFavorite,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('POST /favorites error:', error);
		return NextResponse.json(
			{
				message: 'Failed to add to favorites',
			},
			{ status: 500 }
		);
	}
}
