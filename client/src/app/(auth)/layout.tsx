import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center relative">
      <Image
        src="/discordBg.svg"
        alt="Discord Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        width={1920}
        height={1080}
      />
      {children}
    </div>
  );
}
