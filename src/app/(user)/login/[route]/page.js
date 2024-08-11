import { LoginAccount } from "@/components/LoginAccount";

export default function Home({ params }) {
  return (
    <div>
      <LoginAccount params={params} />
    </div>
  );
}
