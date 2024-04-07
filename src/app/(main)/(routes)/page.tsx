import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <p>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </p>
  );
}
