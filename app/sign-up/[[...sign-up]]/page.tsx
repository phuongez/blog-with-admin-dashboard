import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignUp
        routing="virtual"
        appearance={{
          elements: {
            card: "shadow-xl rounded-lg",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          },
        }}
      />
    </div>
  );
}
