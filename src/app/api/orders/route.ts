import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const orders = await prisma.order.findMany();
		return NextResponse.json(
			{
				message: 'Orders fetched successfully',
				data: orders,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /orders error:', error);
		return NextResponse.json(
			{
				message: `Failed to fetch orders`,
			},
			{ status: 500 }
		);
	}
}
