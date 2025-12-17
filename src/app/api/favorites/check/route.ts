import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get('userId');
		const productId = searchParams.get('productId');

		if (!userId || !productId) {
			return NextResponse.json({ message: 'User ID and Product ID are required' }, { status: 400 });
		}

		const favorite = await prisma.favorite.findUnique({
			where: {
				userId_productId: {
					userId,
					productId,
				},
			},
		});

		return NextResponse.json(
			{
				message: 'Check completed',
				data: {
					isFavorited: !!favorite,
					favoriteId: favorite?.id || null,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /favorites/check error:', error);
		return NextResponse.json(
			{
				message: 'Failed to check favorite status',
			},
			{ status: 500 }
		);
	}
}
