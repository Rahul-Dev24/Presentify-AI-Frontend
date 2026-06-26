import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-4">
			{/* The animate-spin class is a standard Tailwind utility */}
			<Loader2 className="h-10 w-10 animate-spin text-primary" />
			<p className="text-sm font-medium text-muted-foreground">Loading your content...</p>
		</div>
	);
}
