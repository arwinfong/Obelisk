/* eslint-disable react/jsx-key */
"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Post, User } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@src/components/ui/Button";
import { cn } from "@src/lib/utils";
import ProfileImage from "@src/components/ProfileImage";

type Response = {
	posts: Post & { author: User }[];
};

const fetchPosts = async (url: string) => {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch posts");
	}

	return response.json();
};

const SearchPage = () => {
	const search = useSearchParams();
	const searchQuery = search ? search.get("q") : null;
	const router = useRouter();

	const [viewByUser, setViewByUser] = useState(false);

	const encodedSearchQuery = encodeURI(searchQuery || "");

	const { data } = useSWR(`/api/search?q=${encodedSearchQuery}`, fetchPosts, {
		revalidateOnFocus: false
	});

	const res: Response = data;

	if (!encodedSearchQuery) {
		router.push("/");
	}

	if (!res?.posts) {
		return null;
	}
	if (res.posts.length === 0) {
		return (
			<div className="flex items-center justify-center h-screen text-2xl text-gray-500">
				No results found
			</div>
		);
	}

	// remove this soon
	const avatarURLs = [
		"/assets/icons/random_avatars/man.png",
		"/assets/icons/random_avatars/panda.png",
		"/assets/icons/random_avatars/rabbit.png",
		"/assets/icons/random_avatars/user.png"
	];

	return (
		<div className="divide-y divide-gray-200 bg-white rounded-md shadow p-2">
			{/* search metadata */}
			<div className="text-gray-700 py-4 mb-3">
				<div className="pl-3">
					<div className="font-bold text-2xl">
						Showing results for{" "}
						<span className="text-blue-600">{searchQuery}</span>
					</div>

					<div className="text-base font-light mt-1">
						({data.posts.length} posts, {data.users.length} users)
					</div>
				</div>

				<div className="flex items-center justify-left mt-4 pl-2 space-x-4">
					<button
						onClick={() => setViewByUser(false)}
						className={`font-bold py-2 px-4 rounded-full ${
							viewByUser
								? "bg-white text-gray-600"
								: "bg-gray-100 text-gray-900"
						} hover:bg-gray-200 transition`}
					>
						Posts
					</button>
					<button
						onClick={() => setViewByUser(true)}
						className={`font-bold py-2 px-4 rounded-full ${
							viewByUser
								? "bg-gray-100 text-gray-900"
								: "bg-white text-gray-600"
						} hover:bg-gray-200 transition`}
					>
						Users
					</button>
				</div>
			</div>

			{/* users data */}
			{viewByUser ? (
				data.users.length === 0 ? (
					<div className="flex items-center justify-center h-[70vh] text-2xl text-gray-500">
						No results found
					</div>
				) : (
					data.users.map((User: User) => (
						<Link
							className={cn(
								`${buttonVariants({ variant: "ghost" })}`,
								"flex flex-col items-start h-full w-full overflow-hidden"
							)}
							href={`/profile/${User.author.id}`}
						>
							<div className="flex items-center">
								<div	className="rounded-full h-12 w-12 mr-4">
									<ProfileImage	userId={User.author.id}/>
								</div>
								<div>
									<div className="text-sm text-gray-700">
										{User.author.username}
									</div>
								</div>
							</div>
						</Link>
					))
				)
			) : (
				// posts data
				data.posts.map((Post: Post) => (
					<Link
						className={cn(
							`${buttonVariants({ variant: "ghost" })}`,
							"flex flex-col items-start h-full w-full overflow-hidden"
						)}
						href={`/post/${Post.id}`}
					>
						<div className="flex items-center">
							<div	className="rounded-full h-12 w-12 mr-4">
								<ProfileImage	userId={Post.author.id}/>
							</div>
							{/* <img
								src={
									avatarURLs[
										(Post.author.username.charCodeAt(0) -
											"a".charCodeAt(0)) %
											avatarURLs.length
									]
								}
								alt="author's avatar"
								className="rounded-full h-12 w-12 mr-4"
							/> */}
							<div>
								<div className="text-sm text-gray-700">
									{Post.author.username}
								</div>
								<div className="text-lg font-semibold text-gray-900 mt-1">
									{Post.title}
								</div>
							</div>
						</div>
						<div className="text-sm text-gray-700 mt-2 truncate">
							{Post.content}
						</div>
						<div className="text-xs text-gray-500 mt-2">
							{new Date(Post.createdAt).toLocaleDateString()}
						</div>
					</Link>
				))
			)}
		</div>
	);
};

export default SearchPage;
