// Import Link component from Next.js for client-side navigation
import Link from "next/link";
// Import reusable Button component from UI library
import { Button } from "@/components/ui/button";

// Define NotFound component for handling 404 errors
export default function NotFound() {
  return (
    // Main container → centers content vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      {/* Display 404 error code */}
      <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
      {/* Heading indicating page not found */}
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      {/* Description message for user */}
      <p className="text-gray-600 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      {/* Navigation link to redirect user back to home page */}
      <Link href="/">
        <Button>Return Home</Button>
      </Link>

    </div>
  );
}
