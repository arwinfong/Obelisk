// "use client";
import axios from "axios";
import React from "react";
import { PostData } from "@src/types";
import { Comment, PostLike } from "@prisma/client";
import UserProfile from "@src/components/UserProfile";
import ProfileTabs from "@src/components/ProfileTabs";

interface User {
	id: string;
	name: string;
	image?: string;
	username: string;
	bio: string;
	createdAt: Date;
	posts: PostData[];
	comments: Comment & { post: PostData }[];
	postLikes: PostLike & { post: PostData }[];
	_count: {
		followedBy: number;
	};
}

const getUserData = async (id: number) => {
	try {
		const response = await axios.get(`/api/user/${id}`);
		const res: User = response.data;
		res.createdAt = new Date(res.createdAt);
		return res;
	} catch (err) {
		console.log("Error fetching user data: ", err);
		return null;
	}
};

const Profile = async ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const userData = await getUserData(parseInt(id));
	if (!userData)
		return (
			<div className="w-full h-full text-xl text-muted-foreground flex flex-col items-center justify-center">
				<span>
					Whoops... <br />
					That user could not be found.
				</span>
			</div>
		);
	const profile = {
		user: {
			id: userData.id,
			name: userData.name,
			image: userData.image as string | null,
			username: userData.username,
			createdAt: userData.createdAt,
			bio: userData.bio
		},
		_count: {
			followedBy: userData._count.followedBy
		}
	};

	return (
		<div className="w-full h-full container flex flex-col items-center justify-center">
			<UserProfile profile={profile} />
			<ProfileTabs
				posts={userData.posts}
				comments={userData.comments}
				postLikes={userData.postLikes}
			/>
		</div>
	);
};
export default Profile;
