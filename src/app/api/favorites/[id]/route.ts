import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Favorite ID is required' }, { status: 400 });
		}

		const favorite = await prisma.favorite.findUnique({
			where: { id },
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
				user: {
					select: {
						id: true,
						email: true,
						username: true,
					},
				},
			},
		});

		if (!favorite) {
			return NextResponse.json({ message: 'Favorite not found' }, { status: 404 });
		}

		return NextResponse.json(
			{
				message: 'Favorite fetched successfully',
				data: favorite,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /favorites/[id] error:', error);
		return NextResponse.json({ message: 'Failed to fetch favorite' }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json({ message: 'Favorite ID is required' }, { status: 400 });
		}

		// Check if favorite exists
		const existingFavorite = await prisma.favorite.findUnique({
			where: { id },
		});

		if (!existingFavorite) {
			return NextResponse.json({ message: 'Favorite not found' }, { status: 404 });
		}

		await prisma.favorite.delete({
			where: { id },
		});

		return NextResponse.json(
			{
				message: 'Removed from favorites successfully',
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('DELETE /favorites/[id] error:', error);
		return NextResponse.json({ message: 'Failed to remove from favorites' }, { status: 500 });
	}
}
