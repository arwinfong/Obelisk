// Retrieves list of trending posts
import prisma from "@src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/*
 * Takes 1 parameter, page number
 * returns pages of posts, 6 per page
 */



export const GET = async (req: NextRequest) => {
	const lastCursor = req.nextUrl.searchParams.get("lastCursor") as string;
	
	const numberOfPosts = 6;

	function earlyReturn(page: any[]) {
		// if less than 6 posts return those and add json value of "end"
		if (page.length < numberOfPosts) {
			const data = {
				posts: page,
				end: true
			};
			return NextResponse.json(data);
		}
	}

	if (lastCursor === "") {
		const trending = await prisma.post.findMany({
			take: numberOfPosts,
			include: {
				author: true,
				categories: true,
				likes: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});
		
		const res: NextResponse<unknown> | undefined = earlyReturn(trending);
		if (res) {
			return res;
		}
		
		const lastPost = trending[trending.length - 1];
		const cursor = lastPost.id;
		
		const data = {
			posts: trending,
			lastCursor: cursor,
		};

		
		return NextResponse.json(data);
		
	} else {
		const nextPage = await prisma.post.findMany({
			// Same as before, limit the number of events returned by this query.
			take: numberOfPosts,
			skip: 1, // Do not include the cursor itself in the query result.
			cursor: {
				id: lastCursor,
			},
			include: {
				author: true,
				categories: true,
				likes: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});


		const res: NextResponse<unknown> | undefined = earlyReturn(nextPage);
		if (res) {
			return res;
		}

		const lastPost = nextPage[nextPage.length - 1];
		const cursor = lastPost.id;
		
		const data = {
			posts: nextPage,
			lastCursor: cursor,
		};
				
		return NextResponse.json(data);
	}
};
