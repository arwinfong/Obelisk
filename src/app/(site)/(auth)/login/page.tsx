import React from "react";
import { buttonVariants } from "@src/components/ui/Button";
import { cn } from "@src/lib/utils";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FC } from "react";
import LoginForm from "@src/components/LoginForm";
import { Icons } from "@src/components/Icons";

const LoginPage: FC = () => {
	return (
		<div className="absolute inset-0">
			<div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
				<Link
					href="/"
					className={cn(
						buttonVariants({ variant: "ghost" }),
						"self-start -mt-32 relative"
					)}
				>
					<ChevronLeftIcon className="mr-2 h-4 w-4" />
					Home
				</Link>
				<div className="container mx-auto flex flex-col w-full justify-center space-y-6 ">
					<div className="flex flex-col space-y-2 text-center">
						<Icons.logo className="mx-auto h-16 w-16" />
					</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
