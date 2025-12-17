import prisma from '@/lib/prisma';

export default async function Home() {
	const users = await prisma.user.findMany();
	return (
		<div className="min-h-screen  flex flex-col items-center justify-center -mt-16">
			<ol className="list-decimal list-inside ">
				{users.map((user) => (
					<li key={user.id} className="mb-2">
						{user.email} - {user.role}- {user.username}
					</li>
				))}
			</ol>
		</div>
	);
}
