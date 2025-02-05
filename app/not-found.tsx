import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-netflix-primary">404</h1>
      <p className="text-gray-500 max-w-md text-center">
        The show you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Button as={NextLink} href="/">
        Back to Home
      </Button>
    </div>
  );
}
