import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const orderItems = await prisma.orderItem.findMany();
		return NextResponse.json(
			{
				message: 'Order items fetched successfully',
				data: orderItems,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET /orderitems error:', error);
		return NextResponse.json(
			{
				message: `Failed to fetch order items`,
			},
			{ status: 500 }
		);
	}
}
