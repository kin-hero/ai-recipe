import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">ChefGPT</h1>

      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Welcome! You`&apos;re signed in.</p>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}
