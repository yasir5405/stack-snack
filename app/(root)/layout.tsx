import Navbar from "@/components/navigation/navbar";

const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

export default RootLayout;
