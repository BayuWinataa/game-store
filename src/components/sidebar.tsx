'use client';
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from './ui/sidebar';
import { IconSettings, IconUserBolt, IconHeart, IconShoppingCart, IconCategory, IconHome } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { FaGamepad, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

export function SidebarDemo({ children }: { children?: React.ReactNode }) {
	const links = [
		{
			label: 'Home',
			href: '/',
			icon: <IconHome className="h-6 w-6 shrink-0 text-white/80 group-hover:text-white transition-colors" />,
		},
		{
			label: 'Categories',
			href: '/categories',
			icon: <IconCategory className="h-6 w-6 shrink-0 text-white/80 group-hover:text-white transition-colors" />,
		},
		{
			label: 'Products',
			href: '/products',
			icon: <FaGamepad className="h-6 w-6 shrink-0 text-white/80 group-hover:text-white transition-colors" />,
		},
		{
			label: 'Orders',
			href: '/orders',
			icon: <IconShoppingCart className="h-6 w-6 shrink-0 text-white/80 group-hover:text-white transition-colors" />,
		},
		{
			label: 'Favorites',
			href: '/favorites',
			icon: <IconHeart className="h-6 w-6 shrink-0 text-white/80 group-hover:text-white transition-colors" />,
		},
	];
	const [open, setOpen] = useState(false);
	return (
		<div
			className={cn(
				'mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-300 bg-linear-to-br from-slate-100 to-gray-200 md:flex-row dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800',
				'h-screen '
			)}
		>
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10 border-0 shadow-2xl bg-[#182837]">
					<div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-3">
							{links.map((link, idx) => (
								<motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="group relative">
									<div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<SidebarLink link={link} className="relative z-10" />
								</motion.div>
							))}
						</div>
					</div>
					<div>
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}  className="group relative">
							<div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<SidebarLink
								link={{
									label: 'User',
									href: '/profile',
									icon: <FaUser className="h-8 w-8 shrink-0 rounded-full bg-white/20 p-1.5 text-white" />,
								}}
								className="relative z-10"
							/>
						</motion.div>
					</div>
				</SidebarBody>
			</Sidebar>
			{children}
		</div>
	);
}
export const Logo = () => {
	return (
		<Link href="/" className="relative z-20 flex items-center space-x-3 py-2">
			<motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="bg-white/20 p-2.5 rounded-lg shadow-lg">
				<FaGamepad className="text-3xl text-white" />
			</motion.div>
			<motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="font-bold whitespace-pre text-white text-2xl">
				PLAY
			</motion.span>
		</Link>
	);
};
export const LogoIcon = () => {
	return (
		<Link href="/" className="relative z-20 flex items-center py-2">
			<motion.div whileHover={{ scale: 1.2}} transition={{ duration: 0.3 }} className="bg-white/20 p-2 rounded-lg shadow-lg">
				<FaGamepad className="text-2xl text-white" />
			</motion.div>
		</Link>
	);
};
